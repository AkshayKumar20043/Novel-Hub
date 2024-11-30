import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Forum() {
    const [posts, setPosts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;
    const POST_IMG_URL = import.meta.env.VITE_API_POSTS_IMG_URL;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${API_URL}/posts`);
                // Sort by likes and get top 5 posts
                const sortedPosts = response.data
                    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
                    .slice(0, 5);
                setPosts(sortedPosts);
            } catch (err) {
                setError('Failed to fetch posts');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [API_URL]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
        }, 3000);

        return () => clearInterval(intervalId);
    }, [posts]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[350px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-[350px] text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Trending Discussions</h2>
            {posts.length > 0 && (
                <div 
                    className="relative h-[350px] rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
                    onClick={() => navigate(`/forum/${posts[currentIndex].id}`)}
                >
                    {/* Background with gradient overlay */}
                    <div className="absolute inset-0">
                        <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex items-center p-8">
                        <div className="flex gap-8 items-start">
                            {/* Post Image or Avatar */}
                            <div className="w-48 h-48 rounded-lg overflow-hidden shadow-2xl flex-shrink-0">
                                {posts[currentIndex].image ? (
                                    <img
                                        src={`${POST_IMG_URL}/${posts[currentIndex].image}`}
                                        alt="Post"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-green-500 flex items-center justify-center">
                                        <i className="bx bx-message-square-dots text-6xl text-white"></i>
                                    </div>
                                )}
                            </div>
                            
                            {/* Text Content */}
                            <div className="text-white max-w-xl">
                                <h3 className="text-3xl font-bold mb-3">{posts[currentIndex].title}</h3>
                                <p className="text-gray-200 line-clamp-3">{posts[currentIndex].content}</p>
                                
                                {/* Stats */}
                                <div className="flex items-center gap-6 mt-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <i className="bx bx-heart text-red-500"></i>
                                        <span>{posts[currentIndex].likes || 0} Likes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <i className="bx bx-message-rounded text-blue-400"></i>
                                        <span>{posts[currentIndex].comments?.length || 0} Comments</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <i className="bx bx-user text-green-400"></i>
                                        <span>{posts[currentIndex].author}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                        {posts.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentIndex(index);
                                }}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    currentIndex === index 
                                        ? 'bg-white w-6' 
                                        : 'bg-white/50 hover:bg-white/75'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Forum;