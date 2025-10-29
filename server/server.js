const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const postsRouter = require('./routes/posts');
const categoriesRouter = require('./routes/categories');
const authRouter = require('./routes/auth');
const uploadRouter = require('./routes/uploads');
const errorHandler = require('./middleware/errorHandler');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern_blog_db';
const PORT = process.env.PORT || 5001;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve uploaded files

mongoose.connect(MONGO_URI).then(() => console.log('MongoDB connected')).catch(e => console.error(e));

app.use('/api/posts', postsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/auth', authRouter);
app.use('/api/uploads', uploadRouter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => console.log('Server running on', PORT));
}
module.exports = app;
