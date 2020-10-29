
const userModel = require('../Models/userModel');
var _ = require('underscore');
var bcrypt = require('bcryptjs');
var async = require('async');
var config = require('config');
const secretkey = config.get('secretkey');
var jwt = require('jsonwebtoken');
const saltRounds = 10;



module.exports = {
	registerUser: (req, res, next) => {
		var params_list = ['name', 'gender', 'mobile', 'email', 'designation', 'password'
		];
		validateParams(params_list, req.body, function (err, params) {
			if (err) {
				return next(err);
			} else {
				bcrypt.hash(params[5], saltRounds, function (err, hash) {
					params[5] = hash
					userModel.createUser([params], function (err, response) {
						if (err) {
							var finalRepsonse = {
								success: "0",
								message: " Error while inserting data",

							}
							return res.json(finalRepsonse);
						}
						else {
							return res.json({ success: 1, message: "User created succesfully" });

						}
					});
				});

			}
		});
	},
	login: (req, res, next) => {
		var params_list = ['email', 'password'];
		validateParams(params_list, req.body, function (err, params) {
			if (err) {
				return next(err);
			} else {
				userModel.login([params], function (err, response) {
					if (err) {
						var finalRepsonse = {
							success: "0",
							message: " Error while inserting data",

						}
						return res.json(finalRepsonse);
					}
					bcrypt.compare(params[1], response[0].password).then(function (result) {
						if (result) {
							var user = {
								name: response[0].name,
								email_id: response[0].email_id,
								designation: response[0].designation
							}
							var token = jwt.sign(user, secretkey);
							user.token = token
							return res.json(user);
						}
						else {
							return res.json({
								success: 0,
								message: "Invalid user name and password"
							});

						}
					})
				});
			}
		});
	},
	dashboard: (req, res, next) => {
		if (req.user) {
			userModel.getUserDetails([req.user.email_id], function (err, results) {
				if (err) {
					var finalRepsonse = {
						success: "0",
						message: " Error while fetching the data",

					}
					return res.json(finalRepsonse);
				}
				console.log(results)
				delete results[0].password
				return res.json({ success: 1, data: results })
			});
		}
		else {
			return res.json({ success: 0, message: 'not authorized' })
		}

	},
	updateUser: (req, res, next) => {
		if (req.user.designation == 'admin') {
			var params = [req.body.name, req.body.mobile, req.body.email]
			userModel.upadateUser(params, function (err, results) {
				if (err) {
					var finalRepsonse = {
						success: "0",
						message: " Error while fetching the data",

					}
					return res.json(finalRepsonse);
				}
				delete results[0].password
				return res.json({ success: 1, data: results })
			});
		}
		else {
			return res.json({ success: 0, message: 'not authorized' })
		}

	},
	getUserByrole: (req, res, next) => {
		if (req.user.designation == 'staff') {
			return res.json({ success: 0, message: 'you are not authorized to access this resource' })
		}
		else {
			var params = []
			if (req.user.designation == 'manager') {
				params.push('staff');
			}
			else if (req.user.designation == 'admin') {
				params.push('manager');
				params.push('staff');

			}
			userModel.getUserByRole(params, function (err, results) {
				if (err) {
					var finalRepsonse = {
						success: "0",
						message: " Error while fetching the data",

					}
					return res.json(finalRepsonse);
				}
				const result = results.filter(ele => delete ele.password);
				return res.json({ success: 1, data: result })
			});
		}

	},
};

// DOC:  general functions 

function validateParams(params_list, data_object, cb) {
	var response_object = {
		err: false,
		params: [],
		message: "",
		success: 1,
		status: 200
	}

	async.eachSeries(params_list, function (key, callback) {
		var value = data_object[key];
		if (_.isUndefined(value) || _.isNull(value)) {
			response_object.err = true;
			response_object.message = "Invalid parameters! " + key + " is missing or invalid";
			response_object.success = 0;
			response_object.status = 422;
			delete response_object.params;
			callback(response_object);
		} else {
			response_object.params.push(value);
			callback();
		}
	}, function done(err) {
		if (err) {
			cb(err, null);
		} else {
			cb(null, response_object.params);
		}
	});
}

