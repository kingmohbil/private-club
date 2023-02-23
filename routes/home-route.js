const express = require('express');
const messageRouter = require('./messages-route');
const controller = require('../controllers/home-controller');
const router = express.Router();

router.get('/', controller.getHome);

router.use('/', messageRouter);

router.delete('/logout', controller.logOut);

module.exports = router;
