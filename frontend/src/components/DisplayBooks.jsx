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
  const API_URL = import.meta.env.VITE_API_URL;

  // Responsive grid settings
  const getGridSettings = () => {
    if (window.innerWidth >= 1280) return { booksPerRow: 5, gap: 'gap-8' }; // xl
    if (window.innerWidth >= 1024) return { booksPerRow: 4, gap: 'gap-6' }; // lg
    if (window.innerWidth >= 768) return { booksPerRow: 3, gap: 'gap-4' }; // md
    if (window.innerWidth >= 640) return { booksPerRow: 2, gap: 'gap-4' }; // sm
    return { booksPerRow: 1, gap: 'gap-4' }; // xs
  };

  const [gridSettings, setGridSettings] = useState(getGridSettings());

  useEffect(() => {
    const handleResize = () => {
      setGridSettings(getGridSettings());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    const { booksPerRow } = gridSettings;
    const visibleBooks = novels.slice(0, visibleRows * booksPerRow);
    const rows = [];
    
    for (let i = 0; i < visibleBooks.length; i += booksPerRow) {
      rows.push(visibleBooks.slice(i, i + booksPerRow));
    }
    
    return rows;
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
  const hasMoreBooks = novels.length > visibleRows * gridSettings.booksPerRow;

  return (
    <div className="space-y-8 py-8">
      <div className="hidden sm:block">
        <AnimatePresence>
          {rows.map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: rowIndex * 0.1 }}
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${gridSettings.gap} justify-items-center`}
            >
              {row.map((novel) => (
                <motion.div
                  key={novel._id}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-[250px] p-4"
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
        </AnimatePresence>
        
        {hasMoreBooks && (
          <motion.div
            className="flex justify-center mt-8"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <button
              onClick={loadMoreRows}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              Explore More <FaChevronDown />
            </button>
          </motion.div>
        )}
      </div>
      
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
            {novels.slice(0, visibleRows * gridSettings.booksPerRow).map((novel) => (
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
    </div>
  );
};

export default DisplayBooks;
