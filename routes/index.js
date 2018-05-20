var express = require('express');
var router = express.Router();

var indexController = require('../controllers/indexController');

/* GET users listing. */
router.post('/:deficiency', indexController.get_nutritiousfood_data);

router.get('/metrics/:sex/:age', indexController.get_RDISet);

module.exports = router;
