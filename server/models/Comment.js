const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
    },
    comment: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);