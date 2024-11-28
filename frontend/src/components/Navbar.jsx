import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const Navbar = () => {
  const {handleLogout} = useContext(AuthContext)
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
    <div className="top-0 left-0 w-full z-40 ">
      <div className="flex felx-wrap justify-between items-center text-black py-4 px-6 md:px-32 gap-20 ">
        <a href="/" className="w-30 h-11 flex items-center justify-center text-center">
          <span className="text-xl font-bold text-gray-500 hover:scale-105 transition-all">
            NovelHub
          </span>
        </a>

        <form onSubmit={handleSearch} className="relative md:flex items-center gap-3">
          <div className="relative flex-1">
            <i className="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-gray-500"></i>
            <input
              type="text"
              placeholder="Search novels..."
              className="py-2 pl-10 pr-4 rounded-1xl border-2 border-[#01A8FF] focus:bg-slate-100 focus:outline-[#01A8FF] w-80 transition-all"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowSuggestions(true)}
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && (searchQuery.trim().length >= 2) && (
              <div 
                ref={suggestionsRef}
                className="absolute mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50"
              >
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#01A8FF] mx-auto"></div>
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((novel) => (
                    <div
                      key={novel.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleSuggestionClick(novel)}
                    >
                      <img
                        src={`${NOVEL_COVERS_PATH}/${novel.coverPhoto}`}
                        alt={novel.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">{novel.title}</h3>
                        <p className="text-xs text-gray-500 truncate">{novel.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No suggestions found
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="py-2 px-4 rounded-1xl bg-gradient-to-r from-[#01A8FF] to-[#0165FF] text-white hover:shadow-lg hover:scale-105 transition-all"
          >
            Search
          </button>
        </form>

        <div className="md:flex items-center gap-6 font-semibold text-base">
          <div>
            <button
              className="p-1 hover:bg-sky-400 hover:text-white rounded-1xl transition-all cursor-pointer"
              onClick={() => navigate("/rankings")}
            >
              Rankings
            </button>
          </div>
          <div>
            <button
              className="p-1 hover:bg-sky-400 hover:text-white rounded-1xl transition-all cursor-pointer"
              onClick={() => navigate("/forum")}
            >
              Forum
            </button>
          </div>
          <div>
            <button
              className="p-1 hover:bg-sky-400 hover:text-white rounded-1xl transition-all cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>
          </div>
          <div>
            <button
              className="p-1 hover:bg-sky-400 hover:text-white rounded-1xl transition-all cursor-pointer"
              onClick={() => {
                handleLogout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <hr className="border-gray-300" />
    </div>
  );
};

export default Navbar;
