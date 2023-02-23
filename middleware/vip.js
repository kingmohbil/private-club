exports.isVip = (req, res, next) => {
  if (!req.user.vip) return next();
  return res.redirect('/');
};
