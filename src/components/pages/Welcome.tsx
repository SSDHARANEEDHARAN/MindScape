import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, BarChart2, Activity, MessageSquare } from 'lucide-react';

const Welcome: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="pt-16 pb-24 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-100 rounded-full mb-6">
            <Brain className="h-12 w-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            MindScape
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered mental health analysis that integrates social media sentiment and wearable device data to provide interactive health insights.
          </p>
          <div className="mt-10">
            <Link
              to="/onboarding"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Get Started
            </Link>
          </div>
        </header>

        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Data Collection</h3>
              <p className="text-gray-600">
                Connect your wearable devices and social media accounts to gather comprehensive health data.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI analyzes your data to identify patterns and provide personalized insights.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
                <BarChart2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visualization</h3>
              <p className="text-gray-600">
                View your mental health data through interactive charts and customizable dashboards.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-1 p-8">
                <h2 className="text-2xl font-bold mb-4">AI-Powered Chatbot</h2>
                <p className="text-gray-600 mb-6">
                  Get instant mental health tips and support from our AI assistant. It provides personalized recommendations based on your mood and health data.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex items-start mb-4">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <MessageSquare className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-3 bg-indigo-50 p-3 rounded-lg">
                      <p className="text-sm">How are you feeling today?</p>
                    </div>
                  </div>
                  <div className="flex items-start justify-end">
                    <div className="bg-gray-200 p-3 rounded-lg">
                      <p className="text-sm">I'm feeling a bit stressed about work.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:flex-1 bg-indigo-600 p-8 text-white">
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="bg-indigo-500 p-1 rounded-full mr-2">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    Social media sentiment analysis
                  </li>
                  <li className="flex items-center">
                    <div className="bg-indigo-500 p-1 rounded-full mr-2">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    Wearable device integration
                  </li>
                  <li className="flex items-center">
                    <div className="bg-indigo-500 p-1 rounded-full mr-2">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    Personalized health recommendations
                  </li>
                  <li className="flex items-center">
                    <div className="bg-indigo-500 p-1 rounded-full mr-2">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    Interactive data visualization
                  </li>
                  <li className="flex items-center">
                    <div className="bg-indigo-500 p-1 rounded-full mr-2">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    Secure cloud storage
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to improve your mental well-being?</h2>
          <Link
            to="/onboarding"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Start Your Journey
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Welcome;