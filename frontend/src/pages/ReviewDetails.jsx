import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import Cookies from 'js-cookie';

const ReviewDetails = () => {
    const { reviewId } = useParams();
    const location = useLocation();
    const novelId = location.state?.novelId;
    const [review, setReview] = useState(null);
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userId = Cookies.get('userId');

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchReviewDetails = async () => {
            try {
                const reviewResponse = await axios.get(`${API_URL}/novels/${novelId}/reviews/${reviewId}`);
                setReview(reviewResponse.data);
            } catch (err) {
                setError('Failed to fetch review details or replies');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviewDetails();
    }, [reviewId, novelId]);

    const handleReplySubmit = async () => {
        try {
            await axios.post(`${API_URL}/novels/${novelId}/reviews/${reviewId}`, { content: newReply });
            // Refresh the review data to show the new reply
            const reviewResponse = await axios.get(`${API_URL}/novels/${novelId}/reviews/${reviewId}`);
            setReview(reviewResponse.data);
            setNewReply('');
        } catch (err) {
            console.error('Failed to post reply', err);
        }
    };

    const handleCommentLike = async (commentId) => {
        try {
            const response = await axios.post(
                `${API_URL}/novels/${novelId}/reviews/${reviewId}/comments/${commentId}/toggle-like`,
                { userId }
            );
            
            // Update the review state with the new likes
            const updatedReview = { ...review };
            const comment = updatedReview.replies.find(reply => reply.id === commentId);
            if (comment) {
                if (!comment.likes) comment.likes = [];
                const likeIndex = comment.likes.indexOf(userId);
                if (likeIndex === -1) {
                    comment.likes.push(userId);
                } else {
                    comment.likes.splice(likeIndex, 1);
                }
            }
            setReview(updatedReview);
        } catch (err) {
            console.error('Failed to toggle like', err);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-lg">{error}</div>;
    if (!review) return <div className="flex justify-center items-center h-screen text-lg">Review not found</div>;

    return (
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
                <h2 className="text-3xl font-bold mb-4">{review.reviewTitle}</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">{review.reviewContent}</p>
                <div className="mt-6">
                    <h3 className="text-2xl font-bold mb-4">Replies</h3>
                    {review.replies && review.replies.length > 0 ? (
                        <ul className="space-y-4">
                            {review.replies.map((reply) => (
                                <li key={reply.id} className="p-4 bg-gray-100 rounded-lg shadow-md">
                                    <p className="text-gray-700">{reply.content}</p>
                                    <div className="mt-2 flex items-center space-x-2">
                                        <button
                                            onClick={() => handleCommentLike(reply.id)}
                                            className={`flex items-center space-x-1 px-3 py-1 rounded ${
                                                reply.likes && reply.likes.includes(userId)
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 hover:bg-gray-300'
                                            }`}
                                        >
                                            <span>{reply.likes && reply.likes.includes(userId) ? 'Unlike' : 'Like'}</span>
                                            <span>({reply.likes ? reply.likes.length : 0})</span>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-lg text-gray-700">No replies yet</p>
                    )}
                </div>
                <div className="mt-6">
                    <textarea
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        placeholder="Write your reply..."
                    />
                    <button
                        onClick={handleReplySubmit}
                        className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-5 rounded-lg mt-4"
                    >
                        Submit Reply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewDetails;
