var math = require('mathjs');

exports.getClosestLane = function (checkpoint, pos) {
	var checkpoint_center = getCenter(checkpoint);
	var start_mid = getMidpoint(checkpoint_center, checkpoint.start);
	var end_mid = getMidpoint(checkpoint_center, checkpoint.end);

	return getDistanceSquared(pos, start_mid) > getDistanceSquared(pos, end_mid)
		? start_mid
		: end_mid;
}

exports.getAlternativeLane = function (checkpoint, pos) {
	var checkpoint_center = getCenter(checkpoint);
	var start_mid = getMidpoint(checkpoint_center, checkpoint.start);
	var end_mid = getMidpoint(checkpoint_center, checkpoint.end);

	if (getDistanceSquared(pos, end_mid) < getDistanceSquared(pos, start_mid)) {
		if (getDistanceSquared(pos, checkpoint_center) < getDistanceSquared(pos, end_mid)) {
			return checkpoint_center;
		} else {
			return start_mid;
		}
	} else if (getDistanceSquared(pos, checkpoint_center) < getDistanceSquared(pos, start_mid)) {
		return checkpoint_center;
	} else { 
		return end_mid;
	}
}

exports.recalculateHeading = function (car, bias) {
	var target = car.getCarControl().getCarTarget();

	// Predicts how far the car can turn in 1 second
	var turn = math.abs(calculateHeading(car, target));
	var degreesPerSecond = car.getCarAttributes().getTurningDegrees();

	var distance = getDistance(car.getCarStatus().getPosition(), target);
	var vel = car.getCarStatus().getCarBody().velocity;
	var vel_magnitude = math.sqrt(math.pow(vel.x, 2) + math.pow(vel.y, 2));
	var accel = car.getCarStatus().getAcceleration();
	var accel_magnitude = math.sqrt(math.pow(accel.x, 2) + math.pow(accel.y, 2));

	var predictedVelocity = math.pow(math.sqrt(vel_magnitude) + math.sqrt(accel_magnitude), 2);
	var seconds = distance / (predictedVelocity * 5280 / 3600);
	seconds = seconds * bias;

	var predictedTurn = degreesPerSecond * seconds;

	var control = {};
	if (predictedTurn * 7 < turn) {
		control.carBrakePercent = 100;
		control.carAccelPercent = 0;
	} else if (predictedTurn * 6 < turn) {
		control.carBrakePercent = 80;
		control.carAccelPercent = 0;
	} else if (predictedTurn * 5 < turn) {
		control.carBrakePercent = 60;
	} else if (predictedTurn * 4 < turn) {
		control.carBrakePercent = 40;
		control.carAccelPercent = 0;
	} else if (predictedTurn * 3 < turn) {
		control.carAccelPercent = 20;
		control.carBrakePercent = 0;
	} else if (predictedTurn * 2 < turn) {
		control.carAccelPercent = 20;
		control.carBrakePercent = 0;
	} else if (predictedTurn * 1.5 < turn) {
		control.carAccelPercent = 50;
		control.carBrakePercent = 0;
	} else if (predictedTurn < turn) {
		control.carAccelPercent = 70;
		car.carBrakePercent = 0;
	} else {
		car.carAccelPercent = 100;
		car.carBrakePercent = 0;
	}

	car.pushCarControl(control);
}

exports.getIntersectionPoint = function (checkpoint, rotation, point) {
	var threshold = getDistance(checkpoint.start, checkpoint.end) / 2 + 10;
	return getIntersectionPointWithThreshold(checkpoint, rotation, point, threshold);
};

exports.getDistanceSquared = getDistanceSquared;

// Helper functions
function getCenter(checkpoint) {
	var start = checkpoint.start;
	var end = checkpoint.end;

	return getMidpoint(start, end);
}

function getMidpoint(pointA, pointB) {
	return {
		x : ((pointA.x + pointB.x) / 2),
		y : ((pointA.y + pointB.y) / 2)
	}
}

function getDistance(position, point) {
	return math.sqrt(getDistanceSquared(position, point));
}

function getDistanceSquared(position, point) {
	var a = ((position.x - point.x) * (position.x - point.x))
	var b = ((position.y - point.y) * (position.y - point.y));
	return a + b;
}

function calculateHeading(car, point) {
	var position = car.getCarStatus().getPosition();

	var desired_heading = (getHeadingTo(position, point) + 90) % 360;
	var current_heading = car.getCarStatus().getRotation();

	var degrees = desired_heading - current_heading;

	if (degrees > 180) {
		degrees -= 360;
	} else if (degrees < -180) {
		degrees += 360
	}

	return degrees;
}

function getHeadingTo(pointA, pointB) {
	var radians = math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);
	var heading_in_rad = math.unit(radians, 'rad');
	var heading_in_deg = heading_in_rad.toNumber('deg');

	if (heading_in_deg < 0) {
		heading_in_deg += 360;
	}

	return heading_in_deg;
}

function getIntersectionPointWithThreshold(checkpoint, rotation, point, threshold) {
	var rotation_in_radians = rotation.radians;

	var o2x = math.cos(rotation_in_radians) * 100;
	var o2y = math.sin(rotation_in_radians) * 100;

	var thisLine = {
		start : {
			x : checkpoint.start.x,
			y : checkpoint.start.y
		},
		end : {
			x : checkpoint.end.x,
			y : checkpoint.end.y
		}
	};
	var otherLine = {
		start : {
			x : point.x,
			y : point.y
		},
		end : {
			x : o2x,
			y : o2y
		}
	};

	var result = intersection(thisLine, otherLine);

	if (getDistanceSquared(result, getCenter(checkpoint)) > math.pow(threshold, 2)) {
		return getCenter(checkpoint);
	}

	return result;
}

function intersection(lineA, lineB) {
	return math.intersect(
		[lineA.start.x, lineA.start.y],
		[lineA.end.x, lineA.end.y],
		[lineB.start.x, lineB.start.y],
		[lineB.end.x, lineB.end.y]
	);
}