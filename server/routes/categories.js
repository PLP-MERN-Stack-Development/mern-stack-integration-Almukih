const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const cats = await Category.find().sort('name');
    res.json(cats);
  } catch (err) { next(err); }
});

router.post('/', body('name').isString().trim().notEmpty(), async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { name, description } = req.body;
    if (await Category.findOne({ name })) return res.status(409).json({ message: 'Category exists' });
    const c = new Category({ name, description });
    await c.save();
    res.status(201).json(c);
  } catch (err) { next(err); }
});

module.exports = router;
