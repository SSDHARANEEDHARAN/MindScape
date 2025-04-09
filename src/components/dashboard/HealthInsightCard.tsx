import React, { useState } from 'react';
import { HealthInsight } from '../types/types';
import { Heart, Coffee, Moon, Smartphone, Activity, ChevronDown, ChevronUp } from 'lucide-react';

interface HealthInsightCardProps {
  insight: HealthInsight;
}

const HealthInsightCard: React.FC<HealthInsightCardProps> = ({ insight }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getIcon = () => {
    switch (insight.category.toLowerCase()) {
      case 'diet':
        return <Coffee className="h-5 w-5 text-orange-500" />;
      case 'sleep':
        return <Moon className="h-5 w-5 text-blue-500" />;
      case 'screen time':
        return <Smartphone className="h-5 w-5 text-purple-500" />;
      case 'physical activity':
        return <Activity className="h-5 w-5 text-green-500" />;
      default:
        return <Heart className="h-5 w-5 text-red-500" />;
    }
  };

  const getScoreColor = () => {
    if (insight.score >= 80) return 'text-green-500 dark:text-green-400';
    if (insight.score >= 60) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };

  const getProgressColor = () => {
    if (insight.score >= 80) return 'bg-green-500';
    if (insight.score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div 
      className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center mb-2">
        {getIcon()}
        <h3 className="ml-2 font-semibold">{insight.category}</h3>
        <span className={`ml-auto font-bold ${getScoreColor()}`}>
          {insight.score}%
        </span>
        {expanded ? 
          <ChevronUp className="ml-2 h-4 w-4 text-gray-500" /> : 
          <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
        }
      </div>
      
      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
        <div 
          className={`h-1.5 rounded-full ${getProgressColor()} transition-all duration-1000 ease-in-out`} 
          style={{ width: `${insight.score}%` }}
        ></div>
      </div>
      
      <div className={`mt-3 overflow-hidden transition-all duration-300 ${expanded ? 'max-h-40' : 'max-h-0'}`}>
        <p className="text-sm text-gray-600 dark:text-gray-300">{insight.recommendation}</p>
        
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="bg-gray-50 dark:bg-gray-600 p-2 rounded text-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Last Week</span>
            <p className="font-medium">{Math.max(0, insight.score - Math.floor(Math.random() * 15))}%</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-600 p-2 rounded text-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Target</span>
            <p className="font-medium">{Math.min(100, insight.score + Math.floor(Math.random() * 15))}%</p>
          </div>
        </div>
      </div>
      
      {!expanded && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-1">{insight.recommendation}</p>
      )}
    </div>
  );
};

export default HealthInsightCard;