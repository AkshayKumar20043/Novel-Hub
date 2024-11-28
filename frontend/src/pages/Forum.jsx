import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL;
const API_POSTS_IMG_URL = import.meta.env.VITE_API_POSTS_IMG_URL;

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', image: null });
  const userId = Cookies.get('userId');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      // Sort posts by timestamp in descending order (newest first)
      const sortedPosts = response.data.sort((a, b) => 
        new Date(b.timeStamp) - new Date(a.timeStamp)
      );
      setPosts(sortedPosts);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
      setLoading(false);
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('content', newPost.content);
    if (newPost.image) {
      formData.append('image', newPost.image);
    }
    formData.append('userId', userId);

    try {
      await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setShowNewPostForm(false);
      setNewPost({ title: '', content: '', image: null });
      fetchPosts(); // Refresh posts after submitting
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01A8FF]"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Community Forum</h1>
          <button
            onClick={() => setShowNewPostForm(true)}
            className="bg-gradient-to-r from-[#01A8FF] to-[#0165FF] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            Create New Post
          </button>
        </div>

        {/* New Post Form Modal */}
        {showNewPostForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
              <form onSubmit={handleSubmitPost}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Content</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    className="w-full p-2 border rounded h-32"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewPost({...newPost, image: e.target.files[0]})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowNewPostForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>
                  <span className="text-sm text-gray-500">{post.timeStamp}</span>
                </div>
                {post.image && (
                  <img
                    src={`${API_POSTS_IMG_URL}/${post.image}`}
                    alt={post.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                <p className="text-gray-600 mb-4">{post.content}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="flex items-center">
                    <i className="bx bx-heart text-red-500 mr-1"></i>
                    <span>{post.likes || 0} Likes</span>
                  </div>
                  <span className="mx-4">•</span>
                  <div className="flex items-center">
                    <i className="bx bx-message text-blue-500 mr-1"></i>
                    <span>{post.comments?.length || 0} Comments</span>
                  </div>
                  {/* <span className="mx-4">•</span>
                  <span>Posted by {post.userId || 'Anonymous'}</span> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Forum;
