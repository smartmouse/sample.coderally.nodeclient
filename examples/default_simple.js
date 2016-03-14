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

// Agent logic
myAgent.on('init', function (ourCar, track) {
	console.log('init occurred');
});

myAgent.on('onRaceStart', function (ourCar) {
	console.log("Race is starting");

	// Aggressive start
	var target = AIUtils.getClosestLane(ourCar.getCarStatus().getCheckPoint(), ourCar.getCarStatus().getPosition());
	ourCar.pushCarControl({
		carBrakePercent : 0,
		carAccelPercent : 100,
		carTarget : target
	})

});

myAgent.on('onCheckpointUpdated', function (ourCar, checkpoint) {
	var target = AIUtils.getClosestLane(ourCar.getCarStatus().getCheckPoint(), ourCar.getCarStatus().getPosition());
	ourCar.pushCarControl({
		carBrakePercent : 0,
		carAccelPercent : 100,
		carTarget : target
	});
	AIUtils.recalculateHeading(ourCar, 0.75);
});

myAgent.on('onStalled', function (ourCar) {
	AIUtils.recalculateHeading(ourCar, 1);
	ourCar.pushCarControl({
		carAccelPercent : 100,
		carBrakePercent : 0
	});
});

myAgent.on('onTimeStep', function (ourCar) {
	console.log("Position ", JSON.stringify(ourCar.getCarStatus().getPosition()));
	console.log("Lap ", JSON.stringify(ourCar.getCarStatus().getLap()));
	console.log("Place ", JSON.stringify(ourCar.getCarStatus().getPlace()));
	console.log("Acceleration ", JSON.stringify(ourCar.getCarStatus().getAcceleration()));
	console.log("Target ", JSON.stringify(ourCar.getCarStatus().getTarget()));
	console.log("Checkpoint ", JSON.stringify(ourCar.getCarStatus().getCheckPoint()));
	console.log(); // filler

	AIUtils.recalculateHeading(ourCar, 1); 
});