import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';

const MoodForecast: React.FC = () => {
  const [forecastData, setForecastData] = useState<Array<{
    day: string;
    mood: number;
    predicted?: boolean;
  }>>([]);

  // Generate forecast data based on current time and random fluctuations
  const generateForecast = () => {
    const now = new Date();
    const days = ['Today', 'Tomorrow'];
    
    // Generate day labels for the next 5 days
    for (let i = 2; i <= 4; i++) {
      const date = new Date();
      date.setDate(now.getDate() + i);
      days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }

    // Base mood influenced by time of day
    const currentHour = now.getHours();
    let baseMood = 70;
    
    // Adjust base mood based on typical daily patterns
    if (currentHour >= 22 || currentHour <= 5) {
      baseMood -= 10; // Late night/early morning dip
    } else if (currentHour >= 6 && currentHour <= 9) {
      baseMood += 5; // Morning boost
    } else if (currentHour >= 12 && currentHour <= 14) {
      baseMood -= 3; // Post-lunch dip
    } else if (currentHour >= 16 && currentHour <= 18) {
      baseMood += 8; // Afternoon peak
    }

    // Add some randomness (more for future predictions)
    const data = days.map((day, index) => {
      let mood = baseMood;
      
      // More variation for future days
      if (index > 0) {
        const randomFactor = Math.random() * 20 - 10; // -10 to +10
        mood += randomFactor;
        
        // Weekend effect
        const dayOfWeek = new Date();
        dayOfWeek.setDate(now.getDate() + index);
        if ([0, 6].includes(dayOfWeek.getDay())) { // Saturday or Sunday
          mood += 5;
        }
      }
      
      // Ensure mood stays within bounds
      mood = Math.max(30, Math.min(95, Math.round(mood)));
      
      return {
        day,
        mood,
        predicted: index > 0
      };
    });

    setForecastData(data);
  };

  // Generate initial forecast and update every hour
  useEffect(() => {
    generateForecast();
    const interval = setInterval(generateForecast, 3600000); // Update hourly
    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = () => {
    if (forecastData.length < 2) return null;
    const currentMood = forecastData[0].mood;
    const tomorrowMood = forecastData[1].mood;
    
    if (tomorrowMood > currentMood) {
      return <ArrowUp className="h-5 w-5 text-green-500" />;
    } else if (tomorrowMood < currentMood) {
      return <ArrowDown className="h-5 w-5 text-red-500" />;
    } else {
      return null;
    }
  };

  const getTrendText = () => {
    if (forecastData.length < 2) return "Analyzing your mood patterns...";
    const currentMood = forecastData[0].mood;
    const tomorrowMood = forecastData[1].mood;
    const diff = Math.abs(tomorrowMood - currentMood);
    
    if (tomorrowMood > currentMood) {
      return `Your mood is predicted to improve by ${diff}% tomorrow`;
    } else if (tomorrowMood < currentMood) {
      return `Your mood may decrease by ${diff}% tomorrow`;
    } else {
      return "Your mood is predicted to remain stable";
    }
  };

  const getRecommendation = () => {
    if (forecastData.length < 2) return null;
    const currentMood = forecastData[0].mood;
    const tomorrowMood = forecastData[1].mood;
    
    if (tomorrowMood < currentMood && tomorrowMood < 70) {
      return (
        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-lg flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Mood Alert</p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              We've detected a potential mood decline. Consider scheduling some relaxation time tomorrow.
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Generate personalized suggestions based on mood forecast
  const getSuggestions = () => {
    if (forecastData.length < 2) return null;
    
    const tomorrowMood = forecastData[1].mood;
    let activity = "10-minute meditation";
    let booster = "Morning walk in nature";
    
    if (tomorrowMood < 60) {
      activity = "Guided relaxation";
      booster = "Call a friend";
    } else if (tomorrowMood > 80) {
      activity = "Creative activity";
      booster = "Try something new";
    }

    return (
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg">
          <p className="text-xs font-medium text-indigo-800 dark:text-indigo-300">Suggested Activity</p>
          <p className="text-xs text-gray-600 dark:text-gray-300">{activity}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-lg">
          <p className="text-xs font-medium text-green-800 dark:text-green-300">Mood Booster</p>
          <p className="text-xs text-gray-600 dark:text-gray-300">{booster}</p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium">AI Mood Prediction</h3>
          <div className="flex items-center mt-1">
            {getTrendIcon()}
            <p className="text-sm text-gray-600 dark:text-gray-300 ml-1">{getTrendText()}</p>
          </div>
        </div>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={forecastData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              formatter={(value) => [`${value}%`, "Mood level"]}
              labelFormatter={(label) => forecastData.find(d => d.day === label)?.predicted 
                ? `${label} (predicted)` 
                : label}
            />
            <Line 
              type="monotone" 
              dataKey="mood" 
              stroke="#6366f1" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {getRecommendation()}
      {getSuggestions()}
    </div>
  );
};

export default MoodForecast;