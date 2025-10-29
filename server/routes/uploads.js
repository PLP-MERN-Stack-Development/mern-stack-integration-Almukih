const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Single file upload
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  // return the path for client to use as featuredImage
  res.json({ path: `/uploads/${req.file.filename}` });
});

module.exports = router;
