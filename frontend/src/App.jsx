import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignUpPage';
import HomePage from './components/HomePage';
import BookDetails from "./components/BookDetails";
import ReviewDetails from "./components/ReviewDetails";
import SearchResults from "./pages/SearchResults";
import AuthContext from "./context/AuthContext";
import Chatbot from "./components/Chatbot";
import Chapters from "./components/Chapters"; // Import the Chapters component
import ChapterDetail from "./components/ChapterDetail";

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <Router>
      {isAuthenticated() ? (
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/novels/:id" element={<BookDetails />} />
          <Route path="/novels/:novelId/reviews/:reviewId" element={<ReviewDetails />} />
          <Route path="/novels/:id/chapters" element={<Chapters />} />
          <Route path="/novels/:novelId/chapters/:chapterId" element={<ChapterDetail />} /> 
          <Route path="/search" element={<SearchResults />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

      )}
    <Chatbot />
    </Router>
  );
};

export default App;
