import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL;
const API_POSTS_IMG_URL = import.meta.env.VITE_API_POSTS_IMG_URL;

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', image: null });
  const userId = Cookies.get('userId');
  const [selectedTab, setSelectedTab] = useState('trending');

  useEffect(() => {
    fetchPosts();
  }, [selectedTab]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      let sortedPosts = [...response.data];
      
      if (selectedTab === 'trending') {
        sortedPosts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      } else {
        sortedPosts.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
      }
      
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
      fetchPosts();
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
      <div className="min-h-screen bg-gray-50">
        {/* Main Container */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Create Post Card */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white">
                <i className="bx bx-user text-xl"></i>
              </div>
              <button
                onClick={() => setShowNewPostForm(true)}
                className="flex-1 text-left px-4 py-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
              >
                What's on your mind?
              </button>
              <button
                onClick={() => setShowNewPostForm(true)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
              >
                <i className="bx bx-image-alt text-2xl"></i>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSelectedTab('trending')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                selectedTab === 'trending'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="bx bx-trending-up"></i>
              Trending
            </button>
            <button
              onClick={() => setSelectedTab('recent')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                selectedTab === 'recent'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="bx bx-time"></i>
              Recent
            </button>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Post Header */}
                <div className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white">
                    <i className="bx bx-user text-xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{post.title}</h3>
                    <p className="text-sm text-gray-500">{post.timeStamp}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <i className="bx bx-dots-horizontal-rounded text-xl"></i>
                  </button>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-gray-600 mb-4">{post.content}</p>
                </div>

                {/* Post Image */}
                {post.image && (
                  <div className="relative">
                    <img
                      src={`${API_POSTS_IMG_URL}/${post.image}`}
                      alt={post.title}
                      className="w-full max-h-[500px] object-cover"
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className="px-4 py-3 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                        <i className="bx bx-heart text-xl"></i>
                        <span>{post.likes || 0}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                        <i className="bx bx-message-rounded text-xl"></i>
                        <span>{post.comments?.length || 0}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors">
                        <i className="bx bx-share text-xl"></i>
                      </button>
                    </div>
                    <button className="text-gray-600 hover:text-blue-500 transition-colors">
                      <i className="bx bx-bookmark text-xl"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Post Modal */}
        {showNewPostForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold">Create Post</h2>
                <button
                  onClick={() => setShowNewPostForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="bx bx-x text-2xl"></i>
                </button>
              </div>
              
              <form onSubmit={handleSubmitPost} className="p-4">
                <div className="mb-4">
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    placeholder="Post title"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    placeholder="What's on your mind?"
                    className="w-full p-2 border border-gray-200 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-50 text-gray-500 rounded-lg border-2 border-gray-200 border-dashed cursor-pointer hover:bg-gray-100">
                      <i className="bx bx-cloud-upload text-3xl mb-2"></i>
                      <span className="text-sm">Click to upload image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewPost({...newPost, image: e.target.files[0]})}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowNewPostForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ForumPage;
