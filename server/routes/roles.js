const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');

// @route   GET /api/roles
// @desc    Get all roles
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const roles = await Role.find().sort({ name: 1 });
    res.json(roles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/roles
// @desc    Create a role
// @access  Private
router.post('/',
  [
    auth,
    body('name').notEmpty().withMessage('Role name is required'),
    body('color').optional().isHexColor().withMessage('Color must be a valid hex color'),
    body('permissions').isObject().withMessage('Permissions must be an object')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if role with the same name already exists
      const existingRole = await Role.findOne({ name: req.body.name });
      
      if (existingRole) {
        return res.status(400).json({ msg: 'Role with this name already exists' });
      }
      
      // Create new role
      const newRole = new Role({
        name: req.body.name,
        color: req.body.color,
        permissions: req.body.permissions
      });
      
      const role = await newRole.save();
      
      res.json(role);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT /api/roles/:id
// @desc    Update a role
// @access  Private
router.put('/:id',
  [
    auth,
    param('id').isMongoId().withMessage('Invalid role ID'),
    body('name').notEmpty().withMessage('Role name is required'),
    body('color').optional().isHexColor().withMessage('Color must be a valid hex color'),
    body('permissions').isObject().withMessage('Permissions must be an object')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if role exists
      let role = await Role.findById(req.params.id);
      
      if (!role) {
        return res.status(404).json({ msg: 'Role not found' });
      }
      
      // Check if another role with the same name exists
      const existingRole = await Role.findOne({ 
        name: req.body.name,
        _id: { $ne: req.params.id }
      });
      
      if (existingRole) {
        return res.status(400).json({ msg: 'Role with this name already exists' });
      }
      
      // Update role
      role.name = req.body.name;
      
      if (req.body.color) {
        role.color = req.body.color;
      }
      
      role.permissions = req.body.permissions;
      
      await role.save();
      
      res.json(role);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE /api/roles/:id
// @desc    Delete a role
// @access  Private
router.delete('/:id',
  [
    auth,
    param('id').isMongoId().withMessage('Invalid role ID')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if role exists
      const role = await Role.findById(req.params.id);
      
      if (!role) {
        return res.status(404).json({ msg: 'Role not found' });
      }
      
      // Check if it's the default role
      if (role.isDefault) {
        return res.status(400).json({ msg: 'Cannot delete the default role' });
      }
      
      // Check if there are users with this role
      const usersWithRole = await User.findOne({ role: role._id });
      
      if (usersWithRole) {
        return res.status(400).json({ 
          msg: 'Cannot delete role that is assigned to users. Reassign users first.' 
        });
      }
      
      // Delete role
      await role.remove();
      
      res.json({ msg: 'Role deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST /api/roles/default/:id
// @desc    Set a role as default
// @access  Private
router.post('/default/:id',
  [
    auth,
    param('id').isMongoId().withMessage('Invalid role ID')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if role exists
      const role = await Role.findById(req.params.id);
      
      if (!role) {
        return res.status(404).json({ msg: 'Role not found' });
      }
      
      // Remove default from all roles
      await Role.updateMany({}, { isDefault: false });
      
      // Set this role as default
      role.isDefault = true;
      await role.save();
      
      res.json(role);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;