/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import { BarChart2, PieChart as PieChartIcon, Percent, LineChart as LineChartIcon } from 'lucide-react';

interface MoodData {
  category: string;
  percentage: number;
}

type ChartType = 'circular' | 'percentage' | 'bar' | 'line';

interface MoodChartProps {
  moodData: MoodData[];
  chartType: ChartType;
  onChartTypeChange?: (type: ChartType) => void;
  userNotes?: string;
  userId?: string;
}

const COLORS = {
  happy: '#4ade80',
  sad: '#60a5fa',
  stressed: '#f87171',
  neutral: '#EE82EE',
  aiHappy: '#16a34a',
  aiSad: '#1d4ed8',
  aiStressed: '#dc2626',
  aiNeutral: '#9333ea'
};

const RADIAN = Math.PI / 180;

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent
}: LabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const MoodChart: React.FC<MoodChartProps> = ({
  moodData,
  chartType,
  onChartTypeChange,
  userNotes = '',
  userId
}) => {
  const [aiData, setAiData] = useState<MoodData[]>([]);
  const [nlmData, setNlmData] = useState<MoodData[]>([]);
  const [datasetComparison, setDatasetComparison] = useState<MoodData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [showComparison, setShowComparison] = useState(false);

  const API_KEY = 'AIzaSyBy0KCb5kFziYZC5gXkFgB3mXEmMzsatTE';
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  const defaultData = useMemo(() => [
    { category: 'happy', percentage: 55 },
    { category: 'neutral', percentage: 30 },
    { category: 'stressed', percentage: 20 },
    { category: 'sad', percentage: 10 }
  ], []);

  const data = useMemo(() => moodData.length > 0 ? moodData : defaultData, [moodData, defaultData]);

  const timeSeriesData = useMemo(() => [
    { name: 'Mon', happy: 45, sad: 10, stressed: 20, neutral: 30, aiHappy: 35, aiSad: 15, aiStressed: 25, aiNeutral: 25 },
    { name: 'Tue', happy: 45, sad: 15, stressed: 15, neutral: 25, aiHappy: 40, aiSad: 20, aiStressed: 20, aiNeutral: 20 },
    { name: 'Wed', happy: 30, sad: 20, stressed: 30, neutral: 20, aiHappy: 35, aiSad: 25, aiStressed: 25, aiNeutral: 15 },
    { name: 'Thu', happy: 50, sad: 10, stressed: 10, neutral: 30, aiHappy: 45, aiSad: 15, aiStressed: 15, aiNeutral: 25 },
    { name: 'Fri', happy: 60, sad: 5, stressed: 15, neutral: 20, aiHappy: 55, aiSad: 10, aiStressed: 20, aiNeutral: 15 },
    { name: 'Sat', happy: 65, sad: 5, stressed: 10, neutral: 20, aiHappy: 60, aiSad: 10, aiStressed: 15, aiNeutral: 15 },
    { name: 'Sun', happy: 55, sad: 10, stressed: 15, neutral: 20, aiHappy: 50, aiSad: 15, aiStressed: 20, aiNeutral: 15 }
  ], []);

  const getStorageKey = useCallback((key: string) => 
    userId ? `mindscape_mood_${key}_${userId}` : `mindscape_mood_${key}`,
    [userId]
  );

  const generateDataHash = useCallback(() => {
    const dataString = JSON.stringify({ moodData, userNotes });
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }, [moodData, userNotes]);

  const analyzeDataWithAI = useCallback(async () => {
    const currentHash = generateDataHash();
    const storageKey = getStorageKey('analysis');
    const cachedData = localStorage.getItem(storageKey);
    
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      if (parsedData.dataHash === currentHash) {
        setAiData(parsedData.moodDistribution || []);
        setAnalysisResult(parsedData.analysis || '');
        return;
      }
    }

    setIsLoading(true);
    try {
      const prompt = `Analyze this mood data and user notes to provide:
      1. Mood distribution percentages (happy, sad, stressed, neutral)
      2. Brief analysis of patterns
      
      Mood Data: ${JSON.stringify(moodData)}
      User Notes: ${userNotes}
      
      Return a JSON object with 'analysis' string and 'moodDistribution' array like:
      { analysis: string, moodDistribution: [{category: string, percentage: number}] }`;

      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
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

      const result = await response.json();
      const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      const parsedResponse = JSON.parse(textResponse.replace(/```json|```/g, ''));

      if (parsedResponse.moodDistribution) {
        const resultToStore = {
          moodDistribution: parsedResponse.moodDistribution,
          analysis: parsedResponse.analysis || '',
          dataHash: currentHash
        };
        setAiData(parsedResponse.moodDistribution);
        localStorage.setItem(storageKey, JSON.stringify(resultToStore));
      }
      if (parsedResponse.analysis) {
        setAnalysisResult(parsedResponse.analysis);
      }
    } catch (error) {
      console.error('AI analysis error:', error);
      const fallbackData = [
        { category: 'happy', percentage: Math.min(100, data.find(d => d.category === 'happy')?.percentage || 0 + 5) },
        { category: 'sad', percentage: Math.min(100, data.find(d => d.category === 'sad')?.percentage || 0 + 5) },
        { category: 'stressed', percentage: Math.min(100, data.find(d => d.category === 'stressed')?.percentage || 0 + 5) },
        { category: 'neutral', percentage: Math.min(100, data.find(d => d.category === 'neutral')?.percentage || 0 + 5) }
      ];
      const resultToStore = {
        moodDistribution: fallbackData,
        analysis: "Standard mood pattern detected",
        dataHash: currentHash
      };
      setAiData(fallbackData);
      localStorage.setItem(storageKey, JSON.stringify(resultToStore));
    } finally {
      setIsLoading(false);
    }
  }, [moodData, userNotes, data, userId, generateDataHash, getStorageKey]);

  const generateNlmAnalysis = useCallback(() => {
    const currentHash = generateDataHash();
    const storageKey = getStorageKey('nlm');
    const cachedData = localStorage.getItem(storageKey);
    
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      if (parsedData.dataHash === currentHash) {
        setNlmData(parsedData.result || []);
        return;
      }
    }

    const nlmResult = data.map(item => {
      let adjustment = 0;
      if (item.category === 'happy') adjustment = -5;
      if (item.category === 'stressed') adjustment = 10;
      return {
        category: item.category,
        percentage: Math.max(0, Math.min(100, item.percentage + adjustment))
      };
    });
    
    const resultToStore = {
      result: nlmResult,
      dataHash: currentHash
    };
    
    setNlmData(nlmResult);
    localStorage.setItem(storageKey, JSON.stringify(resultToStore));
  }, [data, userId, generateDataHash, getStorageKey]);

  const compareWithDataset = useCallback(() => {
    const currentHash = generateDataHash();
    const storageKey = getStorageKey('dataset');
    const cachedData = localStorage.getItem(storageKey);
    
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      if (parsedData.dataHash === currentHash) {
        setDatasetComparison(parsedData.result || []);
        return;
      }
    }

    const datasetResult = data.map(item => {
      let adjustment = 0;
      if (item.category === 'happy') adjustment = -10;
      if (item.category === 'neutral') adjustment = 5;
      return {
        category: item.category,
        percentage: Math.max(0, Math.min(100, item.percentage + adjustment))
      };
    });
    
    const resultToStore = {
      result: datasetResult,
      dataHash: currentHash
    };
    
    setDatasetComparison(datasetResult);
    localStorage.setItem(storageKey, JSON.stringify(resultToStore));
  }, [data, userId, generateDataHash, getStorageKey]);

  useEffect(() => {
    if (moodData.length > 0 || userNotes) {
      analyzeDataWithAI();
      generateNlmAnalysis();
      compareWithDataset();
    }
  }, [moodData, userNotes, analyzeDataWithAI, generateNlmAnalysis, compareWithDataset]);

  const renderChartSelector = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      {['circular', 'percentage', 'bar', 'line'].map((type) => (
        <button
          key={type}
          onClick={() => onChartTypeChange?.(type as ChartType)}
          className={`p-2 rounded-md flex items-center transition-colors ${
            chartType === type
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          {type === 'circular' && <PieChartIcon className="h-4 w-4 mr-1" />}
          {type === 'percentage' && <Percent className="h-4 w-4 mr-1" />}
          {type === 'bar' && <BarChart2 className="h-4 w-4 mr-1" />}
          {type === 'line' && <LineChartIcon className="h-4 w-4 mr-1" />}
          <span className="text-sm capitalize">{type}</span>
        </button>
      ))}
      <button
        onClick={() => setShowComparison(!showComparison)}
        className={`p-2 rounded-md flex items-center transition-colors ${
          showComparison
            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
        }`}
      >
        <span className="text-sm">AI Comparison</span>
      </button>
    </div>
  );

  const renderComparisonChart = () => {
    const combinedData = data.map((item, index) => ({
      ...item,
      aiPercentage: aiData[index]?.percentage || 0,
      nlmPercentage: nlmData[index]?.percentage || 0,
      datasetPercentage: datasetComparison[index]?.percentage || 0
    }));

    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Comparison Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h4 className="font-medium mb-2">Your Data vs AI Analysis</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="percentage" fill="#8884d8" name="Your Data" />
                <Bar dataKey="aiPercentage" fill="#82ca9d" name="AI Analysis" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h4 className="font-medium mb-2">All Comparisons</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="percentage" fill="#8884d8" name="Your Data" />
                <Bar dataKey="aiPercentage" fill="#82ca9d" name="AI Analysis" />
                <Bar dataKey="nlmPercentage" fill="#ffc658" name="NLM Pattern" />
                <Bar dataKey="datasetPercentage" fill="#ff8042" name="Dataset Avg" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (chartType) {
      case 'circular':
        return (
          <div className="relative">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={showComparison ? aiData : data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                  nameKey="category"
                >
                  {(showComparison ? aiData : data).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={showComparison 
                        ? COLORS[`ai${entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}` as keyof typeof COLORS]
                        : COLORS[entry.category as keyof typeof COLORS]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {showComparison && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 bg-opacity-90 p-4 rounded-lg shadow-lg max-w-xs">
                  <h3 className="font-semibold mb-2">AI Analysis</h3>
                  <p className="text-sm">{analysisResult || "Analyzing patterns..."}</p>
                </div>
              </div>
            )}
          </div>
        );
      case 'percentage':
        return (
          <div className="h-full w-full flex flex-col justify-center">
            {(showComparison ? aiData : data).map((entry, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="capitalize">{entry.category}</span>
                  <span>{entry.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-1000"
                    style={{
                      width: `${entry.percentage}%`,
                      backgroundColor: showComparison 
                        ? COLORS[`ai${entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}` as keyof typeof COLORS]
                        : COLORS[entry.category as keyof typeof COLORS]
                    }}
                  ></div>
                </div>
              </div>
            ))}
            {showComparison && analysisResult && (
              <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900 rounded-md">
                <p className="text-sm">{analysisResult}</p>
              </div>
            )}
          </div>
        );
      case 'bar':
        return (
          <div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 'auto']} />
                <Tooltip />
                {showComparison ? (
                  <>
                    <Bar dataKey="aiHappy" fill={COLORS.aiHappy} stackId="a" name="AI Happy" />
                    <Bar dataKey="aiSad" fill={COLORS.aiSad} stackId="a" name="AI Sad" />
                    <Bar dataKey="aiStressed" fill={COLORS.aiStressed} stackId="a" name="AI Stressed" />
                    <Bar dataKey="aiNeutral" fill={COLORS.aiNeutral} stackId="a" name="AI Neutral" />
                  </>
                ) : (
                  <>
                    <Bar dataKey="happy" fill={COLORS.happy} stackId="a" name="Happy" />
                    <Bar dataKey="sad" fill={COLORS.sad} stackId="a" name="Sad" />
                    <Bar dataKey="stressed" fill={COLORS.stressed} stackId="a" name="Stressed" />
                    <Bar dataKey="neutral" fill={COLORS.neutral} stackId="a" name="Neutral" />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
            {showComparison && analysisResult && (
              <div className="mt-2 p-2 text-xs bg-gray-100 dark:bg-gray-800 rounded">
                <p>{analysisResult}</p>
              </div>
            )}
          </div>
        );
      case 'line':
        return (
          <div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 'auto']} />
                <Tooltip />
                {showComparison ? (
                  <>
                    <Area dataKey="aiHappy" stroke={COLORS.aiHappy} fill={COLORS.aiHappy} name="AI Happy" />
                    <Area dataKey="aiSad" stroke={COLORS.aiSad} fill={COLORS.aiSad} name="AI Sad" />
                    <Area dataKey="aiStressed" stroke={COLORS.aiStressed} fill={COLORS.aiStressed} name="AI Stressed" />
                    <Area dataKey="aiNeutral" stroke={COLORS.aiNeutral} fill={COLORS.aiNeutral} name="AI Neutral" />
                  </>
                ) : (
                  <>
                    <Area dataKey="happy" stroke={COLORS.happy} fill={COLORS.happy} name="Happy" />
                    <Area dataKey="sad" stroke={COLORS.sad} fill={COLORS.sad} name="Sad" />
                    <Area dataKey="stressed" stroke={COLORS.stressed} fill={COLORS.stressed} name="Stressed" />
                    <Area dataKey="neutral" stroke={COLORS.neutral} fill={COLORS.neutral} name="Neutral" />
                  </>
                )}
              </AreaChart>
            </ResponsiveContainer>
            {showComparison && analysisResult && (
              <div className="mt-2 p-2 text-xs bg-gray-100 dark:bg-gray-800 rounded">
                <p>{analysisResult}</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {showComparison ? 'AI Mood Analysis' : 'Your Mood Chart'}
        </h2>
        {renderChartSelector()}
      </div>
      
      <div className="h-64 w-full">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          renderChart()
        )}
      </div>
      
      {showComparison && !isLoading && renderComparisonChart()}
      
      {analysisResult && !showComparison && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="font-semibold mb-2">AI Insights</h3>
          <p>{analysisResult}</p>
        </div>
      )}
    </div>
  );
};

export default MoodChart;