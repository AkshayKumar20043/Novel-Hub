import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function WeeklyBest() {
    const [novels, setNovels] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;
    const NOVEL_COVERS_PATH = import.meta.env.VITE_API_NOVELCOVERS_URL;

    useEffect(() => {
        const fetchNovels = async () => {
            try {
                const response = await axios.get(`${API_URL}/novels`);
                // Sort by likes to get the most popular novels
                const sortedNovels = response.data
                    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
                    .slice(0, 5); // Only take top 5 novels
                setNovels(sortedNovels);
            } catch (err) {
                setError('Failed to fetch novels');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchNovels();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % novels.length);
        }, 3000); // Change every 3 seconds for better readability

        return () => clearInterval(intervalId);
    }, [novels]);

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
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Weekly Best</h2>
            {novels.length > 0 && (
                <div 
                    className="relative h-[350px] rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
                    onClick={() => navigate(`/novels/${novels[currentIndex].id}`)}
                >
                    {/* Background with gradient overlay */}
                    <div className="absolute inset-0">
                        <img
                            src={`${NOVEL_COVERS_PATH}/${novels[currentIndex].coverPhoto}`}
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex items-center p-8">
                        <div className="flex gap-8 items-center">
                            {/* Book Cover */}
                            <img
                                src={`${NOVEL_COVERS_PATH}/${novels[currentIndex].coverPhoto}`}
                                alt={novels[currentIndex].title}
                                className="w-48 h-64 object-cover rounded-lg shadow-2xl"
                            />
                            
                            {/* Text Content */}
                            <div className="text-white max-w-xl">
                                <h3 className="text-3xl font-bold mb-3">{novels[currentIndex].title}</h3>
                                <p className="text-gray-200 line-clamp-3">{novels[currentIndex].description}</p>
                                
                                {/* Stats */}
                                <div className="flex items-center gap-6 mt-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <i className="bx bx-heart text-red-500"></i>
                                        <span>{novels[currentIndex].likes || 0} Likes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <i className="bx bx-book-open text-blue-400"></i>
                                        <span>{novels[currentIndex].chapters?.length || 0} Chapters</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                        {novels.map((_, index) => (
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

export default WeeklyBest;