# Code-Rally (Node.js Version)

Want to learn the popular Node.js while having fun? Then try the new Node.js version of IBM's Code Rally! Whether you are a complete Node Newbie, or an experienced Node.js veteran, test and hone your skills on the race track!

For more information, see the <a target="_blank" href="https://www.ibm.com/developerworks/community/blogs/code-rally/entry/landing?lang=en">Offical Code Rally Blog</a>!

## Installation

There are two ways to get Code Rally (Node.js) running on your machine! Assuming that you have already <a target="_blank" href="https://nodejs.org/en/">Node.js</a> with NPM installed.

1. Use `npm install --save coderally-agent` at your Node application directory

2. Clone this GitHub repository directly to your Node application directory with `git clone`

## Code Examples

### Entering a race

	var Agent = require('../index.js');
	var myAgent = new Agent();

	...

	myAgent.enterRace({
		track_id : "0",
		username : "karan_challenge_na",
		user_id : "963",
		uniqueUserid : "116650285099720794308", // OPTIONAL IF OAUTH DISABLED ON SERVER
		file_name : "Testcar",
		vehicle_type: "car_yellow",
		accel : "1",
		weight : "1",
		armor : "0",
		traction : "0",
		turning : "1" 
	}, 'challenge-na.coderallycloud.com');

### Implementing a car AI

	var AIUtils = Agent.AIUtils;

	...

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

## Reference

### agent.js

### enterRace(raceObj, serverURI)

### AIUtils.js

#### getClosestLane(checkpoint, position) 

## Contributing

Currently contributed by IBM Canada's Node Enterprise Team, with technical feedback and support by the Code Rally Team.

## History

* [Jan 2016]
  - Project Kickoff!
  - Functional design drafted and approved
  - GitHub Repository Created

* [Feb 2016]
  - Designed Code Rally Node Module structure
  - README.md v1.0.0
  - Entering race functionality implemented 
  - Websocket support for updating race car in realtime

## Credits

Karan (S.) Randhawa, Kelvin Chan

## License

<pre>
*******************************************************************************
 * [Restricted Materials of IBM] - Use restricted, please refer to the "SOURCE
 * COMPONENTS AND SAMPLE MATERIALS" and the "PROHIBITED USES" terms and
 * conditions in the IBM International License Agreement for non warranted IBM
 * software (ILA).
 * 
 * Code Rally
 * 
 * (c) Copyright IBM Corporation 2012.
 * 
 * U.S. Government Users Restricted Rights:  Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp. 
 * 
 * From the ILA for non warranted IBM software:
 * 
 * SOURCE COMPONENTS AND SAMPLE MATERIALS
 * 
 * The Program may include some components in source code form ("Source
 * Components") and other materials identified as Sample Materials. Licensee
 * may copy and modify Source Components and Sample Materials for internal use
 * only provided such use is within the limits of the license rights under this
 * Agreement, provided however that Licensee may not alter or delete any
 * copyright information or notices contained in the Source Components or Sample
 * Materials. IBM provides the Source Components and Sample Materials without
 * obligation of support and "AS IS", WITH NO WARRANTY OF ANY KIND, EITHER
 * EXPRESS OR IMPLIED, INCLUDING THE WARRANTY OF TITLE, NON-INFRINGEMENT OR
 * NON-INTERFERENCE AND THE IMPLIED WARRANTIES AND CONDITIONS OF MERCHANTABILITY
 * AND FITNESS FOR A PARTICULAR PURPOSE.
 * 
 * PROHIBITED USES
 * 
 * Licensee may not use or authorize others to use the Program or any part of
 * the Program, alone or in combination with other products, in support of any
 * of the following High Risk Activities: design, construction, control, or
 * maintenance of nuclear facilities, mass transit systems, air traffic control
 * systems, weapons systems, or aircraft navigation or communications, or any
 * other activity where program failure could give rise to a material threat of
 * death or serious personal injury.
 ******************************************************************************

