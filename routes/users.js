var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', userController.get_fooditem_data);

router.post('/save', userController.save_fooditem_data);

router.get('/:dietName/delete', userController.delete_fooditem_data);

router.get('/diets/:dietName', userController.get_fooditem_data);

router.get('/metrics', userController.get_RDISet);

module.exports = router;
