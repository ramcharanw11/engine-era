import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [username, setUsername] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Unique visitor ID (stable across renders)
  const visitorId = useMemo(() => {
    const storedId = localStorage.getItem('visitorId');
    if (storedId) return storedId;
    const newId = Math.random().toString(36).substring(2);
    localStorage.setItem('visitorId', newId);
    return newId;
  }, []);

  const fetchPost = useCallback(async () => {
    try {
      const { data } = await API.get(`/posts/${id}`);
      setPost(data);
      setLikeCount(data.likes);
      setLiked(data.likedBy?.includes(visitorId));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id, visitorId]);

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await API.get(`/comments/${id}`);
      setComments(data);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  const handleLike = async () => {
    try {
      const { data } = await API.put(`/posts/${id}/like`, { visitorId });
      setLikeCount(data.likes);
      setLiked(data.liked);
    } catch (error) {
      console.error(error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!username.trim() || !comment.trim()) return;
    try {
      setSubmitting(true);
      const { data } = await API.post(`/comments/${id}`, { username, comment });
      setComments([data, ...comments]);
      setComment('');
      setUsername('');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-muted rounded w-3/4" />
          <div className="h-64 bg-surface-muted rounded" />
          <div className="h-4 bg-surface-muted rounded" />
          <div className="h-4 bg-surface-muted rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center text-text-soft py-20">
        <p className="text-xl">Post not found</p>
        <button onClick={() => navigate('/')} className="text-primary mt-4 hover:underline">
          Go back home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-text-soft hover:text-primary text-sm mb-6 flex items-center gap-2 transition-colors"
      >
        ← Back
      </button>

      {/* Category & Brand */}
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
          {post.category}
        </span>
        <span className="text-text-soft text-sm">{post.brand}</span>
      </div>

      {/* Title */}
      <h1 className="text-text-main text-3xl md:text-4xl font-bold mb-4 leading-tight">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="flex items-center gap-4 text-text-soft text-sm mb-6">
        <span>By {post.author}</span>
        <span>•</span>
        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <span>•</span>
        <span>👁 {post.views} views</span>
      </div>

      {/* Image */}
      {post.image && (
        <div className="rounded-xl overflow-hidden mb-8 h-72 md:h-96">
          <img
            src={`http://localhost:5000${post.image}`}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="text-text-main leading-relaxed text-base whitespace-pre-line mb-8">
        {post.content}
      </div>

      {/* Like Button */}
      <div className="flex items-center gap-4 border-t border-b border-border-subtle py-4 mb-8">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${
            liked
              ? 'bg-primary text-white'
              : 'bg-surface text-text-main border border-border-subtle hover:bg-primary hover:text-white'
          }`}
        >
          {liked ? '❤️' : '🤍'} {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
        </button>
      </div>

      {/* Comments Section */}
      <section>
        <h2 className="text-text-main text-xl font-bold mb-6">
          Comments <span className="text-primary">({comments.length})</span>
        </h2>

        {/* Comment Form */}
        <form onSubmit={handleComment} className="bg-surface border border-border-subtle rounded-xl p-6 mb-8 shadow-sm">
          <h3 className="text-text-main font-medium mb-4">Leave a comment</h3>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your name"
            className="w-full bg-page text-text-main text-sm px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary mb-3 border border-border-subtle"
          />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            className="w-full bg-page text-text-main text-sm px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary resize-none mb-3 border border-border-subtle"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-primary-strong transition-colors disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        {/* Comments List */}
        {comments.length === 0 ? (
          <p className="text-text-soft text-sm text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c._id} className="bg-surface border border-border-subtle rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-main font-medium text-sm">{c.username}</span>
                  <span className="text-text-soft text-xs">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-text-main text-sm leading-relaxed">{c.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PostDetailPage;
