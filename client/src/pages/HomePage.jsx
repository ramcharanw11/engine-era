import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import API from '../utils/api';

const CATEGORIES = [
  'Electric Cars',
  'SUVs',
  'Sports Cars',
  'Luxury Cars',
  'Concept Cars',
  'Car Launches',
];

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page, limit: 9 });
      if (activeCategory) params.append('category', activeCategory);
      const { data } = await API.get(`/posts?${params}`);
      setPosts(data.posts);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, page]);

  const fetchFeatured = useCallback(async () => {
    try {
      const { data } = await API.get('/posts/featured');
      setFeatured(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchTrending = useCallback(async () => {
    try {
      const { data } = await API.get('/posts/trending');
      setTrending(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    fetchFeatured();
    fetchTrending();
  }, [fetchFeatured, fetchTrending]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Hero / Featured */}
      {featured.length > 0 && (
        <section className="mb-12">
          <h2 className="text-text-main text-2xl font-bold mb-6">
            Featured <span className="text-primary">Stories</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="mb-8">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => { setActiveCategory(''); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === ''
                ? 'bg-primary text-white'
                : 'bg-surface text-text-main hover:bg-surface-muted border border-border-subtle'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-main hover:bg-surface-muted border border-border-subtle'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-text-main text-2xl font-bold">
            {activeCategory || 'Latest'} <span className="text-primary">News</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-surface rounded-xl h-72 animate-pulse border border-border-subtle" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center text-text-soft py-20">
            <p className="text-xl">No posts found</p>
            <p className="text-sm mt-2">Check back later for updates</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-surface text-text-main border border-border-subtle rounded-full text-sm disabled:opacity-40 hover:bg-surface-muted transition-colors"
            >
              ← Prev
            </button>
            <span className="px-4 py-2 text-text-soft text-sm">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-surface text-text-main border border-border-subtle rounded-full text-sm disabled:opacity-40 hover:bg-surface-muted transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </section>

      {/* Trending */}
      {trending.length > 0 && (
        <section>
          <h2 className="text-text-main text-2xl font-bold mb-6">
            Trending <span className="text-primary">Now</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {trending.map((post, index) => (
              <Link
                key={post._id}
                to={`/post/${post._id}`}
                className="bg-surface border border-border-subtle rounded-xl p-4 hover:border-primary transition-all shadow-sm hover:shadow-md"
              >
                <span className="text-primary font-bold text-2xl">#{index + 1}</span>
                <p className="text-text-main text-sm font-medium mt-2 line-clamp-2">{post.title}</p>
                <p className="text-text-soft text-xs mt-1">👁 {post.views}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
