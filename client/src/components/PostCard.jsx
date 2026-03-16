import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000';
  
  // Logic to handle both local uploads and external Unsplash URLs
  const imageUrl = post.image 
    ? (post.image.startsWith('http') ? post.image : `http://localhost:5001${post.image}`)
    : defaultImage;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-brand-100 card-hover group flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-900 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-3 text-brand-400 text-[11px] font-bold uppercase tracking-wider mb-4">
          <span className="text-primary">{post.brand}</span>
          <span className="w-1 h-1 rounded-full bg-brand-200"></span>
          <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>

        <Link to={`/post/${post._id}`}>
          <h3 className="text-brand-900 font-display font-bold text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
            {post.title}
          </h3>
        </Link>

        <p className="text-brand-500 text-sm leading-relaxed line-clamp-2 mb-6 font-medium">
          {post.excerpt}
        </p>

        <div className="mt-auto pt-6 border-t border-brand-50 flex items-center justify-between">
          <Link
            to={`/post/${post._id}`}
            className="text-brand-900 text-xs font-bold uppercase tracking-widest flex items-center gap-2 group/link"
          >
            Read Article
            <span className="group-hover/link:translate-x-1 transition-transform duration-300">→</span>
          </Link>
          
          <div className="flex items-center gap-4 text-brand-400 font-medium text-xs">
            <span className="flex items-center gap-1.5">
              <span className="text-[14px]">👁️</span> {post.views}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[14px]">❤️</span> {post.likes}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
