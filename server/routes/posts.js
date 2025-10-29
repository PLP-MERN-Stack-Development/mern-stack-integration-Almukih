const express = require('express');
const { body, validationResult, param } = require('express-validator');
const Post = require('../models/Post');
const Category = require('../models/Category');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// simple auth middleware to attach user if token provided
function authOptional(req, res, next) {
  const auth = req.headers.authorization;
  if(!auth) return next();
  const token = auth.split(' ')[1];
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.user = data;
  } catch(e) {}
  next();
}

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({ message: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.user = data;
    next();
  } catch(e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// GET /api/posts
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', category } = req.query;
    const q = {};
    if (search) q.$or = [{ title: new RegExp(search, 'i') }, { content: new RegExp(search, 'i') }];
    if (category) {
      const cat = await Category.findOne({ name: category }) || await Category.findById(category).catch(()=>null);
      if (cat) q.category = cat._id;
    }
    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    const total = await Post.countDocuments(q);
    const posts = await Post.find(q).populate('category').populate('author', 'username').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ total, page: Number(page), pages: Math.ceil(total / limit), posts });
  } catch (err) { next(err); }
});

// GET /api/posts/:id
router.get('/:id', param('id').isMongoId().withMessage('Invalid id'), authOptional, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('category').populate('author', 'username');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.viewCount = (post.viewCount || 0) + 1;
    await post.save();
    res.json(post);
  } catch (err) { next(err); }
});

// POST /api/posts (protected)
router.post('/', requireAuth, body('title').isString().trim().notEmpty(), body('content').isString().trim().notEmpty(), async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { title, content, category: categoryIdOrName, featuredImage } = req.body;
    let category = null;
    if (categoryIdOrName) {
      category = await Category.findOne({ name: categoryIdOrName }) || await Category.findById(categoryIdOrName).catch(()=>null);
    }
    const author = req.user ? req.user.id : null;
    const post = new Post({ title, content, category: category ? category._id : null, featuredImage: featuredImage || '', author });
    await post.save();
    res.status(201).json(post);
  } catch (err) { next(err); }
});

// PUT /api/posts/:id (protected)
router.put('/:id', requireAuth, param('id').isMongoId().withMessage('Invalid id'), body('title').optional().isString(), body('content').optional().isString(), async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const update = {};
    if (req.body.title) update.title = req.body.title;
    if (req.body.content) update.content = req.body.content;
    if (req.body.category) {
      const cat = await Category.findOne({ name: req.body.category }) || await Category.findById(req.body.category).catch(()=>null);
      if (cat) update.category = cat._id;
    }
    if (req.body.featuredImage) update.featuredImage = req.body.featuredImage;
    const post = await Post.findById(req.params.id);
    if(!post) return res.status(404).json({ message: 'Post not found' });
    // only allow author to edit (simple check)
    if(post.author && req.user && post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    const updated = await Post.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(updated);
  } catch (err) { next(err); }
});

// DELETE /api/posts/:id (protected)
router.delete('/:id', requireAuth, param('id').isMongoId().withMessage('Invalid id'), async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if(!post) return res.status(404).json({ message: 'Post not found' });
    if(post.author && req.user && post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
