import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';
import { FaBook, FaComments, FaHeart, FaUserEdit } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;
const API_NOVELCOVERS_URL = import.meta.env.VITE_API_NOVELCOVERS_URL;
const API_POSTS_IMG_URL = import.meta.env.VITE_API_POSTS_IMG_URL;
const userId = Cookies.get('userId');

const fetchUserData = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('Failed to fetch user data');
  }
};

const fetchAuthorData = async () => {
  try {
    const response = await axios.get(`${API_URL}/authors/author-dashboard/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching author data:', error);
    return null;
  }
};

const fetchUserPosts = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/posts/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

const fetchNovelData = async (novelId) => {
  try {
    const response = await axios.get(`${API_URL}/novels/${novelId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching novel with ID: ${novelId}`, error);
    return null;
  }
};

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [authorData, setAuthorData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [novelsData, setNovelsData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorshipRequested, setAuthorshipRequested] = useState(false);
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [showNovelForm, setShowNovelForm] = useState(false);
  const [authorFormData, setAuthorFormData] = useState({
    penName: '',
    bio: ''
  });

  const [newNovel, setNewNovel] = useState({
    title: '',
    description: '',
    coverPhoto: null,
    introVideo: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const user = await fetchUserData(userId);
        setUserData(user);

        // Fetch posts
        const userPosts = await fetchUserPosts(userId);
        setPosts(userPosts);

        if (user.role === 'author') {
          const author = await fetchAuthorData();
          if (author) {
            setAuthorData(author);
            const novelPromises = author.novels.map((novelId) => fetchNovelData(novelId));
            const novels = await Promise.all(novelPromises);
            setNovelsData(novels.filter((novel) => novel !== null));
          }
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAuthorFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/authors/applyAuthorship`, {
        userId,
        penName: authorFormData.penName,
        bio: authorFormData.bio
      });
      setAuthorshipRequested(true);
      setShowAuthorForm(false);
    } catch (error) {
      console.error('Error requesting authorship:', error);
      setError('Failed to submit authorship request');
    }
  };

  const handleAuthorshipRequest = () => {
    setShowAuthorForm(true);
  };

  const handleNovelSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newNovel.title);
    formData.append('description', newNovel.description);
    formData.append('authorId', userData.id);
    
    if (newNovel.coverPhoto) {
      formData.append('coverPhoto', newNovel.coverPhoto);
    }
    
    if (newNovel.introVideo) {
      // Check if it's a file or URL
      if (typeof newNovel.introVideo === 'string') {
        formData.append('introVideo', newNovel.introVideo);
      } else {
        formData.append('introVideo', newNovel.introVideo);
      }
    }

    try {
      await axios.post(`${API_URL}/novels`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setShowNovelForm(false);
      setNewNovel({
        title: '',
        description: '',
        coverPhoto: null,
        introVideo: ''
      });

      // Refresh novels data
      const author = await fetchAuthorData();
      if (author) {
        const novelPromises = author.novels.map((novelId) => fetchNovelData(novelId));
        const novels = await Promise.all(novelPromises);
        setNovelsData(novels.filter((novel) => novel !== null));
      }
    } catch (err) {
      console.error('Error uploading novel:', err);
      setError('Failed to upload novel');
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center p-8">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* User Info Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome, {userData.name}!
            </h1>
            <div className="flex items-center space-x-2">
              <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                userData.role === 'author' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm">
              <div className="flex items-center space-x-4">
                <FaBook className="text-blue-600 text-2xl" />
                <div>
                  <p className="text-sm text-gray-600">Total Novels</p>
                  <p className="text-2xl font-bold text-gray-800">{userData.role === 'author' ? novelsData.length : 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm">
              <div className="flex items-center space-x-4">
                <FaComments className="text-purple-600 text-2xl" />
                <div>
                  <p className="text-sm text-gray-600">Posts</p>
                  <p className="text-2xl font-bold text-gray-800">{posts.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl shadow-sm">
              <div className="flex items-center space-x-4">
                <FaHeart className="text-pink-600 text-2xl" />
                <div>
                  <p className="text-sm text-gray-600">Total Likes</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {posts.reduce((total, post) => total + post.likes, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm">
              <div className="flex items-center space-x-4">
                <FaUserEdit className="text-green-600 text-2xl" />
                <div>
                  <p className="text-sm text-gray-600">Role Status</p>
                  <p className="text-2xl font-bold text-gray-800">{userData.role === 'author' ? 'Active' : 'User'}</p>
                </div>
              </div>
            </div>
          </div>

          {userData.role === 'user' && !authorshipRequested && (
            <button
              onClick={handleAuthorshipRequest}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Apply for Authorship
            </button>
          )}
          {authorshipRequested && (
            <div className="bg-green-50 text-green-700 px-6 py-3 rounded-lg border border-green-200">
              Authorship request submitted successfully! We&apos;ll review your application soon.
            </div>
          )}
        </div>

        {/* Author Form Popup */}
        {showAuthorForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full m-4 transform transition-all">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Become an Author
              </h2>
              <form onSubmit={handleAuthorFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Pen Name</label>
                  <input
                    type="text"
                    value={authorFormData.penName}
                    onChange={(e) => setAuthorFormData({...authorFormData, penName: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Bio</label>
                  <textarea
                    value={authorFormData.bio}
                    onChange={(e) => setAuthorFormData({...authorFormData, bio: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAuthorForm(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Author Section */}
        {userData.role === 'author' && authorData && (
          <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Author Dashboard
              </h2>
              <button
                onClick={() => setShowNovelForm(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-2"
              >
                <FaBook className="text-lg" />
                <span>Upload New Novel</span>
              </button>
            </div>
            {/* Novel Upload Form Modal */}
            {showNovelForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4">
                  <h2 className="text-2xl font-bold mb-4">Upload New Novel</h2>
                  <form onSubmit={handleNovelSubmit}>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={newNovel.title}
                        onChange={(e) => setNewNovel({...newNovel, title: e.target.value})}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Description</label>
                      <textarea
                        value={newNovel.description}
                        onChange={(e) => setNewNovel({...newNovel, description: e.target.value})}
                        className="w-full p-2 border rounded h-32"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Cover Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewNovel({...newNovel, coverPhoto: e.target.files[0]})}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Intro Video (Optional)</label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => setNewNovel({...newNovel, introVideo: e.target.files[0]})}
                          className="w-full p-2 border rounded"
                        />
                        <p className="text-sm text-gray-500">Or</p>
                        <input
                          type="text"
                          placeholder="YouTube Video URL"
                          value={typeof newNovel.introVideo === 'string' ? newNovel.introVideo : ''}
                          onChange={(e) => setNewNovel({...newNovel, introVideo: e.target.value})}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => setShowNovelForm(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Upload Novel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Author Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 mb-2">Pen Name</p>
                  <p className="text-xl font-medium text-gray-800">{authorData.penName}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-2">Bio</p>
                  <p className="text-gray-800">{authorData.bio}</p>
                </div>
              </div>
            </div>

            {/* Novels Grid */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800">Your Novels</h3>
              {novelsData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {novelsData.map((novel) => (
                    <div key={novel.id} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                      <div className="relative">
                        <img
                          src={`${API_NOVELCOVERS_URL}/${novel.coverPhoto}`}
                          alt={novel.title}
                          className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-4">
                        <h4 className="text-lg font-semibold mb-2">
                          <a href={`/novels/${novel.id}`} className="text-gray-800 hover:text-blue-600 transition-colors">
                            {novel.title}
                          </a>
                        </h4>
                        <p className="text-gray-600 text-sm line-clamp-2">{novel.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <FaBook className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No novels published yet. Start your writing journey today!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Posts Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Your Posts
          </h2>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                  {post.image && (
                    <div className="relative">
                      <img
                        src={`${API_POSTS_IMG_URL}/${post.image}`}
                        alt={post.title}
                        className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.content}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <FaHeart className="text-pink-500 mr-2" />
                          {post.likes} likes
                        </span>
                        <span className="flex items-center">
                          <FaComments className="text-blue-500 mr-2" />
                          {post.comments.length} comments
                        </span>
                      </div>
                      <span>{new Date(post.timeStamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <FaComments className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No posts yet. Share your thoughts with the community!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
