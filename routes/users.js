var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', userController.get_fooditem_data);

router.post('/', userController.save_fooditem_data);

// router.post('/nutrients', userController.get_nutritiousfood_data);

router.post('/:deficiency', userController.get_nutritiousfood_data);

router.get('/metrics/:sex/:age', userController.get_RDISet);

module.exports = router;
