import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const API_URL = import.meta.env.VITE_API_URL;
const API_NOVELCOVERS_URL = import.meta.env.VITE_API_NOVELCOVERS_URL;

const Rankings = () => {
  const [topNovels, setTopNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopNovels = async () => {
      try {
        const response = await axios.get(`${API_URL}/novels`);
        // Sort novels by likes in descending order and take top 10
        const sortedNovels = response.data
          .sort((a, b) => (b.likes || 0) - (a.likes || 0))
          .slice(0, 10);
        setTopNovels(sortedNovels);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch rankings', err);
        setLoading(false);
      }
    };

    fetchTopNovels();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01A8FF]"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="text-center text-red-600 mt-8">{error}</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Top 10 Novels</h1>
        
        <div className="max-w-4xl mx-auto">
          {topNovels.map((novel, index) => (
            <div
              key={novel.id}
              className="bg-white rounded-lg shadow-md mb-6 overflow-hidden hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/novels/${novel.id}`)}
            >
              <div className="flex items-center p-6">
                <div className="flex-shrink-0 relative">
                  {/* Ranking Badge */}
                  <div className="absolute -left-4 -top-4 w-12 h-12 bg-gradient-to-br from-[#01A8FF] to-[#0165FF] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    #{index + 1}
                  </div>
                  <img
                    src={`${API_NOVELCOVERS_URL}/${novel.coverPhoto}`}
                    alt={novel.title}
                    className="w-32 h-44 object-cover rounded-md"
                  />
                </div>
                
                <div className="ml-6 flex-grow">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{novel.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{novel.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="flex items-center">
                      <i className="bx bx-heart text-red-500 mr-1"></i>
                      <span>{novel.likes} Likes</span>
                    </div>
                    <span className="mx-4">•</span>
                    <div className="flex items-center">
                      <i className="bx bx-book-open text-blue-500 mr-1"></i>
                      <span>{novel.chapters?.length || 0} Chapters</span>
                    </div>
                    {novel.genre && (
                      <>
                        <span className="mx-4">•</span>
                        <div className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                          {novel.genre}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Rankings;
