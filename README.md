# Code-Rally (Node.js Version)

Want to learn the popular Node.js while having fun? Then try the new Node.js version of IBM's Code Rally! Whether you are a complete Node Newbie, or a experienced Node.js veteran, test and hone your skills on the race track!

For more information, see the <a target="_blank" href="https://www.ibm.com/developerworks/community/blogs/code-rally/entry/landing?lang=en">Offical Code Rally Blog</a>!

## Installation

There are two ways to get Code Rally (Node.js) running on your machine! Assuming that you have already <a target="_blank" href="https://nodejs.org/en/">Node.js</a> with NPM installed.

1. Use `npm install --save coderally` at your Node application directory

2. Clone this GitHub repository directly to your Node application directory with `git clone`

## Usage

The Code Rally node module will allow you to access all the features and functions you need to get started! To include the module in your application, simply add `var code_rally = require('code_rally')`. Or you can use the Code Rally CLI tool <i>(future release)</i> to generate a template for you to get started! The module is composed of mainly three parts:

* `var Agent = code_rally.agent` - The Agent class is what you will be using to connect to a host server, and send/receive data to the server. As the agent, as an Event Emitter, will allow you to receive race events and formulate an appropriate response to it.

* `var Car = code_rally.car` - The Car class is the object abstraction of your car within the race. Upon agent connection to the host server, your Car object will be spawned by the agent on the 'init' event, within the callback functoin. You will set the car's attributes, name, design, and controls, through this object (and its supporting classes).

* `var Utils = code_rally.utils` - The Utility library provides you with useful functions for spatial/time calculations between race elements, helper functions for class creation, and much more.

The models library can also be accessed through `code_rally.models`, if you wish to directly access all the different model classes for your own purposes. 

## Contributing

Currently contributed by IBM Canada's Node Enterprise Team, with technical feedback and support by the Code Rally Team.

## History

* [Jan 2016]
  - Project Kickoff!
  - GitHub Repository Created

* [Feb 2016]
  - Designed Code Rally Node Module structure
  - README.md v1.0.0

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
</pre>
