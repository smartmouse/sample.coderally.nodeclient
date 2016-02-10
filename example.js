var Agent = require('./index.js');

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
});

myAgent.on('init', function(ourCar, track) {
	console.log('init');
});

myAgent.on('onRaceStart', function(ourCar) {
	// Option 1: Set control locally THEN push to server
	ourCar.setCarControl({
		accelPercent: 75,
		brakePercent: 0
	});
	ourCar.pushCarControl();

});

myAgent.on('onCarCollision', function(ourCar, otherCar) {
	// Option 2: Push directly to server
	ourCar.pushCarControl({
		brakePercent: 70
	});
});

myAgent.on('onTimeStep', function(ourCar) {
	console.log(ourCar.getCarStatus().getStatus());
});