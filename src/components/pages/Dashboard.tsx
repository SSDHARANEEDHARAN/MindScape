import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../context/UserContext';
 
import { BarChart2, PieChart, LineChart, Brain, ArrowUp, ArrowDown, Clock, Minimize, Maximize } from 'lucide-react';
import MoodChart from '../dashboard/MoodChart';
import HealthInsightCard from '../dashboard/HealthInsightCard';
import { ChartType, HealthInsight, Widget } from '../types/types';
import MoodForecast from '../dashboard/MoodForecast';
import SmartSummary from '../dashboard/SmartSummary';
import TabNavigation from '../dashboard/TabNavigation';
import SocialMediaAnalysis from '../dashboard/SocialMediaAnalysis';
import MusicSuggestions from '../dashboard/MusicSuggestions';
import DeviceControl from '../dashboard/DeviceControl';
import Chatbot from '../AI chat/Chatbot';
import Watchs from '../3D simulation/SmartWatch';
import Admin from '../Admin/Admin';

// AI Configuration
const AI_API_KEY = 'AIzaSyBy0KCb5kFziYZC5gXkFgB3mXEmMzsatTE';
const AI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface AIAnalysis {
  happyPercentage?: string;
  sadPercentage?: string;
  stressedPercentage?: string;
  neutralPercentage?: string;
  healthSummary?: string;
  recommendations?: string[];
  screenTimeAnalysis?: string;
  contentRecommendations?: string[];
}

const Dashboard: React.FC = () => {
  const { userData, moodData, healthInsights, setHealthInsights } = useUser();
  const [selectedChart, setSelectedChart] = useState<ChartType>('bar');
  const [activeTab, setActiveTab] = useState('overview');
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'mood-analysis', title: 'Mood Analysis', isMinimized: false, position: { x: 0, y: 0 } },
    { id: 'health-insights', title: 'Health Insights', isMinimized: false, position: { x: 0, y: 0 } },
    { id: 'social-media', title: 'Social Media Analysis', isMinimized: false, position: { x: 0, y: 0 } },
    { id: 'remedies', title: 'Personalized Remedies', isMinimized: false, position: { x: 0, y: 0 } },
    { id: 'mood-forecast', title: 'Mood Forecast', isMinimized: false, position: { x: 0, y: 0 } },
    { id: 'music-suggestions', title: 'Music Suggestions', isMinimized: false, position: { x: 0, y: 0 } },
    { id: 'device-control', title: 'Device Control', isMinimized: false, position: { x: 0, y: 0 } }
  ]);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  // Analyze data with AI
  const analyzeWithAI = useCallback(async () => {
    setLoading(true);
    try {
      const prompt = `Analyze this mental health data:
      User: ${userData?.name}, Age: ${userData?.age}
      Mood Data: ${JSON.stringify(moodData)}
      Health Insights: ${JSON.stringify(healthInsights)}
      
      Provide a JSON response with:
      1. Mood percentages (happy, sad, stressed, neutral)
      2. Health insights summary
      3. Personalized recommendations
      4. Screen time analysis
      5. Content recommendations`;

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
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiResponse) {
        try {
          const parsedResponse = JSON.parse(aiResponse) as AIAnalysis;
          setAiAnalysis(parsedResponse);
        } catch (e) {
          console.error('Failed to parse AI response:', e);
          setAiAnalysis({
            happyPercentage: '40%',
            sadPercentage: '10%',
            stressedPercentage: '20%',
            neutralPercentage: '30%',
            healthSummary: 'AI analysis unavailable. Showing sample data.',
            recommendations: [
              'Practice mindfulness meditation for 10 minutes daily',
              'Increase vegetable intake in your meals',
              'Maintain consistent sleep schedule'
            ],
            screenTimeAnalysis: 'Your screen time is higher than average. Consider taking regular breaks.',
            contentRecommendations: [
              'Motivational and positive stories',
              'Nature and outdoor photography'
            ]
          });
        }
      }
    } catch (error) {
      console.error('AI Analysis Error:', error);
      setAiAnalysis({
        happyPercentage: '40%',
        sadPercentage: '10%',
        stressedPercentage: '20%',
        neutralPercentage: '30%',
        healthSummary: 'AI analysis unavailable. Showing sample data.',
        recommendations: [
          'Practice mindfulness meditation for 10 minutes daily',
          'Increase vegetable intake in your meals',
          'Maintain consistent sleep schedule'
        ],
        screenTimeAnalysis: 'Your screen time is higher than average. Consider taking regular breaks.',
        contentRecommendations: [
          'Motivational and positive stories',
          'Nature and outdoor photography'
        ]
      });
    } finally {
      setLoading(false);
    }
  }, [userData, moodData, healthInsights]);

  // Initialize data and AI analysis
  useEffect(() => {
    if (healthInsights.length === 0) {
      const sampleInsights: HealthInsight[] = [
        {
          category: 'Diet',
          score: 75,
          recommendation: 'Try to include more vegetables in your morning meals.'
        },
        {
          category: 'Sleep',
          score: 60,
          recommendation: 'Your sleep pattern is irregular. Try to maintain a consistent sleep schedule.'
        },
        {
          category: 'Screen Time',
          score: 45,
          recommendation: 'Your screen time is high. Consider taking regular breaks from screens.'
        },
        {
          category: 'Physical Activity',
          score: 80,
          recommendation: 'Good job on staying active! Try to maintain this level of activity.'
        }
      ];
      setHealthInsights(sampleInsights);
    }

    analyzeWithAI();
  }, [healthInsights.length, setHealthInsights, analyzeWithAI]);

  const toggleWidgetMinimize = (id: string) => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === id 
          ? { ...widget, isMinimized: !widget.isMinimized } 
          : widget
      )
    );
  };

  const handleChartTypeChange = (type: ChartType) => {
    setSelectedChart(type);
  };

  const renderChartIcon = (type: ChartType, Icon: React.ElementType) => {
    return (
      <button 
        onClick={() => handleChartTypeChange(type)}
        className={`p-2 rounded-lg ${selectedChart === type ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-gray-100 dark:bg-gray-700'}`}
        aria-label={`Switch to ${type} chart`}
      >
        <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
      </button>
    );
  };

  const renderWidgetHeader = (id: string, title: string) => {
    const widget = widgets.find(w => w.id === id);
    if (!widget) return null;
    
    return (
      <div className="flex justify-between items-center mb-4 cursor-move">
        <h2 className="text-lg font-semibold flex items-center">
          {id === 'mood-analysis' && <Brain className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />}
          {title}
        </h2>
        <div className="flex space-x-1">
          <button 
            onClick={() => toggleWidgetMinimize(id)}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={widget.isMinimized ? 'Maximize widget' : 'Minimize widget'}
          >
            {widget.isMinimized ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
          </button>
        </div>
      </div>
    );
  };

  const renderWidget = (id: string) => {
    const widget = widgets.find(w => w.id === id);
    if (!widget) return null;
    
    if (widget.isMinimized) {
      return (
        <div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6 cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => toggleWidgetMinimize(id)}
          aria-label={`Expand ${widget.title} widget`}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{widget.title}</h2>
            <Maximize className="h-4 w-4" />
          </div>
        </div>
      );
    }
    
    switch (id) {
      case 'mood-analysis':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
            {renderWidgetHeader(id, 'Mood Analysis')}
            {!widget.isMinimized && (
              <>
                <div className="flex space-x-2 mb-4">
                  {renderChartIcon('bar', BarChart2)}
                  {renderChartIcon('pie', PieChart)}
                  {renderChartIcon('line', LineChart)}
                </div>
                <MoodChart 
                  moodData={moodData} 
                  chartType={selectedChart} 
                  onChartTypeChange={handleChartTypeChange}
                  interactive={true}
                />
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg text-center">
                    <span className="block text-sm text-green-800 dark:text-green-200">Happy</span>
                    <span className="font-bold text-green-600 dark:text-green-300">
                      {loading ? '...' : (aiAnalysis?.happyPercentage || '40%')}
                    </span>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg text-center">
                    <span className="block text-sm text-blue-800 dark:text-blue-200">Sad</span>
                    <span className="font-bold text-blue-600 dark:text-blue-300">
                      {loading ? '...' : (aiAnalysis?.sadPercentage || '10%')}
                    </span>
                  </div>
                  <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg text-center">
                    <span className="block text-sm text-red-800 dark:text-red-200">Stressed</span>
                    <span className="font-bold text-red-600 dark:text-red-300">
                      {loading ? '...' : (aiAnalysis?.stressedPercentage || '20%')}
                    </span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-center">
                    <span className="block text-sm text-gray-800 dark:text-gray-200">Neutral</span>
                    <span className="font-bold text-gray-600 dark:text-gray-300">
                      {loading ? '...' : (aiAnalysis?.neutralPercentage || '30%')}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      
      case 'health-insights':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
            {renderWidgetHeader(id, 'Health Insights')}
            {!widget.isMinimized && (
              <div className="space-y-3">
                {healthInsights.map((insight, index) => (
                  <HealthInsightCard key={index} insight={insight} />
                ))}
                {aiAnalysis?.healthSummary && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg">
                    <h3 className="font-medium text-indigo-800 dark:text-indigo-300">AI Health Summary</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {aiAnalysis.healthSummary}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      
      case 'social-media':
        return (
          <div className="mb-6">
            <SocialMediaAnalysis />
          </div>
        );
      
      case 'remedies':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
            {renderWidgetHeader(id, 'Personalized Remedies')}
            {!widget.isMinimized && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiAnalysis?.recommendations ? (
                  aiAnalysis.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                      <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">
                        Suggestion {index + 1}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{rec}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                      <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">Diet Suggestions</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Based on your food habits, try incorporating more whole grains and proteins in your breakfast.
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                      <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Sleep Improvement</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Try to maintain a consistent sleep schedule. Aim for 7-8 hours of sleep each night.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      
      case 'mood-forecast':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
            {renderWidgetHeader(id, 'Mood Forecast')}
            {!widget.isMinimized && <MoodForecast />}
          </div>
        );
      
      case 'music-suggestions':
        return (
          <div className="mb-6">
            <MusicSuggestions currentMood="happy" />
          </div>
        );
      
      case 'device-control':
        return (
          <div className="mb-6">
            <DeviceControl isAdmin={true} />
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <SmartSummary aiAnalysis={aiAnalysis} loading={loading} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {renderWidget('mood-analysis')}
                {renderWidget('mood-forecast')}
              </div>
              <div>
                {renderWidget('health-insights')}
                {renderWidget('music-suggestions')}
              </div>
            </div>
          </>
        );
      
      case 'mood':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {renderWidget('mood-analysis')}
              {renderWidget('mood-forecast')}
            </div>
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
                <h2 className="text-lg font-semibold mb-4">Mood Trends</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Weekly Happiness</span>
                    <div className="flex items-center text-green-500">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span>{loading ? '...' : (aiAnalysis?.happyPercentage || '40%')}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Stress Level</span>
                    <div className="flex items-center text-red-500">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span>{loading ? '...' : (aiAnalysis?.stressedPercentage || '20%')}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sadness</span>
                    <div className="flex items-center text-green-500">
                      <ArrowDown className="h-4 w-4 mr-1" />
                      <span>{loading ? '...' : (aiAnalysis?.sadPercentage || '10%')}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Neutral Mood</span>
                    <div className="flex items-center text-gray-500">
                      <ArrowDown className="h-4 w-4 mr-1" />
                      <span>{loading ? '...' : (aiAnalysis?.neutralPercentage || '30%')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
                <h2 className="text-lg font-semibold mb-4">Mood-Based Suggestions</h2>
                <div className="space-y-3">
                  {aiAnalysis?.recommendations?.slice(0, 3).map((rec, index) => (
                    <div key={index} className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg">
                      <h3 className="font-medium text-indigo-800 dark:text-indigo-300 text-sm">
                        Suggestion {index + 1}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
              {renderWidget('music-suggestions')}
            </div>
          </div>
        );
      
      case 'health':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
                <h2 className="text-lg font-semibold mb-4">Health Metrics</h2>
                <div className="grid grid-cols-2 gap-4">
                  {healthInsights.map((insight) => (
                    <div key={insight.category} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{insight.category}</span>
                        <span className="text-sm font-medium">{insight.score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            insight.score > 70 ? 'bg-green-600' : 
                            insight.score > 40 ? 'bg-yellow-500' : 'bg-red-600'
                          }`} 
                          style={{ width: `${insight.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {renderWidget('remedies')}
            </div>
            <div>
              {renderWidget('health-insights')}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
                <h2 className="text-lg font-semibold mb-4">Smart Notifications</h2>
                <div className="space-y-3">
                  {healthInsights
                    .filter(insight => insight.score < 70)
                    .map((insight, index) => (
                      <div key={index} className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <Clock className="h-5 w-5 text-blue-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium">{insight.category} Alert</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{insight.recommendation}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        );
        case 'chatbot':
          return (
            <div className="mb-6">
              <Chatbot />
            </div>
          );

          case 'Watchs':
            return (
              <div className="mb-6">
                <Watchs />
              </div>
            );   

            case 'Admin':
            return (
              <div className="mb-6">
                <Admin darkMode={false} />
              </div>
            ); 
        
      case 'social':
        return (
          <>
            {renderWidget('social-media')}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Social Media Impact</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Screen Time Analysis</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {aiAnalysis?.screenTimeAnalysis || 'Your social media usage patterns will be analyzed soon.'}
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Content Recommendations</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Based on your mood patterns, we recommend:
                    </p>
                    <div className="space-y-2">
                      {aiAnalysis?.contentRecommendations?.map((rec, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm">{rec}</span>
                        </div>
                      )) || (
                        <>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm">Motivational and positive stories</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            <span className="text-sm">Nature and outdoor photography</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 md:pl-20">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">
            Hello, {userData?.name || 'there'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your AI-powered mental health overview
          </p>
        </header>
        
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="ml-4">Analyzing your data with AI...</p>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
};

export default Dashboard;