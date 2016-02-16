// Module Dependencies 
var EventEmitter = require('events').EventEmitter;
var WebSocket = require('ws');
var request = require('request');
var agentUtil = require('./AgentUtils.js');
var uuid = require('uuid');
var util = require('util');

var Car = require('./Car.js');
var CarControl = require('./CarControl.js');

// Object and Inheritance Setup
var Agent = function() {
	EventEmitter.call(this);
};
util.inherits(Agent, EventEmitter);

// Module Exports
module.exports = Agent;

Agent.prototype.enterRace = function enterRace(carData) {
	var self = this;
	var control = new CarControl();
	carData.agent_uuid = uuid.v4(); 

	self.ourCar = new Car({
		carAttributes: carData,
		carControl: control
	});

	request.post({
		url: 'http://challenge-na.coderallycloud.com/CodeRallyWeb/SubmitVehicle',
		form: carData
	}, function submitCarCallback(err, httpResponse, body) {
		if (err) {
			console.error('Error: ', err);
			return null;
		}

		var result = JSON.parse(body);
		if (result.success) {
			self.connect(carData.agent_uuid);
		} else {
			console.error('Car submission failed!');
			console.error(body);
		}
	});

	control.on('updateCarControl', function(newControl) {
		self.push('setTarget', newControl.getCarTarget());
		self.push('setAccelerationPercent', {'percent': newControl.getAccelerationPercent()});
		self.push('setBrakePercent', {'percent': newControl.getBrakePercent()});
	});
};

Agent.prototype.connect = function socketConnect(agent_uuid) {
	var connectionStr = 'ws://challenge-na.coderallycloud.com/CodeRallyWeb/WSAgentEndpoint';
	var self = this;
	self.responseId = 0;
	self.socket = new WebSocket(connectionStr);

	self.socket.on('open', openHandler);
	self.socket.on('close', closeHandler);

	self.socket.on('message', function messageHandler(message, flags) {
		var command = agentUtil.extractCommand(message);

		switch (command) {
			case 'SET-CONNECTION-AGENT-RESPONSE':
				connectionHandler(message);
				break;

			case 'AGENT-LISTENER-API':
				apiHandler(message);
				break;

			default:
				if ((message == 'RACE-EVENT-START') || (message == 'RACE-EVENT-END')) {
					raceEventHandler(message);
				} else {
					console.error('Socket command not recognized');
					console.error(message);
				}
				break;
		}
	});

	// Handles initial connection to websocket agent endpoint
	function openHandler() {
		console.log('Connecting to websocket..');
		var message = 'SET-CONNECTION-AGENT'
			+ ' uuid:(' + agent_uuid + ') '
			+ ' circumstance:(FIRST_CONNECT) '
			+ ' last-reconnect-num:(-1) ';
		self.socket.send(message);
	}

	// Handles disconnection from websocket agent endpoint
	function closeHandler() {
		console.log('Disconnecting from websocket..');
	}

	// Handles messages entailing to the socket connection
	function connectionHandler(data) {
		console.log(data);
		var success = agentUtil.extractResult(data);
		if (success == 'false') { 
			console.log('Try changing the agent_uuid to something else (random is fine)');
			self.socket.close();
			return;
		}
		self.socket.send('IDLE');
	}

	// Handles messages entailing to Agent-Listener-API
	function apiHandler(data) {
		var messageEvent = agentUtil.extractEvent(data);
		var messageJSON = JSON.parse(agentUtil.extractJSON(data));
		var apiResponse = 'AGENT-LISTENER-API-RESPONSE event:(' + messageEvent 
			+') responseId:(' + self.responseId + ')';
		self.socket.send(apiResponse);
		self.responseId++;

		// Update our car
		(messageEvent == 'init') 
			? self.ourCar.update(messageJSON.ourCarData)
			: self.ourCar.update(messageJSON.ourCar);

		switch(messageEvent) {
			case 'onTimeStep':
			case 'onRaceStart':
			case 'onOffTrack':
			case 'onStalled':
				self.emit(messageEvent, self.ourCar);
				break;
			case 'init':
				self.emit(messageEvent, self.ourCar, messageJSON.track);
				break;
			case 'onOpponentInProximity':
			case 'onCarCollision':
				self.emit(messageEvent, self.ourCar, messageJSON.otherCar);
				break;
			case 'onObstacleInProximity':
			case 'onObstacleCollision':
				self.emit(messageEvent, self.ourCar, messageJSON.obstacle);
				break;
			case 'onCheckpointUpdated':
				self.emit(messageEvent, self.ourCar, messageJSON.checkpoint);
				break;
			case 'default':
				console.log('Unrecognized event occurred ' + messageEvent);
				break;
		}
	}

	function raceEventHandler (data) {
		self.emit(data);
	}

	self.on('RACE-EVENT-START', function () {
		console.log('THE RACE HAS BEGUN!');
	});

	self.on('RACE-EVENT-END', function () {
		console.log('THE RACE HAS ENDED!');
	});
};

Agent.prototype.push = function(event, json) {
	var self = this;
	var apiMessage = 'AGENT-LISTENER-API event:(' + event 
			+ ') responseId:(' + JSON.stringify(json) + ')';
	self.socket.send(apiMessage);
}