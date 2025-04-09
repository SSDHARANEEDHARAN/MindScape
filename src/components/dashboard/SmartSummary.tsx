import React, { useState } from 'react';
import { ArrowUp, Clock, AlertCircle, RefreshCw } from 'lucide-react';

const SmartSummary: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Smart Summary</h2>
        <button 
          onClick={handleRefresh}
          className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start transform transition-transform duration-300 hover:scale-105">
          <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full mr-3">
            <ArrowUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="font-medium">Happiness Level</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Improving by 15% compared to last week
            </p>
          </div>
        </div>
        
        <div className="flex items-start transform transition-transform duration-300 hover:scale-105">
          <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-full mr-3">
            <ArrowUp className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="font-medium">Screen Time</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Increased by 30 mins/day, consider taking breaks
            </p>
          </div>
        </div>
        
        <div className="flex items-start transform transition-transform duration-300 hover:scale-105">
          <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full mr-3">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium">Sleep Quality</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Improved sleep consistency, maintain your schedule
            </p>
          </div>
        </div>
        
        <div className="flex items-start transform transition-transform duration-300 hover:scale-105">
          <div className="bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded-full mr-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="font-medium">Social Media Impact</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Recent social media use shows signs of increased stress
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
        <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">AI Recommendation</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Based on your data, try reducing screen time by 20% and add a 15-minute morning walk to your routine.
        </p>
      </div>
    </div>
  );
};

export default SmartSummary;