const loginAuth = (req, res, next) => {
  if (!req.session.userId) {
    const error = "Please login / register.";
    return res.redirect(`/login?error=${error}`);
  }
  next();
};


module.exports = loginAuth;
