import { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Chatbot = () => {
    const { loggedUser, isAuthenticated } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: "👋 Welcome to Novel Nexus! I'm your personal assistant, NovBot. How can I help you?"
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Quick suggestion topics
    const suggestions = [
        { text: "📚 Browse Novels", query: "show me novels" },
        { text: "📖 Find Chapters", query: "help with chapters" },
        { text: "⭐ Write Review", query: "how to write review" },
        { text: "🎯 Get Recommendations", query: "recommend novels" },
        { text: "💬 Customer Support", query: "customer support" }
    ];

    const handleSuggestionClick = (query) => {
        setInputMessage(query);
        handleSubmit({ preventDefault: () => {} });
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = inputMessage.trim();
        setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const response = await axios.post(`${API_URL}/chatbot/query`, {
                message: userMessage
            });

            setMessages(prev => [...prev, { type: 'bot', text: response.data.response }]);
        } catch (error) {
            console.error('Chatbot error:', error);
            setMessages(prev => [...prev, { 
                type: 'bot', 
                text: 'Sorry, I encountered an error. Please try again.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Only render the chatbot if user is authenticated
    if (!isAuthenticated()) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Floating action button with ripple effect */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative bg-gradient-to-br from-[#01A8FF] via-[#0189FF] to-[#0165FF] text-white rounded-full p-1 shadow-lg w-12 h-12 flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-3 hover:shadow-2xl"
            >
                <span className="absolute w-full h-full rounded-full animate-ping bg-[#01A8FF] opacity-20"></span>
                <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#01A8FF] via-[#0189FF] to-[#0165FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                {isOpen ? (
                    <svg
                        className="w-8 h-8 transition-transform duration-500 ease-in-out transform hover:rotate-180 relative z-10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    <svg
                        className="w-8 h-8 transition-transform duration-300 ease-in-out transform hover:scale-110 relative z-10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                )}
            </button>

            {/* Chat window with glass morphism effect */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-96 backdrop-blur-lg bg-white/90 rounded-3xl shadow-2xl border border-white/20 transition-all duration-300 ease-in-out transform animate-slideIn overflow-hidden">
                    {/* Chat header with animated gradient */}
                    <div className="bg-gradient-to-r from-[#01A8FF] via-[#0189FF] to-[#0165FF] text-white p-5 rounded-t-3xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#01A8FF] via-[#0189FF] to-[#0165FF] opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="flex items-center space-x-3 relative z-10">
                            <div className="flex space-x-1">
                                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                            <h3 className="font-bold text-xl tracking-wide">NovBot</h3>
                        </div>
                    </div>

                    {/* Messages area with improved styling */}
                    <div className="h-[400px] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white/50 backdrop-blur-sm scrollbar-hide">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl p-4 ${
                                        message.type === 'user'
                                            ? 'bg-gradient-to-br from-[#01A8FF] via-[#0189FF] to-[#0165FF] text-white shadow-lg hover:shadow-[#01A8FF]/25'
                                            : 'bg-white/80 backdrop-blur-sm text-gray-800 shadow-lg hover:shadow-[#01A8FF]/25 border border-white/50'
                                    } transition-all duration-300 hover:-translate-y-1 whitespace-pre-line`}

                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}

                        {/* Quick Suggestions */}
                        {messages.length === 1 && (
                            <div className="flex flex-wrap gap-2 animate-fadeIn">
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion.query)}
                                        className="bg-white/50 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/80"
                                    >
                                        {suggestion.text}
                                    </button>
                                ))}
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex justify-start animate-fadeIn">
                                <div className="bg-white/80 backdrop-blur-sm text-gray-800 rounded-2xl p-4 shadow-lg border border-white/50">
                                    <div className="flex space-x-2">
                                        {[0, 1, 2].map((i) => (
                                            <div
                                                key={i}
                                                className="w-2 h-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full animate-bounce"
                                                style={{ animationDelay: `${i * 0.2}s` }}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input area with modern styling */}
                    <form onSubmit={handleSubmit} className="p-6 bg-white/80 backdrop-blur-sm border-t border-white/20">
                        <div className="flex space-x-3">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#01A8FF] focus:border-transparent transition-all duration-300 placeholder-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group bg-gradient-to-br from-[#01A8FF] via-[#0189FF] to-[#0165FF] p-3 rounded-2xl hover:shadow-lg disabled:opacity-50 transition-all duration-300 transform hover:scale-105 hover:rotate-3 relative overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-br from-[#01A8FF] via-[#0189FF] to-[#0165FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <svg 
                                    className="w-6 h-6 transform rotate-90 relative z-10 text-white" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
