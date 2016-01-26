var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var util = require('util');

// CarControl Constructor
function CarControl (obj) {
	// Reference for <this> within constructor scope
	var self = this;

	// Private fields
	// Default Control
	var control = {
		carTarget: {
			x: 0,
			y: 0
		},
		carAccelPercent: 0,
		carBrakePercent: 0
	};
	// Let user override their own Control
	control = _.merge(control,
		_.pick(obj, ["carTarget", "carAccelPercent", "carBrakePercent"]));

	// Public Getter/Setter functions that has access private fields (due to {} scope)
	// This makes it accessible to the global scope here
	self.getCarTarget = function () {return control.carTarget;}
	self.getBrakePercent = function () {return control.carBrakePercent;}
	self.getAccelerationPercent = function () {return control.carAccelPercent;}
	self.getControl = function () {return control;}

	self.setCarTarget = function (carTarget) {
		control.carTarget = carTarget;
	}

	self.setBrakePercent = function (brakePercent) {
		control.carBrakePercent = brakePercent;
	}

	self.setAccelerationPercent = function (accelPercent) {
		control.carAccelPercent = accelPercent;
	}

	self.setControl = function (obj) {
		control = _.merge(control,
			_.pick(obj, ["carTarget", "carAccelPercent", "carBrakePercent"]));
	}

	EventEmitter.call(this);
};

util.inherits(CarControl, EventEmitter);

// Export the CarAttribute Object
module.exports = CarControl;