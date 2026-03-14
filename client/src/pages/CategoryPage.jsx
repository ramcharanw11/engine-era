import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
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
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-text-main text-3xl font-bold">
          {category} <span className="text-primary">News</span>
        </h1>
        <p className="text-text-soft mt-2 text-sm">
          Latest updates and articles about {category}
        </p>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-surface rounded-xl h-72 animate-pulse border border-border-subtle" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-text-soft py-20">
          <p className="text-xl">No posts in this category yet</p>
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
          <span className="px-4 py-2 text-text-soft text-sm">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-surface text-text-main border border-border-subtle rounded-full text-sm disabled:opacity-40 hover:bg-surface-muted transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
