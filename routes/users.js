var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', userController.get_fooditem_data);

router.post('/', userController.add_fooditem_data);

module.exports = router;
