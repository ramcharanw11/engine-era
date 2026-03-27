const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getAllPosts,
  getPostById,
  getFeaturedPosts,
  getTrendingPosts,
  searchPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
} = require('../controllers/postController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const types = /jpeg|jpg|png|webp/;
    const valid = types.test(path.extname(file.originalname).toLowerCase());
    valid ? cb(null, true) : cb(new Error('Images only'));
  },
});

// Public routes
router.get('/', getAllPosts);
router.get('/featured', getFeaturedPosts);
router.get('/trending', getTrendingPosts);
router.get('/search', searchPosts);
router.get('/:id', getPostById);
router.put('/:id/like', likePost);

// Admin routes
router.post('/', protect, adminOnly, upload.single('image'), createPost);
router.put('/:id', protect, adminOnly, upload.single('image'), updatePost);
router.delete('/:id', protect, adminOnly, deletePost);

module.exports = router;