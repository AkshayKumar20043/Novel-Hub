import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';
import NovelCover from '../components/NovelCover';
import NovelReviews from '../components/NovelReviews';
import Footer from '../utils/Footer';

const BookDetails = () => {
    const { id } = useParams();
    const [novel, setNovel] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isLiked, setIsLiked] = useState(false);

    const userId = Cookies.get('userId');
    const token = Cookies.get('token');
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchNovelDetails = async () => {
            try {
                setLoading(true);
                const [novelResponse, reviewsResponse] = await Promise.all([
                    axios.get(`${API_URL}/novels/${id}`),
                    axios.get(`${API_URL}/novel-reviews/${id}/reviews`)
                ]);

                const novelData = novelResponse.data;
                setNovel(novelData);

                const reviewsData = reviewsResponse.data;
                setReviews(reviewsData);

                setIsLiked(Array.isArray(novelData.likes) && novelData.likes.includes(userId));

            } catch (err) {
                console.error('Error fetching novel details:', err);
                setError(err.response?.data?.msg || 'Failed to fetch novel details');
            } finally {
                setLoading(false);
            }
        };

        fetchNovelDetails();
    }, [id, userId]);

    const handleLike = async () => {
        try {
            if (!userId || !token) {
                navigate('/login');
                return;
            }
            const response = await axios.post(
                `${API_URL}/novels/${id}/toggle-like`,
                null,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNovel(prev => ({
                ...prev,
                likes: response.data.likes
            }));
            setIsLiked(Array.isArray(response.data.likes) && response.data.likes.includes(userId));

        } catch (err) {
            console.error('Like error:', err);
            setError(err.response?.data?.msg || 'Failed to update like status');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-black/80">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
                        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error! </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black/100">
            <Navbar />
            <div className="container mx-auto px-4 py-8 mt-16">
                <NovelCover
                    novel={novel}
                    onLike={handleLike}
                    isLiked={isLiked}
                />

                <NovelReviews reviews={reviews} novelId={id} />
            </div>
            <Footer />
        </div>
    );
};

export default BookDetails;
