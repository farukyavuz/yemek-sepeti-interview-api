/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
		{ label: 'Contact', key: 'contact', href: '/contact' },
	];
	res.locals.user = req.user;
	next();
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};


var jwt = require('jwt-simple');
var util = require('util');

var auth = require('../controllers/auth');
var enums = require('../helpers/enums.js');
var methods = require('../helpers/methods.js');

// Keystone
var keystone = require('keystone');
var User = keystone.list('User');

exports.validateRequest = function (req, res, next) {

	// When performing a cross domain request, you will receive
	// a prefigured request first. This is to check if our the app
	// is safe.

	// We skip the token auth for [OPTIONS] requests.
	// if(req.method == 'OPTIONS') next();

	// noinspection JSUnresolvedVariable
	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
	// noinspection JSUnresolvedVariable
	var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];

	if (token || key) {
		try {
			var decoded = jwt.decode(token, require('../config/secret.js')());
			if (decoded.exp <= Date.now()) {
				res.writeHead(enums.ResponseStatus.token_expired.code, {'Content-Type': 'application/json'});
				res.end(
					util.format(
						methods.BASE_TEMPLATE,
						"false",
						enums.ResponseStatus.token_expired.code,
						enums.ResponseStatus.token_expired.message,
						JSON.stringify({})
					)
				);
				return;
			}

			// Authorize the user to see if s/he can access our resources
			// var dbUser = validateUser(key); // The key would be the logged in user's username
			// noinspection JSUnresolvedFunction
			User.model.find({ email: key}, function (err, user) {
				if (err) {
					//noinspection JSUnresolvedFunction
					res.writeHead(enums.ResponseStatus.user_not_found.code, {'Content-Type': 'application/json'});
					res.end(
						util.format(
							methods.BASE_TEMPLATE,
							"false",
							enums.ResponseStatus.user_not_found.code,
							enums.ResponseStatus.user_not_found.message,
							JSON.stringify({})
						)
					);
				} else {
					if (!user) { // If authentication fails, we send a 401 back
						res.writeHead(enums.ResponseStatus.user_not_found.code, {'Content-Type': 'application/json'});
						res.end(
							util.format(
								methods.BASE_TEMPLATE,
								"false",
								enums.ResponseStatus.user_not_found.code,
								enums.ResponseStatus.user_not_found.message,
								JSON.stringify({})
							)
						);
					} else {
						if (user.length === 1) {
							var dbUser = user[0];
							// Check url and access token
							console.log("req.url : ", req.url);
							if (((req.url.indexOf('/api/v1/s') >= 0) || (req.url.indexOf('/api/v2/s') >= 0)) && dbUser.accessToken === token) {
								req.user = dbUser;
								next(); // To move to next middleware
							} else {
								//noinspection JSUnresolvedFunction
								res.writeHead(enums.ResponseStatus.not_authorized.code, {'Content-Type': 'application/json'});
								res.end(
									util.format(
										methods.BASE_TEMPLATE,
										"false",
										enums.ResponseStatus.not_authorized.code,
										enums.ResponseStatus.not_authorized.message,
										JSON.stringify({error: "not_authorized"})
									)
								);
							}
						} else { // No user with this name exists, respond back with a 401
							res.writeHead(enums.ResponseStatus.invalid_user.code, {'Content-Type': 'application/json'});
							res.end(
								util.format(
									methods.BASE_TEMPLATE,
									"false",
									enums.ResponseStatus.invalid_user.code,
									enums.ResponseStatus.invalid_user.message,
									JSON.stringify({error: "no_such_user_exits"})
								)
							);
						}
					}
				}
			});
		} catch (err) {
			res.writeHead(enums.ResponseStatus.error_validate_req.code, {'Content-Type': 'application/json'});
			res.end(
				util.format(
					methods.BASE_TEMPLATE,
					"false",
					enums.ResponseStatus.error_validate_req.code,
					enums.ResponseStatus.error_validate_req.message,
					JSON.stringify({error: "exception", err: err})
				)
			);
		}
	} else {
		res.writeHead(enums.ResponseStatus.invalid_token_or_key.code, {'Content-Type': 'application/json'});
		res.end(
			util.format(
				methods.BASE_TEMPLATE,
				"false",
				enums.ResponseStatus.invalid_token_or_key.code,
				enums.ResponseStatus.invalid_token_or_key.message,
				JSON.stringify({error: "invalid_token_or_key"})
			)
		);
	}
};
