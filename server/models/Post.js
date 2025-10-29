const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  featuredImage: { type: String, default: '' },
  viewCount: { type: Number, default: 0 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });
module.exports = mongoose.model('Post', PostSchema);
