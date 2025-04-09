import React, { useState, useCallback } from 'react';
import { Brain, Send } from 'lucide-react';
import { useUser } from '../context/UserContext';

// AI Configuration
const AI_API_KEY = 'AIzaSyBy0KCb5kFziYZC5gXkFgB3mXEmMzsatTE';
const AI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface ChatMessage {
  userInput: string;
  aiResponse: string;
}

const Admin: React.FC = () => {
  const { userData, moodData, healthInsights } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setLoading(true);

    try {
      // Add user message to chat
      setMessages(prev => [...prev, { userInput: userMessage, aiResponse: '' }]);

      const prompt = `You are a mental health assistant named MoodMirror. The user is ${userData?.name}, age ${userData?.age}.
      Their recent mood data: ${JSON.stringify(moodData)}
      Their health insights: ${JSON.stringify(healthInsights)}
      
      The user just said: "${userMessage}"
      
      Provide a helpful, empathetic response that considers their mental health data.`;

      const response = await fetch(`${AI_ENDPOINT}?key=${AI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that. Could you try again?";

      // Update the last message with AI response
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].aiResponse = aiResponse;
        return newMessages;
      });
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { userInput: '', aiResponse: "I'm having trouble responding right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  }, [input, userData, moodData, healthInsights]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Brain className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
        MoodMirror AI Assistant
      </h2>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {/* Initial greeting */}
        <div className="flex items-start">
          <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-full">
            <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
          </div>
          <div className="ml-3 bg-indigo-50 dark:bg-indigo-900/50 p-3 rounded-lg">
            <p className="text-sm">
              Hello{userData?.name ? `, ${userData.name}` : ''}! I'm your MoodMirror AI assistant. 
              How are you feeling today?
            </p>
          </div>
        </div>

        {/* Chat messages */}
        {messages.map((message, index) => (
          <React.Fragment key={index}>
            {message.userInput && (
              <div className="flex items-start justify-end">
                <div className="bg-gray-200 dark:bg-gray-600 p-3 rounded-lg max-w-[80%]">
                  <p className="text-sm">{message.userInput}</p>
                </div>
              </div>
            )}
            {message.aiResponse && (
              <div className="flex items-start">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-full">
                  <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div className="ml-3 bg-indigo-50 dark:bg-indigo-900/50 p-3 rounded-lg max-w-[80%]">
                  <p className="text-sm">{message.aiResponse}</p>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}

        {loading && (
          <div className="flex items-start">
            <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-full">
              <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div className="ml-3 bg-indigo-50 dark:bg-indigo-900/50 p-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Admin;