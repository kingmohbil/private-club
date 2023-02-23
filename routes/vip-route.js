const express = require('express');
const router = express.Router();
const controller = require('../controllers/vip-controller');

router.get('/', controller.getVipForm);

router.post('/', controller.registerVip);

module.exports = router;
