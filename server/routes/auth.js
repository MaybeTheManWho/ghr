const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth');
const auth = require('../middleware/auth');

// @route   GET /api/auth/discord
// @desc    Auth with Discord
// @access  Public
router.get('/discord', passport.authenticate('discord'));

// @route   GET /api/auth/discord/callback
// @desc    Discord auth callback
// @access  Public
router.get(
  '/discord/callback',
  passport.authenticate('discord', { session: false }),
  authController.discordCallback
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, authController.getMe);

module.exports = router;