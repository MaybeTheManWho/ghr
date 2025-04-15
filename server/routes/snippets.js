const express = require('express');
const router = express.Router();
const Snippet = require('../models/Snippet');
const auth = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');

// @route   GET /api/snippets
// @desc    Get all snippets
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const snippets = await Snippet.find().sort({ name: 1 });
    res.json(snippets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/snippets
// @desc    Create a snippet
// @access  Private
router.post('/',
  [
    auth,
    body('name').notEmpty().withMessage('Name is required'),
    body('content').notEmpty().withMessage('Content is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if snippet with the same name already exists
      const existingSnippet = await Snippet.findOne({ name: req.body.name });
      
      if (existingSnippet) {
        return res.status(400).json({ msg: 'Snippet with this name already exists' });
      }
      
      // Create new snippet
      const newSnippet = new Snippet({
        name: req.body.name,
        content: req.body.content,
        createdBy: req.user.id
      });
      
      const snippet = await newSnippet.save();
      
      res.json(snippet);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT /api/snippets/:id
// @desc    Update a snippet
// @access  Private
router.put('/:id',
  [
    auth,
    param('id').isMongoId().withMessage('Invalid snippet ID'),
    body('name').notEmpty().withMessage('Name is required'),
    body('content').notEmpty().withMessage('Content is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if snippet exists
      let snippet = await Snippet.findById(req.params.id);
      
      if (!snippet) {
        return res.status(404).json({ msg: 'Snippet not found' });
      }
      
      // Check if another snippet with the same name exists
      const existingSnippet = await Snippet.findOne({ 
        name: req.body.name,
        _id: { $ne: req.params.id }
      });
      
      if (existingSnippet) {
        return res.status(400).json({ msg: 'Snippet with this name already exists' });
      }
      
      // Update snippet
      snippet.name = req.body.name;
      snippet.content = req.body.content;
      snippet.updatedAt = Date.now();
      snippet.updatedBy = req.user.id;
      
      await snippet.save();
      
      res.json(snippet);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE /api/snippets/:id
// @desc    Delete a snippet
// @access  Private
router.delete('/:id',
  [
    auth,
    param('id').isMongoId().withMessage('Invalid snippet ID')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if snippet exists
      const snippet = await Snippet.findById(req.params.id);
      
      if (!snippet) {
        return res.status(404).json({ msg: 'Snippet not found' });
      }
      
      // Delete snippet
      await snippet.remove();
      
      res.json({ msg: 'Snippet deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;