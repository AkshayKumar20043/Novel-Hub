import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import DarkModeContext from "../context/DarkModeContext";
import axios from "axios";
import { FaSearch, FaComments, FaUser, FaSignOutAlt, FaBook, FaSun, FaMoon } from 'react-icons/fa';
import { FaRankingStar } from "react-icons/fa6";
const Navbar = () => {
  const { handleLogout } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const NOVEL_COVERS_PATH = import.meta.env.VITE_API_NOVELCOVERS_URL;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/novels/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setSuggestions(response.data.slice(0, 5)); // Limit to 5 suggestions
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (novel) => {
    setSearchQuery(novel.title);
    setShowSuggestions(false);
    navigate(`/novels/${novel.id}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 ${
      isDarkMode 
        ? 'bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-700' 
        : 'bg-white/80 backdrop-blur-md shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between py-4 px-6 gap-4">
          {/* Logo */}
          <a 
            href="/" 
            className="flex items-center space-x-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-all duration-300"
          >
            <FaBook className="text-2xl" />
            <span className="text-2xl font-bold">NovelHub</span>
          </a>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search novels..."
                  className={`w-full py-2.5 pl-12 pr-4 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500' 
                      : 'border-gray-200 bg-gray-50/50 focus:border-blue-500'
                  } focus:ring-2 focus:ring-blue-200 transition-all duration-300`}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setShowSuggestions(true)}
                />
                <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-400'
                }`} />
              </div>
              
              {/* Suggestions Dropdown */}
              {showSuggestions && (searchQuery.trim().length >= 2) && (
                <div 
                  ref={suggestionsRef}
                  className={`absolute mt-2 w-full rounded-xl shadow-xl border overflow-hidden ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-100'
                  } max-h-96 overflow-y-auto z-50`}
                >
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                    </div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((novel) => (
                      <div
                        key={novel.id}
                        className={`flex items-center gap-4 p-3 cursor-pointer transition-all duration-300 ${
                          isDarkMode 
                            ? 'hover:bg-gray-700' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleSuggestionClick(novel)}
                      >
                        <img
                          src={`${NOVEL_COVERS_PATH}/${novel.coverPhoto}`}
                          alt={novel.title}
                          className="w-12 h-16 object-cover rounded-lg shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm font-semibold truncate ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-800'
                          }`}>{novel.title}</h3>
                          <p className={`text-xs truncate mt-1 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>{novel.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={`p-4 text-center ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      No suggestions found
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/rankings")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500'
              } hover:text-white`}
            >
              <FaRankingStar className="text-lg" />
              <span>Rankings</span>
            </button>

            <button
              onClick={() => navigate("/forum")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500'
              } hover:text-white`}
            >
              <FaComments className="text-lg" />
              <span>Forum</span>
            </button>

            <button
              onClick={() => navigate("/profile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500'
              } hover:text-white`}
            >
              <FaUser className="text-lg" />
              <span>Profile</span>
            </button>

            <button
              onClick={toggleDarkMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'text-yellow-300 hover:bg-yellow-500/20' 
                  : 'text-gray-700 hover:bg-yellow-100'
              }`}
            >
              {isDarkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
            </button>

            <button
              onClick={() => {
                handleLogout();
                navigate("/login");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gradient-to-r hover:from-red-600 hover:to-pink-600' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500'
              } hover:text-white`}
            >
              <FaSignOutAlt className="text-lg" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
