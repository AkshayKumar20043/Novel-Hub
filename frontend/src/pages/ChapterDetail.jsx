import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_URL = import.meta.env.VITE_API_URL;

const ChapterDetail = () => {
  const { novelId, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState(null);

  useEffect(() => {
    const fetchChapterAndChaptersList = async () => {
      try {
        const chaptersResponse = await axios.get(`${API_URL}/novels/${novelId}/chapters`);
        setChapters(chaptersResponse.data);

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
    // Cleanup speech synthesis when component unmounts
    return () => {
      if (speechUtterance) {
        window.speechSynthesis.cancel();
      }
    };
  }, [novelId, chapterId]);

  const handleTextToSpeech = () => {
    if (!chapter) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeechUtterance(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chapter.chapterContent);
    
    // Set speech properties
    utterance.rate = 1.0; // Speed
    utterance.pitch = 1.0; // Pitch
    utterance.volume = 1.0; // Volume
    
    // Get available voices and set English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => voice.lang.startsWith('en-'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    // Handle speech end
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeechUtterance(null);
    };

    // Handle speech error
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeechUtterance(null);
      console.error('Speech synthesis error occurred');
    };

    // Start speaking
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setSpeechUtterance(utterance);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen">{error}</div>;

  const currentChapterIndex = chapters.findIndex(ch => ch.id === chapterId);
  const nextChapter = chapters[currentChapterIndex + 1];
  const prevChapter = chapters[currentChapterIndex - 1];

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gray-800">
            {chapter.chapterName}
          </h1>
          <button
            onClick={handleTextToSpeech}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isSpeaking
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <i className={`bx ${isSpeaking ? 'bx-stop' : 'bx-play'}`}></i>
            {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
          </button>
        </div>
        
        <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
          {chapter.chapterContent}
        </p>

        <div className="flex justify-between items-center mt-8">
          {prevChapter ? (
            <Link
              to={`/novels/${novelId}/chapters/${prevChapter.id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200"
            >
              ← Previous Chapter
            </Link>
          ) : (
            <span className="text-gray-400">No Previous Chapter</span>
          )}
          
          {nextChapter ? (
            <Link
              to={`/novels/${novelId}/chapters/${nextChapter.id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200"
            >
              Next Chapter →
            </Link>
          ) : (
            <span className="text-gray-400">No Next Chapter</span>
          )}
        </div>

      </div>

      <div className="max-w-3xl mx-auto mt-6 text-center">
        <Link
          to={`/novels/${novelId}`}
          className="text-blue-500 hover:underline"
        >
          Back to Novel Overview
        </Link>
      </div>
    </div>
  );
};

export default ChapterDetail;
