import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Chatbot from "./components/Chatbot";
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import BookDetails from "./pages/BookDetails";
import ReviewDetails from "./pages/ReviewDetails";
import SearchResults from "./pages/SearchResults";
import AuthContext from "./context/AuthContext";
import Chapters from "./pages/Chapters"; // Import the Chapters component
import ChapterDetail from "./pages/ChapterDetail";
import Dashboard from "./pages/Dashboard";
import Rankings from "./pages/Rankings";
import Forum from "./pages/Forum";

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
          <Route path="/profile" element={<Dashboard />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/forum" element={<Forum />} />
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
