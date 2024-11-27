import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const Chapters = () => {
    const { id } = useParams();  // Get the novel ID from URL
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
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
                <h2 className="text-3xl font-bold mb-4">Chapters</h2>
                {chapters.length > 0 ? (
                    <ul>
                        {chapters.map((chapter) => (
                            <li
                                key={chapter.id}
                                className="p-4 bg-gray-100 rounded-lg shadow-md mb-4"
                            >
                                <Link to={`/novels/${id}/chapters/${chapter.id}`}>
                                    <h3 className="text-xl font-semibold mb-2">{chapter.chapterName}</h3>
                                </Link>
                                <p className="text-gray-700">{chapter.chapterContent.slice(0, 200)}...</p> {/* Show part of content */}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-lg text-gray-700">No chapters available</p>
                )}
            </div>
        </div>
    );
};

export default Chapters;
