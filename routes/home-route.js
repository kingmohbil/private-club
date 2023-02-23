const express = require('express');
const messageRouter = require('./messages-route');
const controller = require('../controllers/home-controller');
const router = express.Router();

router.get('/', controller.getHome);

router.use('/', messageRouter);

// router.post('/messages', controller.addMessage);

router.delete('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
  });
  return res.redirect('/login');
});

module.exports = router;
