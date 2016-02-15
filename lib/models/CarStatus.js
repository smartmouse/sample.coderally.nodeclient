var _ = require('lodash');
// CarStatus Constructor
// Create new object with access to related methods
// Pass in JSON object extracted from server response
function CarStatus(obj) {
	// Reference for <this> within constructor scope
	var self = this;

	// Private Fields
	var status = {
		position: obj.position,
		rotation: obj.rotation,
		acceleration: obj.acceleration,
		checkpoint: obj.checkpoint,
		carBody: obj.carBody,
		lap: obj.lap,
		place: obj.place,
		damage: obj.damage,
		destroyed: obj.destroyed,
		target: obj.target
	};

	// Public Getter/Setter functions that has access private fields (due to {} scope)
	// This makes it accessible to the global scope here
	// Only allow reading here, to prevent accidental change to information
	self.getPosition = function () {return status.position;}			// Vec2 object indicating current car position
	self.getRotation = function () {return status.rotation;}			// Rotation object with angular value in radians
	self.getAcceleration = function () {return status.acceleration;}	// acceleration in MPH per second
	self.getCheckPoint = function () {return status.checkpoint;}		// CheckPoint object indicating current car's checkpoint
	self.getCarBody = function () {return status.carBody;}				// CarBody object indicating current car body's heading
	self.getLap = function () {return status.lap;}						// Integer value indicating the lap number that the car is currently on
	self.getPlace = function () {return status.place;}					// Integer value indicating current race place to others
	self.getDamage = function () {return status.damage;}				// Integer value of accumulated damage
	self.isDestroyed = function () {return status.destroyed;}			// Boolean value indicating destroyed status
	self.getTarget = function () {return status.target;}				// Vec2 object indicating target position that the car is heading towards
	self.getStatus = function () {return status;}

	self.update = function (obj) {
		_.merge(status, obj));
	}
};

// Export the CarStatus object
module.exports = CarStatus;