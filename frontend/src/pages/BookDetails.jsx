import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import Navbar from '../components/Navbar';

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [users, setUsers] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [expandedReplies, setExpandedReplies] = useState({});

    const userId = Cookies.get('userId');
    const navigate = useNavigate();  // Initialize useNavigate hook

    const API_URL = import.meta.env.VITE_API_URL;
    const NOVEL_COVERS_PATH = import.meta.env.VITE_API_NOVELCOVERS_URL;
    const NOVEL_VIDEO_PATH = import.meta.env.VITE_API_NOVEL_VIDEO_URL;

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const [bookResponse, reviewsResponse] = await Promise.all([
                    axios.get(`${API_URL}/novels/${id}`),
                    axios.get(`${API_URL}/novels/${id}/reviews`)
                ]);
                setBook(bookResponse.data);
                setReviews(reviewsResponse.data);

                // Initialize expanded state for each review
                const initialExpandedState = {};
                reviewsResponse.data.forEach(review => {
                    initialExpandedState[review.id] = false;
                });
                setExpandedReplies(initialExpandedState);

                if (userId) {
                    try {
                        const userResponse = await axios.get(`${API_URL}/users/${userId}`);
                        setIsLiked(userResponse.data.likedNovels?.includes(id) || false);
                    } catch (userError) {
                        console.error('Error fetching user like status:', userError);
                    }
                }

                if (reviewsResponse.data.length > 0) {
                    try {
                        const userIds = reviewsResponse.data.map(review => review.userId);
                        const userResponses = await Promise.all(
                            userIds.map(userId => axios.get(`${API_URL}/users/${userId}`))
                        );

                        const usersData = userResponses.reduce((acc, userResponse) => {
                            acc[userResponse.data.id] = userResponse.data.name;
                            return acc;
                        }, {});

                        setUsers(usersData);
                    } catch (userError) {
                        console.error('Error fetching review user details:', userError);
                        setError('Some user details could not be loaded');
                    }
                }
            } catch (err) {
                console.error('Error fetching book details:', err);
                if (err.response?.status === 404) {
                    setError('Novel not found');
                } else {
                    setError('Failed to fetch book details. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [API_URL, id]);

    const handleReadNowClick = () => {
        // Navigate to the chapters page for this novel
        navigate(`/novels/${id}/chapters`);
    };

    const handleLike = async () => {
        try {
            const token = Cookies.get('token');

            if (!userId || !token) {
                setError('Please login to like novels');
                return;
            }

            const response = await axios.post(
                `${API_URL}/novels/${id}/toggle-like`,
                { novelId: id, userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setBook(prev => ({ ...prev, likes: response.data.likes }));
            setIsLiked(response.data.isLiked);
            setError('');
        } catch (err) {
            setError('Failed to update like status');
            console.error(err);
        }
    };

    const handleReviewLike = async (reviewId) => {
        try {
            if (!userId) {
                setError('Please login to like reviews');
                return;
            }

            await axios.post(
                `${API_URL}/novels/${id}/reviews/${reviewId}/toggle-like`,
                { userId }
            );

            const reviewsResponse = await axios.get(`${API_URL}/novels/${id}/reviews`);
            setReviews(reviewsResponse.data);
        } catch (err) {
            console.error('Failed to toggle review like:', err);
            setError('Failed to update review like status');
        }
    };

    const handleCommentLike = async (reviewId, commentId) => {
        try {
            if (!userId) {
                setError('Please login to like comments');
                return;
            }

            await axios.post(
                `${API_URL}/novels/${id}/reviews/${reviewId}/comments/${commentId}/toggle-like`,
                { userId }
            );

            const reviewsResponse = await axios.get(`${API_URL}/novels/${id}/reviews`);
            setReviews(reviewsResponse.data);
        } catch (err) {
            console.error('Failed to toggle comment like:', err);
            setError('Failed to update comment like status');
        }
    };

    const toggleReplies = (reviewId) => {
        setExpandedReplies(prev => ({
            ...prev,
            [reviewId]: !prev[reviewId]
        }));
    };


    if (loading) return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-lg">{error}</div>;
    if (!book) return <div className="flex justify-center items-center h-screen text-lg">Book not found</div>;

    return (
        <div>
            <Navbar />
            <div className="flex flex-col lg:flex-row justify-center items-center p-6 bg-gray-50 rounded-xl mx-auto mt-0 mb-6">
                <div className="lg:w-1/4 p-4 lg:pr-6 flex-shrink-0">
                    <img
                        className="w-64 h-auto object-cover rounded-lg shadow-lg"
                        src={`${NOVEL_COVERS_PATH}/${book.coverPhoto}`}
                        alt={book.title}
                    />
                </div>
                <div className="lg:w-auto p-1 lg:pl-6">
                    <h1 className="text-5xl font-extrabold py-20 text-gray-900 mb-4">{book.title}</h1>
                    <div className="flex items-center py-20">
                        <button
                            className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-5 rounded-lg mr-4 transition duration-200 ease-in-out"
                            onClick={handleReadNowClick}
                        >
                            Read Now
                        </button>
                        <button className="bg-green-600 hover:bg-green-800 text-white font-semibold py-2 px-5 rounded-lg transition duration-200 ease-in-out">
                            Add to Library
                        </button>

                        <div className="flex items-center space-x-4 ml-5">
                            <button
                                onClick={handleLike}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${isLiked
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                    } transition duration-200`}
                            >
                                <svg
                                    className={`w-6 h-6 ${isLiked ? 'text-white' : 'text-gray-600'}`}
                                    fill={isLiked ? 'currentColor' : 'none'}
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                                <span className={isLiked ? 'text-white' : 'text-gray-600'}>
                                    {book.likes} {book.likes === 1 ? 'Like' : 'Likes'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
                <h2 className="text-3xl font-bold mb-4">About</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">{book.description}</p>

                <h2 className="text-3xl font-bold mb-4">Introduction Video</h2>
                <div className="relative h-0 overflow-hidden max-w-full w-full" style={{ paddingBottom: '56.25%' }}>
                    {book.introVideo.includes('youtube.com') || book.introVideo.includes('youtu.be') ? (
                        <iframe
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                            src={book.introVideo}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Introduction Video"
                        ></iframe>
                    ) : (
                        <video
                            controls
                            width="100%"
                            height="100%"
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                        >
                            <source src={`${NOVEL_VIDEO_PATH}/${book.introVideo}`} />
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
                <h2 className="text-3xl font-bold mb-4">Reviews</h2>
                {reviews && reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="p-4 bg-gray-100 rounded-lg shadow-md mb-5">
                                <div className="flex justify-between items-start mb-4">
                                    <Link
                                        to={`/novels/${book.id}/reviews/${review.id}`}
                                        state={{ novelId: book.id }}
                                        className="block flex-grow"
                                    >
                                        <h3 className="text-xl font-semibold mb-2">{review.reviewTitle}</h3>
                                        <p className="text-gray-700">{review.reviewContent}</p>
                                        <p className="text-sm text-gray-500 mt-2">By {users[review.userId]}</p>

                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleReviewLike(review.id);
                                        }}
                                        className={`flex items-center space-x-1 px-3 py-1 rounded ml-4 ${
                                            review.likes && review.likes.includes(userId)
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                    >
                                        <span>
                                            {review.likes && review.likes.includes(userId) ? 'Unlike' : 'Like'}
                                        </span>
                                        <span>({review.likes ? review.likes.length : 0})</span>
                                    </button>
                                </div>
                                
                                {review.replies && review.replies.length > 0 && (
                                    <div className="mt-4">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleReplies(review.id);
                                            }}
                                            className="text-blue-600 hover:text-blue-800 font-medium mb-2 flex items-center"
                                        >
                                            {expandedReplies[review.id] ? (
                                                <>
                                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                    Hide Replies
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                    Show Replies ({review.replies.length})
                                                </>
                                            )}
                                        </button>
                                        
                                        {expandedReplies[review.id] && (
                                            <div className="pl-8 space-y-2 mt-2">
                                                {review.replies.map((reply) => (
                                                    <div key={reply.id} className="p-3 bg-white rounded-lg shadow-sm mb-2">
                                                        <p className="text-gray-700 mb-2">{reply.content}</p>
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => handleCommentLike(review.id, reply.id)}
                                                                className={`flex items-center space-x-1 px-3 py-1 rounded ${
                                                                    reply.likes && reply.likes.includes(userId)
                                                                        ? 'bg-blue-500 text-white'
                                                                        : 'bg-gray-200 hover:bg-gray-300'
                                                                }`}
                                                            >
                                                                <span>
                                                                    {reply.likes && reply.likes.includes(userId) ? 'Unlike' : 'Like'}
                                                                </span>
                                                                <span>({reply.likes ? reply.likes.length : 0})</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-lg text-gray-700">No reviews yet</p>
                )}
            </div>
        </div>
    );
};

export default BookDetails;
