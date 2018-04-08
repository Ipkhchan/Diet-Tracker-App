const express = require("express");
const router = express.Router();

const metricsController = require('../controllers/metricsController');

router.get('/', metricsController.get_RDISet);
router.post('/', metricsController.save_RDISet);


module.exports = router;
