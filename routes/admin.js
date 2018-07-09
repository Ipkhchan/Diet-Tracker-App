const express = require("express");
const router = express.Router();

const adminController = require('../controllers/adminController');

router.post('/metrics', adminController.save_RDISet);
router.post('/foodData', adminController.save_foodData);
router.post('/signup', adminController.signup_User);
router.post('/login', adminController.login_User);

module.exports = router;
