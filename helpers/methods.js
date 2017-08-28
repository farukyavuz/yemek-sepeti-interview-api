/**
 * Created by faruk on 26/08/2017.
 */
var crypto = require('crypto');

// Check Values
exports.nullCheck = function (type, value) {
	if(value)
		return value;
	else
		return emptyRepresentation(type);
};

function emptyRepresentation(type){
	switch(type){
		case Boolean:
			return false;
		case Number:
			return 0;
		case String:
			return "";
		default:
			return null;
	}
}

// Date to String [2015-07-14]
exports.convertDateToParameter = function(date){
	var m = addZero(date.getMonth()+1);  // 10
	var d = addZero(date.getDate());     // 30
	var y = date.getFullYear(); // 2010
	return y + '-' + m + '-' + d;
};

// String to Timestamp
// reservations[2015/08/05 10:00:00 +0000]
// events [2015-07-08T19:00:00.000+03:00]
// resource_availability res [2015/08/05 10:00:00 +0000]
exports.convertCobotDateToTimestamp = function(date){
	return Math.round(new Date(date).getTime()/1000);
};

// resource_availability req [2015-08-05 12:00]
exports.convertTimestampToRAParameter = function(timestamp){
	var d = new Date(timestamp*1000);

	var day = addZero(d.getDate());
	var month = addZero(d.getMonth()+1);
	var year = d.getFullYear();

	var hours = addZero(d.getHours());
	var minutes = addZero(d.getMinutes());

	return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
};

function addZero(n){return n<10? '0'+n:''+n;}

exports.random = function(howMany) {
	var chars = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
	var rnd = crypto.randomBytes(howMany)
		, value = new Array(howMany)
		, len = chars.length;

	for (var i = 0; i < howMany; i++) {
		value[i] = chars[rnd[i] % len]
	}

	return value.join('');
};

exports.getRandomArbitrary = function(min, max) {
	return Math.random() * (max - min) + min;
};

exports.getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Return a unique identifier with the given `len`.
 *
 *     utils.uid(10);
 *     // => "FDaS435D2z"
 *
 * @param {Number} len
 * @return {String}
 * @api private
 */
exports.uid = function(len) {
	var buf = []
		, chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz123456789'
		, charlen = chars.length;

	for (var i = 0; i < len; ++i) {
		buf.push(chars[getRandomInt(0, charlen - 1)]);
	}

	return buf.join('');
};

/**
 * Return a random int, used by `utils.uid()`
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */
function getRandomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.getRandomInt = function(min, max) {
	getRandomInt(min, max);
};


var BASE_TEMPLATE = '{"success":%s, "status": {"code": %d, "message": "%s"}, "payload": %s}';

exports.BASE_TEMPLATE = BASE_TEMPLATE;
