// Extract a command from a Code Rally websocket message
exports.extractCommand = function (message) {
	return message.substr(0, message.indexOf(' '));
}

exports.extractEvent = function(message) {
	var match = message.match(/event:\((.*?)\)/)[1];
	return match;
}

exports.extractJSON = function(message) {
	var match = message.match(/json:\((.*?)\)/)[1];
	return match;
}

exports.extractResult= function(message) {
	var match = message.match(/result:\((.*?)\)/)[1];
	return match;
}