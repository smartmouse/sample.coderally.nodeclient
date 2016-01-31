var AgentEmitter = require('./lib/agent.js');

var agent = new AgentEmitter();

agent.enterRace({
	user_id : "963",
	track_id : "0",
	vehicle_type: "car_yellow",
	username : "karan_challenge_na",
	uniqueUserid : "116650285099720794308",
	agent_uuid : "914551eb-95ef-422c-8555-c41a3555440d",
	file_name : "Testcar",
	accel : "1",
	weight : "1",
	armor : "0",
	traction : "0",
	turning : "1" 
});

agent.on('init', function(data) {
	console.log('init');
});
agent.on('onTimeStep', function(data) {
	console.log('onTimeStep');
	console.log(data);
});