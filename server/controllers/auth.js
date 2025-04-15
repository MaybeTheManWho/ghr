const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const config = require('../config/discord');

/**
 * Handle Discord OAuth callback
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.discordCallback = async (req, res) => {
  try {
    const { user } = req;
    
    // Check if user is in the configured guild
    const userGuilds = user.guilds || [];
    const isInGuild = userGuilds.some(guild => guild.id === config.guildId);
    
    if (!isInGuild) {
      return res.status(403).json({ 
        success: false, 
        msg: 'You must be a member of the server to access this application' 
      });
    }
    
    // Check if user is already in database
    let dbUser = await User.findOne({ discordId: user.id });
    
    if (!dbUser) {
      // Find the default role
      const defaultRole = await Role.findOne({ isDefault: true });
      
      // Create new user
      dbUser = new User({
        username: user.username,
        discordId: user.id,
        avatar: user.avatar,
        role: defaultRole ? defaultRole._id : null
      });
      
      await dbUser.save();
    } else {
      // Update user information
      dbUser.username = user.username;
      dbUser.avatar = user.avatar;
      dbUser.lastLogin = Date.now();
      
      await dbUser.save();
    }
    
    // Create JWT payload
    const payload = {
      user: {
        id: dbUser._id,
        discordId: dbUser.discordId,
        username: dbUser.username,
        role: dbUser.role
      }
    };
    
    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        
        res.json({
          success: true,
          token,
          user: {
            id: dbUser._id,
            discordId: dbUser.discordId,
            username: dbUser.username,
            avatar: dbUser.avatar
          }
        });
      }
    );
  } catch (err) {
    console.error('Discord callback error:', err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

/**
 * Get current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getMe = async (req, res) => {
  try {
    // Get user with populated role
    const user = await User.findById(req.user.id)
      .populate('role')
      .populate('teams');
    
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        discordId: user.discordId,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
        teams: user.teams,
        isActive: user.isActive,
        stats: user.stats
      }
    });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};