const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Team = require('../models/Team');
const auth = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');

// Get all tickets
router.get('/', auth, async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .sort({ createdAt: -1 })
      .populate('assignedStaff', 'username')
      .populate('assignedTeam', 'name color');
    
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get ticket by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ id: req.params.id })
      .populate('assignedStaff', 'username')
      .populate('assignedTeam', 'name color');
    
    if (!ticket) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }
    
    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add message to ticket
router.post('/:id/messages', 
  [
    auth,
    param('id').notEmpty().withMessage('Ticket ID is required'),
    body('content').notEmpty().withMessage('Message content is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const ticket = await Ticket.findOne({ id: req.params.id });
      
      if (!ticket) {
        return res.status(404).json({ msg: 'Ticket not found' });
      }
      
      if (ticket.status === 'closed') {
        return res.status(400).json({ msg: 'Cannot add message to closed ticket' });
      }
      
      // Get current user
      const user = await User.findById(req.user.id);
      
      // Determine message type
      const messageType = 'staff';
      
      // Add message to ticket
      ticket.messages.push({
        id: `web-${Date.now()}`,
        content: req.body.content,
        userId: user.discordId,
        username: user.username,
        timestamp: new Date(),
        type: messageType
      });
      
      // Update lastMessage for preview
      ticket.lastMessage = req.body.content;
      
      // If first staff message, record response time
      if (!ticket.firstResponseTime && ticket.userId !== user.discordId) {
        const now = new Date();
        const responseTime = now - ticket.createdAt;
        ticket.firstResponseTime = responseTime;
      }
      
      // Assign ticket to staff member if not already assigned
      if (!ticket.assignedStaff) {
        ticket.assignedStaff = user._id;
        ticket.assignedStaffUsername = user.username;
      }
      
      await ticket.save();
      
      res.json(ticket);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Assign staff to ticket
router.put('/:id/assign',
  [
    auth,
    param('id').notEmpty().withMessage('Ticket ID is required'),
    body('staffId').notEmpty().withMessage('Staff ID is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const ticket = await Ticket.findOne({ id: req.params.id });
      
      if (!ticket) {
        return res.status(404).json({ msg: 'Ticket not found' });
      }
      
      if (ticket.status === 'closed') {
        return res.status(400).json({ msg: 'Cannot assign closed ticket' });
      }
      
      // Find staff member
      const staffMember = await User.findById(req.body.staffId);
      
      if (!staffMember) {
        return res.status(404).json({ msg: 'Staff member not found' });
      }
      
      // Assign ticket
      ticket.assignedStaff = staffMember._id;
      ticket.assignedStaffUsername = staffMember.username;
      
      // Add system message about assignment
      ticket.messages.push({
        id: `assign-${Date.now()}`,
        content: `Ticket assigned to ${staffMember.username} by ${req.user.username}`,
        userId: 'system',
        username: 'System',
        timestamp: new Date(),
        type: 'system'
      });
      
      await ticket.save();
      
      res.json(ticket);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Assign team to ticket
router.put('/:id/team',
  [
    auth,
    param('id').notEmpty().withMessage('Ticket ID is required'),
    body('teamId').notEmpty().withMessage('Team ID is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const ticket = await Ticket.findOne({ id: req.params.id });
      
      if (!ticket) {
        return res.status(404).json({ msg: 'Ticket not found' });
      }
      
      if (ticket.status === 'closed') {
        return res.status(400).json({ msg: 'Cannot assign closed ticket' });
      }
      
      // Find team
      const team = await Team.findById(req.body.teamId);
      
      if (!team) {
        return res.status(404).json({ msg: 'Team not found' });
      }
      
      // Assign ticket
      ticket.assignedTeam = team._id;
      ticket.assignedTeamName = team.name;
      
      // Add system message about team assignment
      ticket.messages.push({
        id: `team-${Date.now()}`,
        content: `Ticket assigned to team ${team.name} by ${req.user.username}`,
        userId: 'system',
        username: 'System',
        timestamp: new Date(),
        type: 'system'
      });
      
      await ticket.save();
      
      res.json(ticket);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Add tag to ticket
router.put('/:id/tags',
  [
    auth,
    param('id').notEmpty().withMessage('Ticket ID is required'),
    body('tagId').notEmpty().withMessage('Tag ID is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const ticket = await Ticket.findOne({ id: req.params.id });
      
      if (!ticket) {
        return res.status(404).json({ msg: 'Ticket not found' });
      }
      
      // Check if tag already exists in ticket
      if (ticket.tags.some(tag => tag.id.toString() === req.body.tagId)) {
        return res.status(400).json({ msg: 'Tag already added to ticket' });
      }
      
      // Find tag (would normally be in Tag model, but we're simplifying here)
      // For now, use mock tags
      const mockTags = [
        { id: '1', name: 'Bug', color: '#F44336' },
        { id: '2', name: 'Feature Request', color: '#4CAF50' },
        { id: '3', name: 'Question', color: '#2196F3' },
      ];
      
      const tag = mockTags.find(t => t.id === req.body.tagId);
      
      if (!tag) {
        return res.status(404).json({ msg: 'Tag not found' });
      }
      
      // Add tag to ticket
      ticket.tags.push({
        id: tag.id,
        name: tag.name,
        color: tag.color
      });
      
      await ticket.save();
      
      res.json(ticket);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Set ticket priority
router.put('/:id/priority',
  [
    auth,
    param('id').notEmpty().withMessage('Ticket ID is required'),
    body('priority').isIn(['low', 'medium', 'urgent']).withMessage('Invalid priority level')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const ticket = await Ticket.findOne({ id: req.params.id });
      
      if (!ticket) {
        return res.status(404).json({ msg: 'Ticket not found' });
      }
      
      if (ticket.status === 'closed') {
        return res.status(400).json({ msg: 'Cannot update closed ticket' });
      }
      
      // Update priority
      ticket.priority = req.body.priority;
      
      // Add system message about priority change
      ticket.messages.push({
        id: `priority-${Date.now()}`,
        content: `Ticket priority set to ${req.body.priority} by ${req.user.username}`,
        userId: 'system',
        username: 'System',
        timestamp: new Date(),
        type: 'system'
      });
      
      await ticket.save();
      
      res.json(ticket);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Close ticket
router.put('/:id/close', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ id: req.params.id });
    
    if (!ticket) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }
    
    if (ticket.status === 'closed') {
      return res.status(400).json({ msg: 'Ticket already closed' });
    }
    
    // Get current user
    const user = await User.findById(req.user.id);
    
    // Close ticket
    ticket.status = 'closed';
    ticket.closedAt = new Date();
    ticket.closedBy = user.discordId;
    ticket.closedByUsername = user.username;
    
    // Add system message about closure
    ticket.messages.push({
      id: `close-${Date.now()}`,
      content: `Ticket closed by ${user.username}`,
      userId: 'system',
      username: 'System',
      timestamp: new Date(),
      type: 'system'
    });
    
    // If ticket was assigned to a staff member, update their stats
    if (ticket.assignedStaff) {
      const staffMember = await User.findById(ticket.assignedStaff);
      
      if (staffMember) {
        // Increment monthly closes
        staffMember.stats.monthlyCloses += 1;
        staffMember.stats.lifetimeCloses += 1;
        
        await staffMember.save();
      }
    }
    
    await ticket.save();
    
    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});