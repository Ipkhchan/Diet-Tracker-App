var express = require('express');
var router = express.Router();

var nutritionController = require('../controllers/nutritionController');

console.log(nutritionController.data);

router.get('/nutritionInfo', nutritionController.get_nutrition_data);
// router.get('/nutritionInfo', function(req, res, next) {
//   res.append('Access-Control-Allow-Origin', ['*']);
//   res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.append('Access-Control-Allow-Headers', 'Content-Type');
//   res.send({ express: 'Hello From Express' });
// });

module.exports = router;
