const express = require('express');
const messageRouter = require('./messages-route');
const vipRouter = require('./vip-route');
const controller = require('../controllers/home-controller');
const router = express.Router();

router.get('/', controller.getHome);

router.use('/', messageRouter);

router.use('/vip', vipRouter);

router.delete('/logout', controller.logOut);

module.exports = router;
