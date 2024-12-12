import { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import DisplayBooks from "../components/DisplayBooks";
import Interests from "../components/Interests";
import DarkModeContext from "../context/DarkModeContext";
import LoadingScreen from "../utils/LoadingScreen";
import Chatbot from "../components/Chatbot";
import Footer from "../utils/Footer";

function HomePage() {
  const { isDarkMode } = useContext(DarkModeContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${isDarkMode ? "bg-black/100" : "bg-white"}`}>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Navbar />
          <Interests />
          <h1 className="flex justify-center py-5 text-6xl font-extrabold text-center md:text-left" style={{ color: isDarkMode ? "white" : "black" }}>
            Trending Novels
          </h1>
          <div className="">
            <DisplayBooks />
          </div>
          <Footer/>
          <Chatbot />
        </>
      )}
    </div>
  );
}

export default HomePage;
