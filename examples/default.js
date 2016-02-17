var Agent = require('../index.js');
var AIUtils = Agent.AIUtils;

var myAgent = new Agent();

myAgent.enterRace({
	track_id : "0",
	username : "karan_challenge_na",
	user_id : "963",
	uniqueUserid : "116650285099720794308",
	file_name : "Testcar",
	vehicle_type: "car_yellow",
	accel : "1",
	weight : "1",
	armor : "0",
	traction : "0",
	turning : "1"
}, 'challenge-na.coderallycloud.com');

// Agent/Car variables used during race
const RaceStrategy = {
	RACE : 0, 				// General strategy
	OFFTRACK : 1, 			// Car is off track
	AVOID : 2, 				// Car is avoiding an obstacle
	ATTACK : 3 				// Car is attacking another car
};
const OpponentInProximityAI = {
	AVOID : 0,				// Avoid
	IGNORE : 1,				// Ignore
	ATTACK : 2, 			// Attempt to crash into
	MOVE_ALONGSIDE : 3		// Attempt to pass
};
const CheckpointAI = {
	ACCELERATE : 0, 		// Accelerate for corners
	OVERCOMPENSATE : 1, 	// Maintain speed for corners
	UNDERCOMPENSATE : 2, 	// Slow for corners
};
const OffTrackAI = {
	ACCELERATE : 0, 		// Accelerate
	STOP_AND_REALIGN : 1,	// Slow down
	IGNORE : 2				// Maintain speed
};

var prevPosition = null; // (x, y) coordinate
var currentStrategy = RaceStrategy.RACE;
var currentCheckpointAI = CheckpointAI.OVERCOMPENSATE;
var currentOffTrackAI = OffTrackAI.STOP_AND_REALIGN;
var currentOpponentInProximityAI = OpponentInProximityAI.IGNORE;

// Agent logic
myAgent.on('init', function (ourCar, track) {
	console.log('init occurred');
});

myAgent.on('onRaceStart', function (ourCar) {
	console.log("Race is starting");
	prevPosition = ourCar.getCarStatus().getPosition();

	// Aggressive start
	var target = AIUtils.getClosestLane(ourCar.getCarStatus().getCheckPoint(), ourCar.getCarStatus().getPosition());
	ourCar.pushCarControl({
		carBrakePercent : 0,
		carAccelPercent : 100,
		carTarget : target
	})

});

myAgent.on('onCheckpointUpdated', function (ourCar, checkpoint) {
	if (ourCar != null && ourCar.getCarStatus().isDestroyed()) return;

	if (currentStrategy == RaceStrategy.OFFTRACK) {
		currentStrategy = RaceStrategy.RACE
	} else if (currentStrategy != RaceStrategy.RACE) {
		return;
	}

	var target = AIUtils.getClosestLane(ourCar.getCarStatus().getCheckPoint(), ourCar.getCarStatus().getPosition());

	if (currentCheckpointAI == CheckpointAI.ACCELERATE) {
		ourCar.pushCarControl({
			carBrakePercent : 0,
			carAccelPercent : 100
		});
	} else if (currentCheckpointAI == CheckpointAI.UNDERCOMPENSATE) {
		AIUtils.recalculateHeading(ourCar, 1.33);
	} else if (currentCheckpointAI == CheckpointAI.OVERCOMPENSATE) {
		AIUtils.recalculateHeading(ourCar, 0.85);
	}
});

myAgent.on('onOffTrack', function (ourCar) {
	if (ourCar != null && ourCar.getCarStatus().isDestroyed()) return;

	if (currentOffTrackAI == OffTrackAI.ACCELERATE) {
		currentStrategy = RaceStrategy.OFFTRACK;
		var target = AIUtils.getIntersectionPoint(ourCar.getCarStatus().getCheckPoint(), 
			ourCar.getCarStatus().getRotation(), ourCar.getCarStatus().getPosition());

		ourCar.pushCarControl({ 
			carTarget: target
		});
		AIUtils.recalculateHeading(ourCar, 0.75);
	} else if (currentOffTrackAI == OffTrackAI.STOP_AND_REALIGN) {
		currentStrategy = RaceStrategy.OFFTRACK;
		var target = AIUtils.getIntersectionPoint(ourCar.getCarStatus().getCheckPoint(), 
			ourCar.getCarStatus().getRotation(), ourCar.getCarStatus().getPosition());

		ourCar.pushCarControl({
			carBrakePercent : 100,
			carAccelPercent : 0,
			carTarget : target
		});
	} else if (currentOffTrackAI == OffTrackAI.IGNORE) {
		// Do nothing
	}
});

myAgent.on('onCarCollision', function (ourCar, otherCar) {
	if (ourCar != null && ourCar.getCarStatus().isDestroyed()) return;

	if (currentStrategy == RaceStrategy.ATTACK) {
		currentStrategy = RaceStrategy.RACE;
	} else if (currentStrategy != RaceStrategy.RACE) {
		return; 
	}

	if (ourCar.getCarControl().getCarTarget() == otherCar.target) {
		var target = AIUtils.getAlternativeLane(ourCar.getCarStatus().getCheckPoint(),
			ourCar.getCarStatus().getPosition());

		ourCar.pushCarControl({ 
			carTarget : target 
		});
	}

	AIUtils.recalculateHeading(ourCar, 1);
	ourCar.pushCarControl({
		carAccelPercent : 100,
		carBrakePercent : 0
	})
});

myAgent.on('onOpponentInProximity', function (ourCar, otherCar) {
	if (ourCar != null && ourCar.getCarStatus().isDestroyed()) return;

	if (currentOpponentInProximityAI == OpponentInProximityAI.AVOID) {
		// Avoid strategy
	} else if (currentOpponentInProximityAI == OpponentInProximityAI.IGNORE) {
		// Do nothing
	} else if (currentOpponentInProximityAI == OpponentInProximityAI.ATTACK) {
		// Attack strategy
	} else if (currentOpponentInProximityAI == OpponentInProximityAI.MOVE_ALONGSIDE) {
		// Move alongiside strategy
	}
});

myAgent.on('onObstacleInProximity', function (ourCar, obstacle) {
	if (ourCar != null && ourCar.getCarStatus().isDestroyed()) return;

	// Logic for avoiding obstacles goes here
});

myAgent.on('onTimeStep', function (ourCar) {
	if (prevPosition == null) {
		return; // race hasn't started yet
	}

	if (ourCar != null && ourCar.getCarStatus().isDestroyed()) return;

	console.log("Position ", JSON.stringify(ourCar.getCarStatus().getPosition()));
	console.log("Lap ", JSON.stringify(ourCar.getCarStatus().getLap()));
	console.log("Place ", JSON.stringify(ourCar.getCarStatus().getPlace()));
	console.log(); // filler


	if (currentStrategy == RaceStrategy.RACE) {
		var a = AIUtils.getDistanceSquared(prevPosition, ourCar.getCarControl().getCarTarget());
		var b = AIUtils.getDistanceSquared(ourCar.getCarStatus().getPosition(), 
			ourCar.getCarControl().getCarTarget());
		var c = AIUtils.getDistanceSquared(prevPosition, ourCar.getCarStatus().getPosition());

		if (a < b || c < 0.1) {
			AIUtils.recalculateHeading(ourCar, 1);
		}
	} else if (currentStrategy == RaceStrategy.OFFTRACK) {
		var normalized_velocity = 1; // TODO: Add logic
		if (currentOffTrackAI == OffTrackAI.STOP_AND_REALIGN && normalized_velocity < 5) {
			AIUtils.recalculateHeading(ourCar, 1);
		}
	} else if (currentStrategy == RaceStrategy.AVOID) {
		// No logic yet
	} else if (currentStrategy == RaceStrategy.ATTACK) {
		// No logic yet
	}

	prevPosition = ourCar.getCarStatus().getPosition();
});

myAgent.on('onStalled', function (ourCar) {
	AIUtils.recalculateHeading(ourCar, 1);
	ourCar.pushCarControl({
		carAccelPercent : 100,
		carBrakePercent : 0
	})
});

myAgent.on('onRaceEnd', function (raceID) {
	console.log("Race finished. ID: " + raceID);
});
