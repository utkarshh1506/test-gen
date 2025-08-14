const express = require('express');
const passport = require('passport');
const router = express.Router();
const {
  loginWithGitHub,
  handleGitHubCallback,
} = require('../controllers/authController');

router.get('/github', loginWithGitHub, passport.authenticate('github', { scope: ['repo', 'user'] }));


router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  handleGitHubCallback
);

module.exports = router;
