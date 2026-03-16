import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import API from '../utils/api';

const CategoryPage = () => {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/posts?category=${category}&page=${page}&limit=9`);
      setPosts(data.posts);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [category, page]);

  useEffect(() => {
    fetchPosts();
    window.scrollTo(0, 0);
  }, [fetchPosts]);

  return (
    <div className="pb-32">
      {/* Header Section */}
      <header className="bg-brand-900 pt-20 pb-24 sm:pt-24 sm:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[150px] -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-400 rounded-full blur-[150px] -ml-48 -mb-48"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <Link to="/" className="text-primary font-bold text-[10px] uppercase tracking-[0.3em] mb-6 block hover:text-white transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold text-white mb-6 tracking-tighter uppercase">
            {category} <span className="text-primary italic">Archive</span>
          </h1>
          <p className="text-brand-300 text-lg sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            A curated collection of news, reviews, and insights specifically focused on {category}.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 -mt-12 sm:-mt-16">
        {/* Posts Grid */}
        <div className="bg-white rounded-[3rem] p-8 sm:p-12 lg:p-16 shadow-2xl shadow-brand-900/10 min-h-[50vh]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-brand-50 rounded-[2rem] h-96 animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-32">
              <span className="text-5xl mb-6 block">📂</span>
              <h3 className="text-brand-900 text-2xl font-display font-bold mb-2">No Articles Found</h3>
              <p className="text-brand-400 max-w-sm mx-auto">We haven't published any articles in this category yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 mt-16">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="w-12 h-12 flex items-center justify-center bg-white border border-brand-100 rounded-full text-brand-900 disabled:opacity-30 hover:bg-brand-900 hover:text-white transition-all duration-300 shadow-sm"
              >
                ←
              </button>
              <div className="flex items-center gap-2">
                <span className="text-brand-900 font-bold text-sm">{page}</span>
                <span className="text-brand-300 font-medium text-sm">/</span>
                <span className="text-brand-400 font-medium text-sm">{totalPages}</span>
              </div>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="w-12 h-12 flex items-center justify-center bg-white border border-brand-100 rounded-full text-brand-900 disabled:opacity-30 hover:bg-brand-900 hover:text-white transition-all duration-300 shadow-sm"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
