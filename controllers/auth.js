/**
 * Created by faruk on 26/08/2017.
 */
var jwt = require('jwt-simple');

// Constants
var EXPIRATION_PERIOD = 7; // 7 days

exports.auth = function (callback, payload) {
	// var token = generateToken(payload.user);
	// payload.user.accessToken = token.token;
	// payload.user.accessTokenExpiration = token.expires;
	// callback(null, payload);

	generateToken(callback, payload);
};


// function generateToken(user) {
// 	console.log("generateToken called");
// 	var expires = expiresIn(EXPIRATION_PERIOD);
// 	var token = jwt.encode({
// 		exp: expires
// 	}, require('../config/secret')());
//
// 	user.accessToken = token;
// 	user.accessTokenExpiration = expires;
// 	user.save(function (err) {
// 		if (err) throw err;
// 	});
//
// 	return {
// 		token: token,
// 		expires: expires
// 	};
// }

function generateToken(callback, payload) {
	console.log("generateToken called");
	var expires = expiresIn(EXPIRATION_PERIOD);
	var token = jwt.encode({
		exp: expires
	}, require('../config/secret')());

	payload.user.accessToken = token;
	payload.user.accessTokenExpiration = expires;
	payload.user.save(function (err) {
		if (err) {
			callback(500, "user_create_error");
		} else {
			callback(null, payload);
		}
	});
}

function expiresIn(numDays) {
	var dateObj = new Date();
	return dateObj.setDate(dateObj.getDate() + numDays);
}
