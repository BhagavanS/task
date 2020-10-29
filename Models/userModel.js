var spexecutor = require('./spexecutor');
var iso = require('iso-3166-2');
var sortJson = require('sort-json');
var domain = require('domain');

var userModel = {
    createUser: function (sp_params, callback) {
        var query ='INSERT INTO `users`(`name`,`gender`,`mobile`,`email_id`,`designation`,`password`)VALUES ?';
       console.log(query)
        // var query = "INSERT  INTO `users` (`name`,`gender`,`mobile`,`email_id`,`designation`,`password`) VALUES ?";
		spexecutor.queryExecute(query, sp_params, callback);
    },
    login: function (sp_params, callback) {
        console.log(sp_params[0][0])
        var query =`SELECT * FROM users WHERE email_id=?`;
       console.log(query)
		spexecutor.queryExecute(query, sp_params[0][0], callback);
    },
    getUserDetails: function (sp_params, callback) {
        console.log(sp_params[0])
        var query =`SELECT * FROM users WHERE email_id=?`;
       console.log(query)
		spexecutor.queryExecute(query, sp_params[0], callback);
    },
    getUserByRole: function (sp_params, callback) {
        console.log(sp_params)
        var query ="select * from users where designation IN (?)";
		spexecutor.queryExecute(query, sp_params, callback);
    },
    upadateUser: function (sp_params, callback) {
        console.log(sp_params)
        var query ="UPDATE users SET name=?, mobile=? WHERE email_id=?";
		spexecutor.queryExecute(query, sp_params, callback);
	},
}

module.exports = userModel;