import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const CATEGORIES = [
  'Electric Cars',
  'SUVs',
  'Sports Cars',
  'Luxury Cars',
  'Concept Cars',
  'Car Launches',
];

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  brand: '',
  category: 'Electric Cars',
  author: 'Engine Era Team',
  isFeatured: false,
  image: null,
};

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Tab state
  const [activeTab, setActiveTab] = useState('overview');

  // Overview stats
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
  });

  // Posts
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // Comments
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  // Form
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchComments();
  }, []);

  // ─── Fetch ───────────────────────────────────────────────

  const fetchPosts = async () => {
    try {
      setPostsLoading(true);
      const { data } = await API.get('/posts?limit=100');
      setPosts(data.posts);

      // Calculate stats
      const totalViews = data.posts.reduce((sum, p) => sum + p.views, 0);
      const totalLikes = data.posts.reduce((sum, p) => sum + p.likes, 0);
      setStats((prev) => ({
        ...prev,
        totalPosts: data.posts.length,
        totalViews,
        totalLikes,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const { data } = await API.get('/comments');
      setComments(data);
      setStats((prev) => ({ ...prev, totalComments: data.length }));
    } catch (error) {
      console.error(error);
    } finally {
      setCommentsLoading(false);
    }
  };

  // ─── Form Handlers ───────────────────────────────────────

  const handleFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setFormLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('excerpt', form.excerpt);
      formData.append('content', form.content);
      formData.append('brand', form.brand);
      formData.append('category', form.category);
      formData.append('author', form.author);
      formData.append('isFeatured', form.isFeatured);
      if (form.image) formData.append('image', form.image);

      if (editingId) {
        await API.put(`/posts/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setFormSuccess('Post updated successfully!');
      } else {
        await API.post('/posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setFormSuccess('Post created successfully!');
      }

      setForm(emptyForm);
      setEditingId(null);
      setImagePreview(null);
      fetchPosts();
      setActiveTab('posts');
    } catch (error) {
      setFormError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (post) => {
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      brand: post.brand,
      category: post.category,
      author: post.author,
      isFeatured: post.isFeatured,
      image: null,
    });
    setEditingId(post._id);
    setImagePreview(post.image ? `http://localhost:5000${post.image}` : null);
    setFormError('');
    setFormSuccess('');
    setActiveTab('create');
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await API.delete(`/posts/${id}`);
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await API.delete(`/comments/${id}`);
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelEdit = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImagePreview(null);
    setFormError('');
    setFormSuccess('');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // ─── Render ──────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-3xl font-bold">
            Admin <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage your Engine Era content</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gray-800 text-gray-300 px-4 py-2 rounded-full text-sm hover:text-primary transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-800 pb-0">
        {[
          { key: 'overview', label: '📊 Overview' },
          { key: 'posts', label: '📰 Posts' },
          { key: 'create', label: editingId ? '✏️ Edit Post' : '➕ Create Post' },
          { key: 'comments', label: '💬 Comments' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {activeTab === 'overview' && (
        <div>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Posts', value: stats.totalPosts, icon: '📰', color: 'text-blue-400' },
              { label: 'Total Views', value: stats.totalViews, icon: '👁', color: 'text-green-400' },
              { label: 'Total Likes', value: stats.totalLikes, icon: '❤️', color: 'text-primary' },
              { label: 'Total Comments', value: stats.totalComments, icon: '💬', color: 'text-yellow-400' },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-gray-800 rounded-xl p-5">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Recent Posts */}
          <div className="bg-card border border-gray-800 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Recent Posts</h2>
            {postsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-800 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {posts.slice(0, 5).map((post) => (
                  <div
                    key={post._id}
                    className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0"
                  >
                    <div>
                      <p className="text-white text-sm font-medium line-clamp-1">{post.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{post.category} • {new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>👁 {post.views}</span>
                      <span>❤️ {post.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Posts Tab ── */}
      {activeTab === 'posts' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">All Posts ({posts.length})</h2>
            <button
              onClick={() => { handleCancelEdit(); setActiveTab('create'); }}
              className="bg-primary text-white px-4 py-2 rounded-full text-sm hover:bg-red-700 transition-colors"
            >
              + New Post
            </button>
          </div>

          {postsLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-card rounded-xl animate-pulse border border-gray-800" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              <p>No posts yet</p>
              <button
                onClick={() => setActiveTab('create')}
                className="text-primary mt-2 hover:underline text-sm"
              >
                Create your first post
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-card border border-gray-800 rounded-xl p-4 flex items-center gap-4"
                >
                  {/* Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                    {post.image ? (
                      <img
                        src={`http://localhost:5000${post.image}`}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                        No img
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium line-clamp-1">{post.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                        {post.category}
                      </span>
                      {post.isFeatured && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                      <span className="text-gray-500 text-xs">👁 {post.views}</span>
                      <span className="text-gray-500 text-xs">❤️ {post.likes}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(post)}
                      className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg text-xs hover:text-primary transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg text-xs hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Create / Edit Tab ── */}
      {activeTab === 'create' && (
        <div className="max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold">
              {editingId ? 'Edit Post' : 'Create New Post'}
            </h2>
            {editingId && (
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {formError && (
            <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
              {formError}
            </div>
          )}
          {formSuccess && (
            <div className="bg-green-900/30 border border-green-800 text-green-400 text-sm px-4 py-3 rounded-lg mb-4">
              {formSuccess}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleFormChange}
                placeholder="Enter post title"
                required
                className="w-full bg-gray-800 text-white text-sm px-4 py-3 rounded-lg outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Brand & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Brand *</label>
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleFormChange}
                  placeholder="e.g. Tesla, BMW"
                  required
                  className="w-full bg-gray-800 text-white text-sm px-4 py-3 rounded-lg outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  className="w-full bg-gray-800 text-white text-sm px-4 py-3 rounded-lg outline-none focus:ring-1 focus:ring-primary"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Author */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Author</label>
              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleFormChange}
                placeholder="Author name"
                className="w-full bg-gray-800 text-white text-sm px-4 py-3 rounded-lg outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Excerpt * (max 300 chars)</label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleFormChange}
                placeholder="Short description of the article..."
                rows={3}
                maxLength={300}
                required
                className="w-full bg-gray-800 text-white text-sm px-4 py-3 rounded-lg outline-none focus:ring-1 focus:ring-primary resize-none"
              />
              <p className="text-gray-600 text-xs mt-1 text-right">
                {form.excerpt.length}/300
              </p>
            </div>

            {/* Content */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Content *</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleFormChange}
                placeholder="Write your full article here..."
                rows={12}
                required
                className="w-full bg-gray-800 text-white text-sm px-4 py-3 rounded-lg outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                Cover Image {editingId ? '(leave empty to keep current)' : ''}
              </label>
              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFormChange}
                className="w-full bg-gray-800 text-gray-300 text-sm px-4 py-3 rounded-lg outline-none focus:ring-1 focus:ring-primary file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-primary file:text-white"
              />
              {imagePreview && (
                <div className="mt-3 rounded-lg overflow-hidden h-40">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isFeatured"
                id="isFeatured"
                checked={form.isFeatured}
                onChange={handleFormChange}
                className="w-4 h-4 accent-primary"
              />
              <label htmlFor="isFeatured" className="text-gray-300 text-sm cursor-pointer">
                Mark as Featured Post
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={formLoading}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {formLoading
                ? editingId ? 'Updating...' : 'Creating...'
                : editingId ? 'Update Post' : 'Create Post'}
            </button>
          </form>
        </div>
      )}

      {/* ── Comments Tab ── */}
      {activeTab === 'comments' && (
        <div>
          <h2 className="text-white font-semibold mb-4">
            All Comments ({comments.length})
          </h2>

          {commentsLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-card rounded-xl animate-pulse border border-gray-800" />
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              <p>No comments yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => (
                <div
                  key={c._id}
                  className="bg-card border border-gray-800 rounded-xl p-4 flex items-start justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-sm font-medium">{c.username}</span>
                      <span className="text-gray-600 text-xs">•</span>
                      <span className="text-gray-500 text-xs">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{c.comment}</p>
                    {c.postId && (
                      <p className="text-gray-600 text-xs mt-1">
                        On: {c.postId.title}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteComment(c._id)}
                    className="text-gray-600 hover:text-red-400 text-xs transition-colors flex-shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;