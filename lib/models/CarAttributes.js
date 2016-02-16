// Refer to thbanks | CodeRallyProd/CodeRallyShared/src/com/ibm/coderally/entity/cars/CarAttributes.java

// Private (Global within this module)
// Remeber, in Javascript, variable scope is defined within {}
const BASE_ACCELERATION = 20;	// Base acceleration for a car that invests no points, in MPH per second
const BASE_WEIGHT = 10000;		// Base weight for a car that invests no points, in newtons
const BASE_TURNING = 20;		// Base degrees of turning per second for a car that invests no points
const TRACTION_DIVISOR = 2;
const scale = 1.1249977; // Number.MIN_VALUE; // NOTE: DEPENDS ON TRACK'S SCALE, currently set to Desert 

// CarAttribute Constructor
function CarAttributes (obj) {
	// Reference for <this> within constructor scope
	var self = this;

	// Private Fields
	var attributes = {
		name: obj.name,
		acceleration: obj.acceleration,
		weight: obj.weight,
		armor: obj.armor,
		traction: obj.traction,
		turning: obj.turning
	};

	// Public Getter/Setter functions that has access private fields (due to {} scope)
	// This makes it accessible to the global scope here
	// Only allow reading, to prevent accidental change to information
	self.getName = function () {return attributes.name;}
	self.getAccelerationPoints = function () {return attributes.acceleration;}
	self.getWeightPoints = function () {return attributes.weight;}
	self.getArmorPoints = function () {return attributes.armor;}
	self.getTractionPoints = function () {return attributes.traction;}
	self.getTurningPoints = function () {return attributes.turning;}
	self.getAttributes = function () {return attribute;}

	// Public methods
	// Get the total amount of points between all attributes
	self.getTotalPoints = function () {
		return attributes.acceleration + attributes.weight + attributes.armor +
				attributes.traction + attributes.turning;
	}

	// Return the acceleration of the car, in MPH per second
	self.getAcceleration = function () {
		var multiplier = this.getAccelerationPoints() / this.getTotalPoints();
		return BASE_ACCELERATION * multiplier * scale;
	}

	self.getTurningDegrees = function () {
		var multiplier = self.getTurningPoints() / self.getTotalPoints() + 1;
		return BASE_TURNING * multiplier * scale;
	}
};


// Export the CarAttribute Object
module.exports = CarAttributes;