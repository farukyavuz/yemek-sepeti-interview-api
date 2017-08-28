/**
 * Created by faruk on 26/08/2017.
 */
// HTTP status codes
var ResponseStatus = {
	ok: {code: 200, message: 'success'},
	bad_request: {code: 400, message: 'bad_request'},
	token_expired: {code: 400, message: 'token_expired'},
	missing_username: {code: 400, message: 'missing_username'},
	missing_password: {code: 400, message: 'missing_password'},
	missing_parameter: {code: 400, message: 'missing_parameter'},
	wrong_code: {code: 400, message: 'wrong_code'},
	wrong_password: {code: 400, message: 'wrong_password'},
	user_not_found: {code: 401, message: 'user_not_found'},
	invalid_user: {code: 401, message: 'invalid_user'},
	invalid_token_or_key: {code: 401, message: 'invalid_token_or_key'},
	not_authorized: {code: 403, message: 'not_authorized'},
	not_found: {code: 404, message: 'not_found'},
	internal_error: {code: 500, message: 'internal_error'},
	error_validate_req: {code: 500, message: 'error_validate_req'},
	not_implemented: {code: 501, message: 'not_implemented'},
	wrong_username_password: {code: 501, message: 'wrong_username_password'},
	event_not_found: {code: 400, message: 'event_not_found'},
	event_already_joined: {code:400, message: 'event_already_joined'},
	event_already_not_joined: {code:400, message: 'event_already_not_joined'}
};

exports.ResponseStatus = ResponseStatus;
