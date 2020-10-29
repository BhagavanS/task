var express = require('express');
var router = express.Router();
const controller = require('../controller/index');
const auth = require("../middlewares/jwt");


var cors = require('cors');

/* GET states. */


router.post('/user/register', controller.registerUser);

router.post('/user/login', controller.login);

router.get('/user/dashboard',auth, controller.dashboard);

router.post('/user/update-by-admin',auth, controller.updateUser);


router.get('/get-users',auth, controller.getUserByrole);





module.exports = router;
