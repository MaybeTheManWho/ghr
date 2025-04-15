const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Role = require('../models/Role');
const auth = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find()
      .populate('role', 'name color')
      .populate('teams', 'name color')
      .sort({ username: 1 });
    
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/users/:id/role
// @desc    Assign role to user
// @access  Private
router.put('/:id/role',
  [
    auth,
    param('id').isMongoId().withMessage('Invalid user ID'),
    body('roleId').optional().isMongoId().withMessage('Invalid role ID')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if user exists
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      
      // Check if role exists if provided
      if (req.body.roleId) {
        const role = await Role.findById(req.body.roleId);
        
        if (!role) {
          return res.status(404).json({ msg: 'Role not found' });
        }
        
        user.role = role._id;
      } else {
        // Remove role if no roleId provided
        user.role = null;
      }
      
      await user.save();
      
      // Return user with populated role
      const updatedUser = await User.findById(req.params.id)
        .populate('role', 'name color')
        .populate('teams', 'name color');
      
      res.json(updatedUser);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT /api/users/:id/active
// @desc    Toggle user active status
// @access  Private
router.put('/:id/active',
  [
    auth,
    param('id').isMongoId().withMessage('Invalid user ID')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if user exists
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      
      // Toggle active status
      user.isActive = !user.isActive;
      await user.save();
      
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE /api/users/:id
// @desc    Delete a user
// @access  Private
router.delete('/:id',
  [
    auth,
    param('id').isMongoId().withMessage('Invalid user ID')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if user exists
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      
      // Remove user from teams
      await Promise.all(user.teams.map(async (teamId) => {
        const team = await Team.findById(teamId);
        if (team) {
          team.members = team.members.filter(
            memberId => memberId.toString() !== user._id.toString()
          );
          await team.save();
        }
      }));
      
      // Delete user
      await user.remove();
      
      res.json({ msg: 'User deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET /api/users/stats
// @desc    Get staff statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: null } })
      .populate('role', 'name color')
      .select('username discordId role stats');
    
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;