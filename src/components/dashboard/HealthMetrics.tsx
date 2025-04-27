 
import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';

// Types
interface HealthInsight {
  category: string;
  score: number;
  recommendation: string;
  needsImprovement?: boolean;
}

interface UserData {
  age: number;
  height: number;
  weight: number;
  morningFood: string;
  eveningFood: string;
  sleepTime: number;
  screenTime: number;
}

// Session storage

// API Configuration
const API_KEY = 'AIzaSyBy0KCb5kFziYZC5gXkFgB3mXEmMzsatTE';
const AI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Health Metrics Calculation
const calculateBaseHealthMetrics = (userData: UserData): HealthInsight[] => {
  const heightInMeters = userData.height / 100;
  const bmi = userData.weight / (heightInMeters * heightInMeters);
  
  const sleepQuality = Math.min(100, Math.max(0, 
    (userData.sleepTime / 8) * 80 + 
    (1 - (userData.screenTime / 10)) * 20
  ));

  const nutritionScore = calculateNutritionScore(
    userData.morningFood, 
    userData.eveningFood
  );

  return [
    { category: 'Physical Health', score: calculatePhysicalHealthScore(bmi), recommendation: '' },
    { category: 'Sleep Quality', score: Math.round(sleepQuality), recommendation: '' },
    { category: 'Nutrition', score: nutritionScore, recommendation: '' },
    { category: 'Mental Wellbeing', score: 70, recommendation: '' }
  ];
};

const calculatePhysicalHealthScore = (bmi: number): number => {
  if (bmi < 18.5) return 60;
  if (bmi < 25) return 90;
  if (bmi < 30) return 70;
  return 50;
};

const calculateNutritionScore = (morningFood: string, eveningFood: string): number => {
  const healthyKeywords = ['fruits', 'vegetables', 'whole grains', 'lean protein', 'nuts'];
  const unhealthyKeywords = ['fast food', 'processed', 'sugary', 'fried'];
  
  let score = 70;
  
  const checkFood = (food: string) => {
    if (healthyKeywords.some(k => food.toLowerCase().includes(k))) score += 10;
    if (unhealthyKeywords.some(k => food.toLowerCase().includes(k))) score -= 15;
  };
  
  checkFood(morningFood);
  checkFood(eveningFood);
  
  return Math.max(0, Math.min(100, score));
};

// AI Integration with improved prompt
const getAIHealthInsights = async (metrics: HealthInsight[], userData: UserData): Promise<HealthInsight[]> => {
  try {
    const prompt = `Analyze these health metrics and provide specific recommendations. For scores below 70, 
    provide detailed improvement suggestions. Format each recommendation as:
    
    [Category] (Score: X%): [Recommendation]
    [Improvement Action if score < 70]
    
    User Profile:
    - Age: ${userData.age}
    - Height: ${userData.height}cm
    - Weight: ${userData.weight}kg
    - Diet: ${userData.morningFood} (morning), ${userData.eveningFood} (evening)
    - Sleep: ${userData.sleepTime} hours/night
    - Screen Time: ${userData.screenTime} hours/day
    
    Health Metrics:
    ${metrics.map(m => `- ${m.category}: ${m.score}/100`).join('\n')}`;

    const response = await fetch(`${AI_ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) throw new Error('AI API request failed');
    
    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    return metrics.map(metric => {
      // Extract both recommendation and improvement suggestion
      const match = new RegExp(
        `${metric.category}.*?\\(Score:.*?\\):([\\s\\S]*?)(?=\\n\\w|$)`, 
        'i'
      ).exec(aiResponse);
      
      const fullRecommendation = match?.[1]?.trim() || 
        getFallbackRecommendation(metric.category, metric.score);
      
      return {
        ...metric,
        recommendation: fullRecommendation,
        needsImprovement: metric.score < 70
      };
    });
  } catch (error) {
    console.error('AI Integration Error:', error);
    return metrics.map(metric => ({
      ...metric,
      recommendation: getFallbackRecommendation(metric.category, metric.score),
      needsImprovement: metric.score < 70
    }));
  }
};

const getFallbackRecommendation = (category: string, score: number): string => {
  const baseRecommendations: Record<string, string[]> = {
    'Physical Health': [
      'Consider consulting a healthcare provider for personalized exercise and diet plans.',
      'Try to incorporate more physical activity into your daily routine.',
      'Maintain your current exercise and diet regimen.'
    ],
    'Sleep Quality': [
      'Establish a consistent bedtime routine and limit screen time before sleep.',
      'Aim for 7-9 hours of sleep each night with consistent sleep/wake times.',
      'Your sleep habits are supporting good health.'
    ],
    'Nutrition': [
      'Consult a nutritionist to improve your dietary habits and meal planning.',
      'Increase intake of whole foods like fruits, vegetables and lean proteins.',
      'Your current diet appears balanced and nutritious.'
    ],
    'Mental Wellbeing': [
      'Consider speaking with a mental health professional about your concerns.',
      'Practice daily mindfulness or meditation to reduce stress.',
      'Your mental wellbeing appears strong based on available data.'
    ]
  };
  
  const improvementActions: Record<string, string[]> = {
    'Physical Health': [
      '🚴 Start with 30 minutes of moderate exercise daily',
      '🏋️ Add strength training 2-3 times per week',
      '🧘 Include flexibility exercises in your routine'
    ],
    'Sleep Quality': [
      '🛌 Establish a consistent bedtime routine',
      '📵 Limit screen time 1 hour before bed',
      '🌿 Try relaxation techniques before sleep'
    ],
    'Nutrition': [
      '🍎 Add 2-3 servings of fruits/vegetables daily',
      '🚰 Increase water intake to 2L per day',
      '🍳 Plan balanced meals with protein, carbs and fats'
    ],
    'Mental Wellbeing': [
      '🧠 Practice 10 minutes of daily meditation',
      '📝 Keep a gratitude journal',
      '👥 Schedule regular social connections'
    ]
  };

  const recommendationIndex = score < 50 ? 0 : score < 70 ? 1 : 2;
  const baseText = baseRecommendations[category][recommendationIndex];
  
  if (score < 70) {
    const actionIndex = score < 50 ? 0 : 1;
    const actionText = improvementActions[category][actionIndex];
    return `${baseText}\n\nAction Item: ${actionText}`;
  }
  
  return baseText;
};

// Main Component
const HealthMetricsDashboard: React.FC = () => {
  const { userData } = useUser();
  const [metrics, setMetrics] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCards, setVisibleCards] = useState(0);

  useEffect(() => {
    const fetchHealthData = async () => {
      if (!userData) {
        setError('User data not available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Calculate base metrics
        const baseMetrics = calculateBaseHealthMetrics(userData);
        
        // Enhance with AI insights
        const enhancedMetrics = await getAIHealthInsights(baseMetrics, userData);
        
        setMetrics(enhancedMetrics);
        
        // Animate cards sequentially
        setVisibleCards(0);
        const animationInterval = setInterval(() => {
          setVisibleCards(prev => {
            if (prev >= enhancedMetrics.length * 2) { // Cards + improvements
              clearInterval(animationInterval);
              return prev;
            }
            return prev + 1;
          });
        }, 400); // 400ms between elements

      } catch (err) {
        console.error('Error loading health metrics:', err);
        setError('Failed to load health data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();

    // Set up real-time updates every 45 seconds
    const updateInterval = setInterval(fetchHealthData, 45000);

    return () => {
      clearInterval(updateInterval);
    };
  }, [userData]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
        <p className="text-red-600 dark:text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Your Health Dashboard</h2>

      {/* Health Metrics Cards - Displayed one by one */}
      <div className="space-y-6">
        {metrics.map((metric, index) => (
          <React.Fragment key={metric.category}>
            {/* Main Metric Card */}
            <div 
              className={`bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-all duration-500 ${
                index < visibleCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 300}ms` }}
            >
              <div className="flex items-center">
                {/* Circular Progress with larger percentage */}
                <div className="relative w-20 h-20 mr-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      className="dark:stroke-gray-600"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={getScoreColor(metric.score)}
                      strokeWidth="8"
                      strokeDasharray={`${metric.score * 2.83}, 283`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span 
                      className="text-2xl font-bold" 
                      style={{ color: getScoreColor(metric.score) }}
                    >
                      {metric.score}%
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {metric.category}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {metric.recommendation.split('\n')[0]}
                  </p>
                </div>
              </div>
            </div>

            {/* Improvement Card (if needed) */}
            {metric.needsImprovement && (
              <div 
                className={`ml-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg transition-all duration-500 ${
                  metrics.length + index < visibleCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${(metrics.length + index) * 300}ms` }}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3">
                    <div className={`h-4 w-4 rounded-full ${
                      metric.score < 50 ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">
                      Improve Your {metric.category}
                    </h4>
                    {metric.recommendation.split('\n').slice(1).map((line, i) => (
                      <p key={i} className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default HealthMetricsDashboard;