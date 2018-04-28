const express = require("express");
const router = express.Router();

const adminController = require('../controllers/adminController');

router.get('/metrics/:sex/:age', adminController.get_RDISet);
router.post('/metrics', adminController.save_RDISet);
router.post('/foodData', adminController.save_foodData);


module.exports = router;
