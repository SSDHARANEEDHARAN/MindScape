 
import { UserData, HealthInsight } from '../types/types';

const API_KEY = 'AIzaSyBy0KCb5kFziYZC5gXkFgB3mXEmMzsatTE';
const AI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Session storage for consistent metrics during a session
let sessionHealthMetrics: HealthInsight[] | null = null;

export const getHealthMetrics = async (userData: UserData): Promise<HealthInsight[]> => {
  // Return cached metrics if available
  if (sessionHealthMetrics) {
    return sessionHealthMetrics;
  }

  // Calculate base metrics
  const baseMetrics = calculateBaseHealthMetrics(userData);

  // Enhance with AI insights
  const aiEnhancedMetrics = await getAIHealthInsights(baseMetrics, userData);

  // Cache the results for the session
  sessionHealthMetrics = aiEnhancedMetrics;

  return aiEnhancedMetrics;
};

const calculateBaseHealthMetrics = (userData: UserData): HealthInsight[] => {
  // Calculate BMI
  const heightInMeters = userData.height / 100;
  const bmi = userData.weight / (heightInMeters * heightInMeters);
  
  // Calculate sleep quality score (0-100)
  const sleepQuality = Math.min(100, Math.max(0, 
    (userData.sleepTime / 8) * 80 + // 80% weight on sleep duration
    (1 - (userData.screenTime / 10)) * 20 // 20% weight on screen time reduction
  ));

  // Calculate nutrition score
  const nutritionScore = calculateNutritionScore(userData.morningFood, userData.eveningFood);

  return [
    {
      category: 'Physical Health',
      score: calculatePhysicalHealthScore(bmi),
      recommendation: ''
    },
    {
      category: 'Sleep Quality',
      score: Math.round(sleepQuality),
      recommendation: ''
    },
    {
      category: 'Nutrition',
      score: nutritionScore,
      recommendation: ''
    },
    {
      category: 'Mental Wellbeing',
      score: 70, // Placeholder, will be updated by AI
      recommendation: ''
    }
  ];
};

const calculatePhysicalHealthScore = (bmi: number): number => {
  if (bmi < 18.5) return 60; // Underweight
  if (bmi >= 18.5 && bmi < 25) return 90; // Healthy
  if (bmi >= 25 && bmi < 30) return 70; // Overweight
  return 50; // Obese
};

const calculateNutritionScore = (morningFood: string, eveningFood: string): number => {
  const healthyKeywords = ['fruits', 'vegetables', 'whole grains', 'lean protein', 'nuts'];
  const unhealthyKeywords = ['fast food', 'processed', 'sugary', 'fried'];
  
  let score = 70; // Base score
  
  // Check morning food
  if (healthyKeywords.some(keyword => morningFood.toLowerCase().includes(keyword))) {
    score += 10;
  }
  if (unhealthyKeywords.some(keyword => morningFood.toLowerCase().includes(keyword))) {
    score -= 15;
  }
  
  // Check evening food
  if (healthyKeywords.some(keyword => eveningFood.toLowerCase().includes(keyword))) {
    score += 10;
  }
  if (unhealthyKeywords.some(keyword => eveningFood.toLowerCase().includes(keyword))) {
    score -= 15;
  }
  
  return Math.max(0, Math.min(100, score));
};

const getAIHealthInsights = async (metrics: HealthInsight[], userData: UserData): Promise<HealthInsight[]> => {
  try {
    const prompt = `Given the following user health metrics and data, provide personalized recommendations for each category. 
    Be concise but helpful. Format as bullet points starting with -.
    
    User Data:
    - Age: ${userData.age}
    - Height: ${userData.height}cm
    - Weight: ${userData.weight}kg
    - Morning food: ${userData.morningFood}
    - Evening food: ${userData.eveningFood}
    - Sleep time: ${userData.sleepTime} hours
    - Screen time: ${userData.screenTime} hours
    
    Current Health Metrics:
    ${metrics.map(m => `- ${m.category}: ${m.score}/100`).join('\n')}
    
    Provide recommendations for each category:`;

    const response = await fetch(`${AI_ENDPOINT}?key=${API_KEY}`, {
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
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse AI response and update recommendations
    return metrics.map(metric => {
      const categoryPattern = new RegExp(`${metric.category}.*?:?\\s*([^-]+)(?=-|$)`, 'i');
      const match = aiResponse.match(categoryPattern);
      
      return {
        ...metric,
        recommendation: match ? match[1].trim() : 'No specific recommendation available'
      };
    });

  } catch (error) {
    console.error('AI API Error:', error);
    // Fallback recommendations
    return metrics.map(metric => ({
      ...metric,
      recommendation: getFallbackRecommendation(metric.category, metric.score)
    }));
  }
};

const getFallbackRecommendation = (category: string, score: number): string => {
  switch(category) {
    case 'Physical Health':
      return score > 80 
        ? 'Maintain your current healthy habits' 
        : score > 60 
          ? 'Consider increasing physical activity' 
          : 'Consult with a healthcare provider for personalized advice';
    case 'Sleep Quality':
      return score > 80 
        ? 'Your sleep habits are excellent' 
        : score > 60 
          ? 'Try to maintain consistent sleep schedule' 
          : 'Consider reducing screen time before bed and creating a bedtime routine';
    case 'Nutrition':
      return score > 80 
        ? 'Your diet is well-balanced' 
        : score > 60 
          ? 'Try incorporating more whole foods into your diet' 
          : 'Consider consulting a nutritionist for dietary advice';
    case 'Mental Wellbeing':
      return score > 80 
        ? 'Your mental wellbeing is strong' 
        : score > 60 
          ? 'Practice mindfulness techniques regularly' 
          : 'Consider speaking with a mental health professional';
    default:
      return 'Focus on balanced diet and regular exercise';
  }
};

// Clear cache on logout
export const clearHealthMetricsCache = () => {
  sessionHealthMetrics = null;
};