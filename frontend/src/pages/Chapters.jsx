import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Chapters = () => {
    const { id } = useParams(); // Get the novel ID from the URL
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const response = await axios.get(`${API_URL}/novels/${id}/chapters`);
                setChapters(response.data);
            } catch (err) {
                setError('Failed to fetch chapters');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchChapters();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-lg">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-lg text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
                <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
                    Chapters
                </h2>
                {chapters.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {chapters.map((chapter) => (
                            <div
                                key={chapter.id}
                                className="bg-gray-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <Link to={`/novels/${id}/chapters/${chapter.id}`}>
                                    <h3 className="text-2xl font-semibold text-blue-600 hover:underline">
                                        {chapter.chapterName}
                                    </h3>
                                </Link>
                                <p className="text-gray-700 mt-2 text-sm leading-relaxed">
                                    {chapter.chapterContent.slice(0, 150)}...
                                </p>
                                <Link
                                    to={`/novels/${id}/chapters/${chapter.id}`}
                                    className="inline-block mt-4 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition"
                                >
                                    Read More
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-lg text-gray-700 text-center">
                        No chapters available
                    </p>
                )}
            </div>
        </div>
    );
};

export default Chapters;
