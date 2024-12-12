import { useEffect, useState } from "react";
import axios from "axios";
import Book from "../utils/Book";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const DisplayBooks = () => {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleRows, setVisibleRows] = useState(2);
  const booksPerRow = 5;
  const [scrollPosition, setScrollPosition] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const response = await axios.get(`${API_URL}/novels`);
        setNovels(response.data);
      } catch (err) {
        setError("Failed to fetch novels");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNovels();
  }, []);

  const loadMoreRows = () => {
    setVisibleRows(prev => prev + 2);
  };

  const getVisibleBooks = () => {
    const visibleBooks = novels.slice(0, visibleRows * booksPerRow);
    const rows = [];
    
    for (let i = 0; i < visibleBooks.length; i += booksPerRow) {
      rows.push(visibleBooks.slice(i, i + booksPerRow));
    }
    
    return rows;
  };

  const scroll = (direction) => {
    const container = document.querySelector('.scroll-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-red-500 text-center py-8">
      <p>{error}</p>
    </div>
  );

  const rows = getVisibleBooks();
  const hasMoreBooks = novels.length > visibleRows * booksPerRow;

  return (
    <div className="space-y-8 py-8">
      <AnimatePresence>
        {/* Desktop View */}
        <div className="hidden md:block">
          {rows.map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: rowIndex * 0.1 }}
              className="flex justify-center gap-20"
            >
              {row.map((novel) => (
                <motion.div
                  key={novel._id}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="mt-10"
                >
                  <Book
                    _id={novel._id}
                    title={novel.title}
                    description={novel.description}
                    coverPhoto={novel.coverPhoto}
                  />
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Mobile View with Horizontal Scroll */}
        <div className="md:hidden relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <button 
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors"
            >
              <FaChevronLeft className="text-gray-800" />
            </button>
          </div>
          
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
            <button 
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors"
            >
              <FaChevronRight className="text-gray-800" />
            </button>
          </div>

          <div className="scroll-container overflow-x-auto flex gap-6 px-4 py-2 hide-scrollbar">
            {novels.slice(0, visibleRows * booksPerRow).map((novel) => (
              <motion.div
                key={novel._id}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 w-[200px]"
              >
                <Book
                  _id={novel._id}
                  title={novel.title}
                  description={novel.description}
                  coverPhoto={novel.coverPhoto}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatePresence>

      {hasMoreBooks && (
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={loadMoreRows}
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-black to-blue-900 text-white rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <span>Explore More</span>
            <FaChevronDown className="group-hover:translate-y-1 transition-transform duration-300" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default DisplayBooks;
