/**
 * Created by faruk on 26/08/2017.
 */

var enums = require('../helpers/enums.js');
var methods = require('../helpers/methods.js');

// Keystone
var keystone = require('keystone');
var User = keystone.list('User');

exports.all = function (callback, payload) {
	User.model.find()
		.exec(function (err, users) {
			if (err) {
				callback(err.code, err.message);
			} else {
				users.sort(function (a, b) {
					return a.name.first.localeCompare(b.name.first);
				});

				payload.users = users;
				callback(null, payload);
			}
		});
};

exports.getUser = function (callback, payload, params) {

	let id = params.id;
	User.model.findOne({ '_id': id })
		.exec(function (err, user) {
			if (err) {
				callback(err.code, err.message);
			} else {
				payload.user = user;
				callback(null, payload);
			}
		});
};


//Update User
exports.update = function (callback, payload, params) {

	let userId = params.userId;
	let address = params.address;
	let email = params.email;
	let phone = params.phone;

	User.model.findOne({ '_id' : userId }).exec(function(err, user) {
		if (err) {
			callback(500, JSON.stringify(err));
		} else {
			user.address = params.address;
			user.email = params.email;
			user.phone = params.phone;

			user.save(function (err) {
				if (err) {
					callback(500, JSON.stringify(err));
				} else {
					callback(null, {});
				}
			});
		}
	});


};
