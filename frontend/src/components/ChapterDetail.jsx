import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const ChapterDetail = () => {
    const { novelId, chapterId } = useParams();  // Get novelId and chapterId from URL
    const [chapter, setChapter] = useState(null);
    const [chapters, setChapters] = useState([]);  // To store all chapters for navigation
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchChapterAndChaptersList = async () => {
            try {
                // Fetch all chapters to get the next chapter
                const chaptersResponse = await axios.get(`${API_URL}/novels/${novelId}/chapters`);
                setChapters(chaptersResponse.data);

                // Fetch the current chapter
                const chapterResponse = await axios.get(`${API_URL}/novels/${novelId}/chapters/${chapterId}`);
                setChapter(chapterResponse.data);
            } catch (err) {
                setError('Failed to fetch chapter');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchChapterAndChaptersList();
    }, [novelId, chapterId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    // Find the next chapter by index
    const currentChapterIndex = chapters.findIndex(ch => ch.id === chapterId);
    const nextChapter = chapters[currentChapterIndex + 1];

    return (
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
                <h2 className="text-3xl font-bold mb-4">{chapter.chapterName}</h2>
                <p className="text-gray-700">{chapter.chapterContent}</p>
                
                {/* If there's a next chapter, display the "Next Chapter" link */}
                {nextChapter && (
                    <div className="mt-4">
                        <Link
                            to={`/novels/${novelId}/chapters/${nextChapter.id}`}
                            className="text-blue-500 hover:underline"
                        >
                            Go to Next Chapter: {nextChapter.chapterName}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChapterDetail;
