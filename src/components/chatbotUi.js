'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatBot() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Scroll to the bottom of the chat container when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return; // Prevent empty submissions
    const userMessage = { type: 'user', text: prompt };
    setMessages([...messages, userMessage]);
    setPrompt(''); // Clear input
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      const botMessage = { type: 'bot', text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { type: 'bot', text: 'Oops! Something went wrong. Try again later.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  // Handle Enter key to submit (Shift + Enter for new line)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 relative overflow-hidden">
        {/* Cute Robot Avatar */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-black">
          <div className="w-18 h-18 bg-purple-300 rounded-full flex items-center justify-center animate-bounce-slow">
            <span className="text-2xl">🤖</span>
          </div>
        </div>

        {/* Chat Container */}
        <div className="mt-16">
          <h1 className="text-2xl font-bold text-center text-purple-600 mb-4">
            ChatBot 
          </h1>
          {/* Chat Display */}
          <div
            ref={chatContainerRef}
            className="bg-gray-50 rounded-2xl p-4 h-64 overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100"
          >
            {messages.length === 0 ? (
              <p className="text-center text-gray-500">Ask me anything!</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-2xl text-sm ${
                      msg.type === 'user'
                        ? 'bg-purple-500 text-black rounded-br-none'
                        : 'bg-white text-black rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs p-3 rounded-2xl bg-white text-gray-800 rounded-bl-none shadow-sm flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex items-center space-x-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              className="flex-1 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none text-black"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading || !prompt.trim()}
              className={`p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors ${
                isLoading || !prompt.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thumb-purple-300 {
          scrollbar-color: #c084fc #f3f4f6;
        }
        .scrollbar-track-gray-100 {
          background: #f3f4f6;
        }
      `}</style>
    </div>
  );
}