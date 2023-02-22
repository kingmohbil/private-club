const express = require('express');
const router = express.Router();
const controller = require('../controllers/signup-controller');

router.get('/', controller.getSignup);

router.post('/', controller.createUser);

module.exports = router;
