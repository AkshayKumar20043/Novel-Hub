import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';

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
    <>
       <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* User Info Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Role:</strong> {userData.role}</p>
              {userData.role === 'user' && !authorshipRequested && (
                <button
                  onClick={handleAuthorshipRequest}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Apply for Authorship
                </button>
              )}
              {authorshipRequested && (
                <p className="mt-4 text-green-600">Authorship request submitted!</p>
              )}
            </div>
          </div>
        </div>

        {/* Author Form Popup */}
        {showAuthorForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Apply for Authorship</h2>
              <form onSubmit={handleAuthorFormSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Pen Name</label>
                  <input
                    type="text"
                    value={authorFormData.penName}
                    onChange={(e) => setAuthorFormData({...authorFormData, penName: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={authorFormData.bio}
                    onChange={(e) => setAuthorFormData({...authorFormData, bio: e.target.value})}
                    className="w-full p-2 border rounded h-32"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAuthorForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Become Author
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Author Section */}
        {userData.role === 'author' && authorData && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Author Information</h2>
            <div className="mb-6">
              <p><strong>Pen Name:</strong> {authorData.penName}</p>
              <p><strong>Bio:</strong> {authorData.bio}</p>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Your Novels</h3>
              <button
                onClick={() => setShowNovelForm(true)}
                className="bg-gradient-to-r from-[#01A8FF] to-[#0165FF] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                Upload New Novel
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

            {novelsData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {novelsData.map((novel) => (
                  <div key={novel.id} className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                    <img
                      src={`${API_NOVELCOVERS_URL}/${novel.coverPhoto}`}
                      alt={novel.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <h4 className="text-lg font-semibold">
                      <a href={`/novels/${novel.id}`} className="text-blue-600 hover:underline">
                        {novel.title}
                      </a>
                    </h4>
                    <p className="text-gray-600 mt-2 line-clamp-2">{novel.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No novels yet.</p>
            )}
          </div>
        )}

        {/* Posts Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Posts</h2>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-gray-50 p-4 rounded-lg shadow">
                  {post.image && (
                    <img
                      src={`${API_POSTS_IMG_URL}/${post.image}`}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600">{post.content}</p>
                  <div className="mt-4 text-sm text-gray-500">
                    <span>Likes: {post.likes}</span>
                    <span className="mx-4">Comments: {post.comments.length}</span>
                    <span>{post.timeStamp}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No posts yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
