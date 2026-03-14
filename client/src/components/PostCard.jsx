import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const defaultImage = 'https://via.placeholder.com/400x250?text=Engine+Era';

  return (
    <div className="bg-surface rounded-xl overflow-hidden border border-border-subtle hover:border-primary transition-all duration-300 hover:-translate-y-1 group shadow-sm hover:shadow-md">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={post.image ? `http://localhost:5000${post.image}` : defaultImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-3 text-gray-500 text-xs mb-2">
          <span>{post.brand}</span>
          <span>•</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>

        <h3 className="text-text-main font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        <p className="text-text-soft text-sm line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <Link
            to={`/post/${post._id}`}
            className="text-primary text-sm font-medium hover:underline"
          >
            Read More →
          </Link>
          <div className="flex items-center gap-3 text-gray-500 text-xs">
            <span>👁 {post.views}</span>
            <span>❤️ {post.likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
