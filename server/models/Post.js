const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: 300,
    },
    image: {
      type: String,
      default: '',
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Electric Cars',
        'SUVs',
        'Sports Cars',
        'Luxury Cars',
        'Concept Cars',
        'Car Launches',
      ],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      default: 'Engine Era Team',
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: String,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for search
postSchema.index({ title: 'text', content: 'text', brand: 'text' });

module.exports = mongoose.model('Post', postSchema);