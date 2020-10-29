const jwt = require("express-jwt");
var config = require('config');
const secretkey = config.get('secretkey');

const authenticate = jwt({
	secret: secretkey,
	algorithms: ['sha1', 'RS256', 'HS256'],
});

module.exports = authenticate;