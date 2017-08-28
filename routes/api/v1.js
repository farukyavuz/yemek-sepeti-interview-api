/**
 * Created by faruk on 26/08/2017.
 */

var util = require('util');
var async = require('async');

// Helpers
var enums = require('../../helpers/enums.js');
var methods = require('../../helpers/methods.js');

// Keystone
var keystone = require('keystone');
var User = keystone.list('User');
var authController = require('../../controllers/auth');
var userController = require('../../controllers/user');


exports.login = function (req, res) {

	var email = req.body.email || '';
	var password = req.body.password || '';

	var payload = {};
	var params = {};

	if (email === '') {
		var missingUsername = enums.ResponseStatus.missing_username;
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
		res.end(util.format(methods.BASE_TEMPLATE, 'false', missingUsername.code, missingUsername.message, JSON.stringify({})));
	} else if (password === '') {
		var missingPassword = enums.ResponseStatus.missing_password;
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
		res.end(util.format(methods.BASE_TEMPLATE, 'false', missingPassword.code, missingPassword.message, JSON.stringify({})));
	} else {
		User.model.findOne({'email': email})
			.exec(function (err, user) {
				if (user) {
					if (!err) {
						user._.password.compare(password, function (err, isMatch) {
							if (!err && isMatch) {
								payload.user = user;
								async.waterfall([
									function (callback) { // token
										authController.auth(callback, payload);
									}
								], function (err, payload) {
									if (err) {
										res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
										res.end(util.format(methods.BASE_TEMPLATE, 'false', err, payload, JSON.stringify({})));
									} else {
										console.log(payload.user.password); // TODO Faruk
										

										var ok = enums.ResponseStatus.ok;
										res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
										res.end(util.format(methods.BASE_TEMPLATE, "true", ok.code, ok.message, JSON.stringify(payload)));
									}
								});

							}
							else {
								var wrongUsernamePassword = enums.ResponseStatus.wrong_username_password;
								res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
								res.end(util.format(methods.BASE_TEMPLATE, 'false', wrongUsernamePassword.code, wrongUsernamePassword.message, JSON.stringify({})));
							}
						});
					}
				} else {
					var userNotFound = enums.ResponseStatus.user_not_found;
					res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
					res.end(util.format(methods.BASE_TEMPLATE, 'false', userNotFound.code, userNotFound.message, JSON.stringify({})));
				}
			});
	}
};


exports.getUsers = function (req, res) {
	var payload = {};

	async.waterfall([
		function (callback) {
			userController.all(callback, payload);
		}
	], function (err, payload) {
		if (err) {
			res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
			res.end(util.format(methods.BASE_TEMPLATE, "false", err, payload, JSON.stringify({})));
		} else {
			var ok = enums.ResponseStatus.ok;
			res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
			res.end(util.format(methods.BASE_TEMPLATE, "true", ok.code, ok.message, JSON.stringify(payload)));
		}
	});
};

exports.getUser = function (req, res) {
	var params = {};
	params.id = req.params.id;
	var payload = {};

	async.waterfall([
		function (callback) {
			userController.getUser(callback, payload, params);
		}
	], function (err, payload) {
		if (err) {
			res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
			res.end(util.format(methods.BASE_TEMPLATE, "false", err, payload, JSON.stringify({})));
		} else {
			var ok = enums.ResponseStatus.ok;
			res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
			res.end(util.format(methods.BASE_TEMPLATE, "true", ok.code, ok.message, JSON.stringify(payload)));
		}
	});
};

exports.userUpdate = function (req, res) {

	let userId = req.body.userId || '';
	let address = req.body.address || '';
	let email = req.body.email || '';
	let phone = req.body.phone || '';

	let payload = {};
	let params = {};
	
	params.userId = userId;
	params.address = address;
	params.email = email;
	params.phone = phone;

	async.waterfall([
		function (callback) {
			userController.update(callback, payload, params);
		}
	], function (err, payload) {
		if (err) {
			res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
			res.end(util.format(methods.BASE_TEMPLATE, "false", err, payload, JSON.stringify({})));
		} else {
			var ok = enums.ResponseStatus.ok;
			res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
			res.end(util.format(methods.BASE_TEMPLATE, "true", ok.code, ok.message, JSON.stringify(payload)));
		}
	});
	
	
};
