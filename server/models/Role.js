const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  color: {
    type: String,
    default: '#4B0082' // Default indigo color
  },
  permissions: {
    tickets: {
      type: Boolean,
      default: false
    },
    stats: {
      type: Boolean,
      default: false
    },
    snippets: {
      type: Boolean,
      default: false
    },
    siteManagement: {
      type: Boolean,
      default: false
    }
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Role', roleSchema);