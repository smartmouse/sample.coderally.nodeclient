// Module Dependencies 
var EventEmitter = require('events').EventEmitter;
var WebSocket = require('ws');
var request = require('request');
var agentUtil = require('./agent_util.js');
var util = require('util');

// Object and Inheritance Setup
var Agent = function() {
	EventEmitter.call(this);
};
util.inherits(Agent, EventEmitter);

// Module Exports
module.exports = Agent;

Agent.prototype.enterRace = function enterRace(car) {
	var self = this;
	self.myCar = car;
	request.post({
		url: 'http://challenge-na.coderallycloud.com/CodeRallyWeb/SubmitVehicle',
		form: car
	}, function submitCarCallback(err, httpResponse, body) {
		if (err) {
			console.error('Error: ', err);
			return null;
		}

		var result = JSON.parse(body);
		if (result.success) {
			self.connect(car.agent_uuid);
		} else {
			console.log('Car submission failed!');
			console.log(body);
		}
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
		if (command == 'SET-CONNECTION-AGENT-RESPONSE') {
			connectionHandler(message);
		} else if (command == 'AGENT-LISTENER-API') {
			apiHandler(message);
		} else {
			console.log(message);
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
		self.emit(messageEvent, messageJSON);
	}
};

Agent.prototype.push = function(event, json) {
	var apiMessage = 'AGENT-LISTENER-API-RESPONSE event:(' + event 
			+') responseId:(' + JSON.stringify(json) + ')';
		self.socket.send(apiResponse);
	self.socket.send(apiMessage);
}