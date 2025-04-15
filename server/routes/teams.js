const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');

// @route   GET /api/teams
// @desc    Get all teams
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('members', 'username avatar discordId')
      .sort({ name: 1 });
    
    res.json(teams);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/teams
// @desc    Create a team
// @access  Private
router.post('/',
  [
    auth,
    body('name').notEmpty().withMessage('Team name is required'),
    body('color').optional().isHexColor().withMessage('Color must be a valid hex color')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if team with the same name already exists
      const existingTeam = await Team.findOne({ name: req.body.name });
      
      if (existingTeam) {
        return res.status(400).json({ msg: 'Team with this name already exists' });
      }
      
      // Create new team
      const newTeam = new Team({
        name: req.body.name,
        color: req.body.color,
        createdBy: req.user.id
      });
      
      const team = await newTeam.save();
      
      res.json(team);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT /api/teams/:id
// @desc    Update a team
// @access  Private
router.put('/:id',
  [
    auth,
    param('id').isMongoId().withMessage('Invalid team ID'),
    body('name').notEmpty().withMessage('Team name is required'),
    body('color').optional().isHexColor().withMessage('Color must be a valid hex color')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if team exists
      let team = await Team.findById(req.params.id);
      
      if (!team) {
        return res.status(404).json({ msg: 'Team not found' });
      }
      
      // Check if another team with the same name exists
      const existingTeam = await Team.findOne({ 
        name: req.body.name,
        _id: { $ne: req.params.id }
      });
      
      if (existingTeam) {
        return res.status(400).json({ msg: 'Team with this name already exists' });
      }
      
      // Update team
      team.name = req.body.name;
      
      if (req.body.color) {
        team.color = req.body.color;
      }
      
      await team.save();
      
      res.json(team);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE /api/teams/:id
// @desc    Delete a team
// @access  Private
router.delete('/:id',
  [
    auth,
    param('id').isMongoId().withMessage('Invalid team ID')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if team exists
      const team = await Team.findById(req.params.id);
      
      if (!team) {
        return res.status(404).json({ msg: 'Team not found' });
      }
      
      // Remove team from all users
      await User.updateMany(
        { teams: team._id },
        { $pull: { teams: team._id } }
      );
      
      // Delete team
      await team.remove();
      
      res.json({ msg: 'Team deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST /api/teams/:id/members
// @desc    Add member to team
// @access  Private
router.post('/:id/members',
  [
    auth,
    param('id').isMongoId().withMessage('Invalid team ID'),
    body('userId').isMongoId().withMessage('Invalid user ID')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if team exists
      const team = await Team.findById(req.params.id);
      
      if (!team) {
        return res.status(404).json({ msg: 'Team not found' });
      }
      
      // Check if user exists
      const user = await User.findById(req.body.userId);
      
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      
      // Check if user is already in team
      if (team.members.includes(req.body.userId)) {
        return res.status(400).json({ msg: 'User is already in this team' });
      }
      
      // Add user to team
      team.members.push(req.body.userId);
      await team.save();
      
      // Add team to user
      if (!user.teams.includes(team._id)) {
        user.teams.push(team._id);
        await user.save();
      }
      
      // Populate members and return team
      const updatedTeam = await Team.findById(req.params.id)
        .populate('members', 'username avatar discordId');
      
      res.json(updatedTeam);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE /api/teams/:id/members/:userId
// @desc    Remove member from team
// @access  Private
router.delete('/:id/members/:userId',
  [
    auth,
    param('id').isMongoId().withMessage('Invalid team ID'),
    param('userId').isMongoId().withMessage('Invalid user ID')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if team exists
      const team = await Team.findById(req.params.id);
      
      if (!team) {
        return res.status(404).json({ msg: 'Team not found' });
      }
      
      // Check if user exists
      const user = await User.findById(req.params.userId);
      
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      
      // Check if user is in team
      if (!team.members.includes(req.params.userId)) {
        return res.status(400).json({ msg: 'User is not in this team' });
      }
      
      // Remove user from team
      team.members = team.members.filter(
        memberId => memberId.toString() !== req.params.userId
      );
      await team.save();
      
      // Remove team from user
      user.teams = user.teams.filter(
        teamId => teamId.toString() !== req.params.id
      );
      await user.save();
      
      // Populate members and return team
      const updatedTeam = await Team.findById(req.params.id)
        .populate('members', 'username avatar discordId');
      
      res.json(updatedTeam);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;