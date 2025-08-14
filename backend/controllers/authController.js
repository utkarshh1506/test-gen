const loginWithGitHub = (req, res, next) => {
  next();
};

const handleGitHubCallback = (req, res) => {
  const token = req.user.token;
  const username = req.user.username;
  // Redirect to frontend with token and name
  res.redirect(`${process.env.FRONTEND_URL}/callback?token=${token}&name=${username}`);
};

module.exports = {
  loginWithGitHub,
  handleGitHubCallback,
};
