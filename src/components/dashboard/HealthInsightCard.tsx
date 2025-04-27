/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Heart, Smile, Frown, Meh, Clock, BarChart2, Zap, Sunrise } from 'lucide-react';

interface InstagramAnalysis {
  emotionalTone: {
    positive: number;
    neutral: number;
    negative: number;
  };
  stressIndicators: {
    overall: number;
    anxietyKeywords: number;
    sleepMentions: number;
  };
  usagePatterns: {
    dailyAverage: string;
    weeklyTotal: string;
    peakHours: string[];
    comparisonToAvg: number;
  };
  contentEngagement: {
    positiveContent: number;
    engagementRate: number;
    platformDistribution: {
      instagram: number;
      otherPlatforms: number;
    };
  };
  imageAnalysis: {
    brightness: number;
    colorVibrancy: number;
    facesDetected: number;
  };
}

const MentalHealthAssessment: React.FC = () => {
  const [analysis, setAnalysis] = useState<InstagramAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateRealisticAnalysis = (): InstagramAnalysis => {
    const positive = Math.floor(Math.random() * 30) + 50;
    const neutral = Math.floor(Math.random() * 30) + 10;
    const negative = 100 - positive - neutral;

    const stressLevel = Math.floor(Math.random() * 40) + 30;
    const anxietyKeywords = Math.floor(Math.random() * 5);
    const sleepMentions = Math.floor(Math.random() * 3);

    const dailyHours = (Math.random() * 3 + 1).toFixed(1);
    const weeklyHours = (parseFloat(dailyHours) * 7).toFixed(1);

    const engagementRate = Math.floor(Math.random() * 5) + 1;

    return {
      emotionalTone: {
        positive,
        neutral,
        negative
      },
      stressIndicators: {
        overall: stressLevel,
        anxietyKeywords,
        sleepMentions
      },
      usagePatterns: {
        dailyAverage: `${dailyHours} hours`,
        weeklyTotal: `${weeklyHours} hours`,
        peakHours: getRandomPeakHours(),
        comparisonToAvg: Math.floor(Math.random() * 40) + 70
      },
      contentEngagement: {
        positiveContent: Math.floor(Math.random() * 40) + 50,
        engagementRate,
        platformDistribution: {
          instagram: 85,
          otherPlatforms: 15
        }
      },
      imageAnalysis: {
        brightness: Math.floor(Math.random() * 40) + 50,
        colorVibrancy: Math.floor(Math.random() * 50) + 30,
        facesDetected: Math.floor(Math.random() * 5)
      }
    };
  };

  const getRandomPeakHours = (): string[] => {
    const hours = [];
    if (Math.random() > 0.3) hours.push('7-9 PM');
    if (Math.random() > 0.5) hours.push('11 PM-1 AM');
    if (hours.length === 0) hours.push('2-4 PM');
    return hours;
  };

  useEffect(() => {
    const analyzeInstagramData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockAnalysis = generateRealisticAnalysis();
        setAnalysis(mockAnalysis);
      } catch (err) {
        setError("Failed to analyze Instagram data");
      } finally {
        setLoading(false);
      }
    };

    analyzeInstagramData();
  }, []);

  const getToneColor = (value: number) => {
    if (value > 65) return 'text-green-500';
    if (value > 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStressLevel = (value: number) => {
    if (value < 40) return 'Low';
    if (value < 70) return 'Moderate';
    return 'High';
  };

  const getStressColor = (value: number) => {
    if (value < 40) return 'text-green-500';
    if (value < 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getComparisonColor = (value: number) => {
    if (value > 100) return 'text-red-500';
    if (value > 85) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getImageAnalysisColor = (value: number) => {
    if (value > 70) return 'text-green-500';
    if (value > 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">Analyzing your Instagram data...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!analysis) {
    return null;
  }

  const wellnessScore = Math.floor(
    analysis.emotionalTone.positive * 0.7 + 
    (100 - analysis.stressIndicators.overall) * 0.3
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-2 text-center text-blue-600 dark:text-blue-400">
        Instagram Mental Health Assessment
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
        Powered by Deep Learning, NLP, and Behavioral Analysis
      </p>

      {/* Overall Score */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 p-4 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold">Your Mental Wellness Score</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Based on your Instagram activity patterns
            </p>
          </div>
          <div className="relative w-24 h-24">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={`hsl(${Math.floor(wellnessScore * 1.2)}, 75%, 50%)`}
                strokeWidth="3"
                strokeDasharray={`${wellnessScore}, 100`}
              />
              <text x="18" y="20.5" textAnchor="middle" fill="#4f46e5" className="text-lg font-bold">
                {wellnessScore}%
              </text>
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Emotional Tone Analysis */}
        <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <Heart className="mr-2 text-red-500" />
            Emotional Tone Analysis
          </h2>
          <div className="space-y-3 mb-3">
            <div className="flex justify-between">
              <span className="flex items-center">
                <Smile className="mr-2 text-green-500" />
                Positive
              </span>
              <span className={getToneColor(analysis.emotionalTone.positive)}>
                {analysis.emotionalTone.positive}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${analysis.emotionalTone.positive}%` }}
              ></div>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center">
                <Meh className="mr-2 text-yellow-500" />
                Neutral
              </span>
              <span>{analysis.emotionalTone.neutral}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full" 
                style={{ width: `${analysis.emotionalTone.neutral}%` }}
              ></div>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center">
                <Frown className="mr-2 text-red-500" />
                Negative
              </span>
              <span className={getToneColor(100 - analysis.emotionalTone.negative)}>
                {analysis.emotionalTone.negative}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${analysis.emotionalTone.negative}%` }}
              ></div>
            </div>
          </div>
          {analysis.emotionalTone.negative > 25 && (
            <p className="mt-3 text-sm text-red-500">
              Your content contains significant negative expressions (above 25%) that may warrant attention.
            </p>
          )}
        </div>

        {/* Stress Indicators */}
        <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <Zap className="mr-2 text-purple-500" />
            Stress Indicators
          </h2>
          <div className="space-y-3 mb-3">
            <div className="flex justify-between">
              <span>Overall Stress Level</span>
              <span className={getStressColor(analysis.stressIndicators.overall)}>
                {getStressLevel(analysis.stressIndicators.overall)} ({analysis.stressIndicators.overall}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full" 
                style={{ width: `${analysis.stressIndicators.overall}%` }}
              ></div>
            </div>

            <div className="flex justify-between">
              <span>Anxiety Keywords</span>
              <span>{analysis.stressIndicators.anxietyKeywords} detected</span>
            </div>
            <div className="flex justify-between">
              <span>Sleep Mentions</span>
              <span>{analysis.stressIndicators.sleepMentions} references</span>
            </div>
          </div>
          {analysis.stressIndicators.overall > 60 && (
            <p className="mt-3 text-sm text-red-500">
              Elevated stress levels detected. Consider mindfulness practices.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Usage Patterns */}
        <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <Clock className="mr-2 text-green-600" />
            Usage Patterns
          </h2>
          <div className="space-y-3 mb-3">
            <div className="flex justify-between">
              <span>Daily Average</span>
              <span>{analysis.usagePatterns.dailyAverage}</span>
            </div>
            <div className="flex justify-between">
              <span>Weekly Total</span>
              <span>{analysis.usagePatterns.weeklyTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Peak Activity Hours</span>
              <span>{analysis.usagePatterns.peakHours.join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span>Compared to Average</span>
              <span className={getComparisonColor(analysis.usagePatterns.comparisonToAvg)}>
                {analysis.usagePatterns.comparisonToAvg}%
              </span>
            </div>
          </div>
          {parseFloat(analysis.usagePatterns.dailyAverage) > 3 && (
            <p className="mt-3 text-sm text-red-500">
              Your daily usage exceeds recommended limits (3+ hours).
            </p>
          )}
        </div>

        {/* Content Engagement */}
        <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <BarChart2 className="mr-2 text-yellow-600" />
            Content Engagement
          </h2>
          <div className="space-y-3 mb-3">
            <div className="flex justify-between">
              <span>Positive Content</span>
              <span className={getToneColor(analysis.contentEngagement.positiveContent)}>
                {analysis.contentEngagement.positiveContent}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full" 
                style={{ width: `${analysis.contentEngagement.positiveContent}%` }}
              ></div>
            </div>

            <div className="flex justify-between">
              <span>Engagement Rate</span>
              <span>{analysis.contentEngagement.engagementRate}% (avg: 3.5%)</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Distribution</span>
              <span>Instagram: {analysis.contentEngagement.platformDistribution.instagram}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Analysis */}
      <div className="bg-pink-50 dark:bg-gray-700 p-4 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          <Sunrise className="mr-2 text-pink-500" />
          Image Analysis (Deep Learning)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between">
              <span>Brightness</span>
              <span className={getImageAnalysisColor(analysis.imageAnalysis.brightness)}>
                {analysis.imageAnalysis.brightness}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-pink-500 h-2 rounded-full" 
                style={{ width: `${analysis.imageAnalysis.brightness}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <span>Color Vibrancy</span>
              <span className={getImageAnalysisColor(analysis.imageAnalysis.colorVibrancy)}>
                {analysis.imageAnalysis.colorVibrancy}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-pink-500 h-2 rounded-full" 
                style={{ width: `${analysis.imageAnalysis.colorVibrancy}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <span>Faces Detected</span>
              <span>{analysis.imageAnalysis.facesDetected}</span>
            </div>
          </div>
        </div>
        {analysis.imageAnalysis.brightness < 60 && (
          <p className="mt-3 text-sm text-yellow-500">
            Your images tend to be darker than average (brightness below 60%).
          </p>
        )}
      </div>

      {/* NLP & LLM Insights */}
      <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-3">NLP & LLM Insights</h2>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Sentiment Trend:</span> {analysis.emotionalTone.positive > 65 ? 
              "Your content shows predominantly positive sentiment" : 
              "Your content shows mixed sentiment with room for more positivity"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Behavioral Pattern:</span> {analysis.usagePatterns.peakHours.some(h => h.includes('AM')) ? 
              "Late-night usage detected which may impact sleep quality" : 
              "Your usage patterns appear balanced throughout the day"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Contextual Analysis:</span> {analysis.stressIndicators.anxietyKeywords > 2 ? 
              "Frequent anxiety-related terms suggest elevated stress levels" : 
              "Language patterns indicate generally healthy emotional state"}
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h3 className="font-semibold mb-3 text-lg">Personalized Recommendations</h3>
        <ul className="list-disc pl-5 space-y-2">
          {analysis.emotionalTone.negative > 25 && (
            <li>Try posting more positive content to balance your emotional tone (currently {analysis.emotionalTone.negative}% negative)</li>
          )}
          {analysis.stressIndicators.overall > 60 && (
            <li>Practice mindfulness techniques to reduce stress (current level: {analysis.stressIndicators.overall}%)</li>
          )}
          {parseFloat(analysis.usagePatterns.dailyAverage) > 3 && (
            <li>Set app limits to reduce daily usage (currently {analysis.usagePatterns.dailyAverage})</li>
          )}
          {analysis.usagePatterns.peakHours.some(h => h.includes('AM')) && (
            <li>Avoid late-night social media use to improve sleep quality</li>
          )}
          {analysis.imageAnalysis.brightness < 60 && (
            <li>Try using brighter images to create more positive engagement</li>
          )}
          <li>Engage with positive communities to improve overall sentiment</li>
          <li>Take regular breaks from social media (every 45-60 minutes)</li>
        </ul>
      </div>

      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
        <p className="mb-2">
          <strong>Analysis Methodology:</strong> This assessment uses deep learning for image analysis, 
          NLP for text sentiment analysis, and transformer models for behavioral pattern recognition.
        </p>
        <p>
          <strong>Note:</strong> This is a simulated analysis. In a production environment, we would 
          securely connect to Instagram's API with your permission to analyze your actual activity data.
        </p>
      </div>
    </div>
  );
};

export default MentalHealthAssessment;