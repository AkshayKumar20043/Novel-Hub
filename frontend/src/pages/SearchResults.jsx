import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const query = searchParams.get('q');
    const NOVEL_COVERS_PATH = import.meta.env.VITE_API_NOVELCOVERS_URL;

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                const API_URL = import.meta.env.VITE_API_URL;
                const response = await axios.get(`${API_URL}/novels/search?q=${encodeURIComponent(query)}`);
                setResults(response.data);
            } catch (err) {
                setError('Failed to fetch search results');
                console.error('Search error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchResults();
        }
    }, [query]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#01A8FF]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Search Results for &quot;{query}&quot;</h1>
            
            {results.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">No results found for your search.</p>
                    <p className="text-gray-500 mt-2">Try different keywords or check your spelling.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((novel) => (
                        <div key={novel.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <img 
                                src={`${NOVEL_COVERS_PATH}/${novel.coverPhoto}`}
                                alt={novel.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">{novel.title}</h2>
                                {/* <p className="text-gray-600 text-sm mb-2">by {novel.author.name}</p> */}
                                <p className="text-gray-500 text-sm line-clamp-2">{novel.description}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-[#01A8FF]">{novel.genre}</span>
                                    <button 
                                        onClick={() => navigate(`/novels/${novel.id}`)}
                                        className="px-4 py-2 bg-gradient-to-r from-[#01A8FF] to-[#0165FF] text-white rounded-md hover:shadow-md transition-all"
                                    >
                                        Read More
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;
