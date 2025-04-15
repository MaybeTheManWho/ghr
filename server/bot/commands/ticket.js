const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['user', 'staff', 'system'],
    default: 'user'
  }
});

const ticketSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    default: 'Support Ticket'
  },
  channelId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'urgent'],
    default: 'low'
  },
  assignedStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignedStaffUsername: {
    type: String,
    default: null
  },
  assignedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  },
  assignedTeamName: {
    type: String,
    default: null
  },
  tags: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag'
    },
    name: String,
    color: String
  }],
  messages: [messageSchema],
  lastMessage: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  closedAt: {
    type: Date,
    default: null
  },
  closedBy: {
    type: String,
    default: null
  },
  closedByUsername: {
    type: String,
    default: null
  },
  closeReason: {
    type: String,
    default: null
  },
  firstResponseTime: {
    type: Number,
    default: null
  },
  totalResponseTime: {
    type: Number,
    default: 0
  },
  responseCount: {
    type: Number,
    default: 0
  },
  opener: {
    username: String,
    id: String
  }
});

// Create indexes for faster queries
ticketSchema.index({ status: 1 });
ticketSchema.index({ userId: 1 });
ticketSchema.index({ assignedStaff: 1 });
ticketSchema.index({ assignedTeam: 1 });

module.exports = mongoose.model('Ticket', ticketSchema);