var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	phone: { type: String},
	birthday: { type: Types.Date},
	address: { type: Types.Textarea},
	image: { type: Types.CloudinaryImage },
	email: { type: Types.Email, initial: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	accessToken: {type: String, noedit: true},
	accessTokenExpiration: {type: Number, noedit: true}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
