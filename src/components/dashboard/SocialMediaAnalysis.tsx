import React, { useState, useEffect, useMemo } from 'react';

interface EmotionalTone {
  positive: number;
  negative: number;
  neutral: number;
}

interface StressIndicators {
  stressLevel: number;
  anxietyKeywords: number;
  sleepDisruption: number;
}

interface UsagePatterns {
  dailyAverage: number;
  peakHours: string[];
  weeklyTotal: number;
  platformBreakdown: Record<string, number>;
  hourlyUsage: {
    hour: string;
    activity: number;
  }[];
}

interface ContentAnalysis {
  positiveContentRatio: number;
  negativeContentRatio: number;
  engagementRatio: number;
}

interface Recommendations {
  immediateActions: string[];
  longTermStrategies: string[];
  professionalHelp?: string[];
}

interface Comparison {
  platformAverage: number;
  ageGroupAverage: number;
}

interface MentalHealthReport {
  overallScore: number;
  emotionalTone: EmotionalTone;
  stressIndicators: StressIndicators;
  usagePatterns: UsagePatterns;
  contentAnalysis: ContentAnalysis;
  recommendations: Recommendations;
  comparison: Comparison;
}

interface PlatformData {
  texts: string[];
  usageData: {
    dailyAverage: number;
    weeklyTotal: number;
    peakHours: string[];
    hourlyUsage: {
      hour: string;
      activity: number;
    }[];
  };
}

type SocialPlatform = 'twitter' | 'instagram';

// Consistent data generator based on URL
const generateConsistentData = (profileUrl: string, platform: SocialPlatform): PlatformData => {
  // Create consistent seed from URL
  const seed = Array.from(profileUrl).reduce((hash, char) => 
    (hash << 5) - hash + char.charCodeAt(0), 0) >>> 0;
  
  // Consistent pseudo-random number generator
  const random = (max = 1, min = 0) => {
    const x = Math.sin(seed + max * min * 1000) * 10000;
    return Math.abs(x - Math.floor(x)) * (max - min) + min;
  };

  // Platform-specific content variations
  const platformModifier = platform === 'twitter' ? 1.2 : 1;
  
  // Text pools with different sentiments
  const positiveTexts = [
    "Had a great day today! #happy",
    "Just finished my morning run! #fitness",
    "Excited for the weekend! #tgif",
    "The sunrise this morning was absolutely breathtaking",
    "Proud of myself for completing that project!",
    "Enjoying this beautiful weather",
    "Grateful for my friends and family",
    "Achieved a personal best today!",
    "Life is good right now",
    "Making progress on my goals"
  ];

  const negativeTexts = [
    "Feeling a bit overwhelmed with work lately...",
    "Why does everything have to be so complicated?",
    "Can't sleep again... this is becoming a pattern",
    "Another day, another struggle",
    "Social media can be so toxic sometimes",
    "Feeling anxious about tomorrow",
    "When will this stress end?",
    "Why do I feel so overwhelmed?",
    "Struggling to keep up with everything",
    "Need a break from everything"
  ];

  // Determine profile temperament (consistent for same URL)
  const positivityRatio = random(0.3, 0.8) * platformModifier;
  
  // Generate texts based on profile temperament
  const texts = Array.from({ length: 10 }, (_, i) => {
    return random() < positivityRatio ? 
      positiveTexts[i % positiveTexts.length] : 
      negativeTexts[i % negativeTexts.length];
  });

  // Generate consistent usage patterns with platform differences
  const dailyAverage = random(1.5, 4.5) * (platform === 'twitter' ? 1.1 : 0.9);
  const weeklyTotal = Math.round(dailyAverage * 7 * 100) / 100;
  
  // Peak hours based on usage pattern and platform
  const isNightOwl = random() > 0.6;
  const peakHours = platform === 'twitter' 
    ? (isNightOwl ? ['9 PM-12 AM', '12-3 AM'] : ['6-9 PM', '12-3 PM'])
    : (isNightOwl ? ['8 PM-11 PM', '11 PM-2 AM'] : ['7-10 PM', '1-4 PM']);

  // Generate hourly usage pattern
  const hourlyUsage = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour}:00`,
    activity: Math.floor(
      platform === 'twitter' 
        ? (isNightOwl ? 
            (hour > 18 ? random(30, 50) : hour > 12 ? random(15, 30) : random(5, 15)) :
            (hour > 16 ? random(25, 40) : hour > 9 ? random(20, 35) : random(5, 20)))
        : (isNightOwl ?
            (hour > 19 ? random(25, 45) : hour > 13 ? random(15, 25) : random(5, 15)) :
            (hour > 17 ? random(20, 35) : hour > 10 ? random(15, 30) : random(5, 20)))
    )
  }));

  return {
    texts,
    usageData: {
      dailyAverage,
      weeklyTotal,
      peakHours,
      hourlyUsage
    }
  };
};

// Mock API responses with consistent data
const mockPlatformAPIs = {
  twitter: async (profileUrl: string): Promise<PlatformData> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return generateConsistentData(profileUrl, 'twitter');
  },
  instagram: async (profileUrl: string): Promise<PlatformData> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return generateConsistentData(profileUrl, 'instagram');
  }
};

// NLP analysis functions
const analyzeEmotionalTone = (texts: string[]): EmotionalTone => {
  let positive = 0;
  let negative = 0;
  let neutral = 0;
  
  const positiveKeywords = ['happy', 'great', 'excited', 'proud', 'blessed', 'grateful', 'beautiful', 'achievement'];
  const negativeKeywords = ['overwhelmed', 'complicated', 'struggle', 'toxic', 'anxiety', 'hard', 'sleepless'];
  
  texts.forEach(text => {
    const lowerText = text.toLowerCase();
    const posMatches = positiveKeywords.filter(kw => lowerText.includes(kw)).length;
    const negMatches = negativeKeywords.filter(kw => lowerText.includes(kw)).length;
    
    if (posMatches > negMatches) positive++;
    else if (negMatches > posMatches) negative++;
    else neutral++;
  });
  
  const total = texts.length || 1;
  return {
    positive: Math.round((positive / total) * 100),
    negative: Math.round((negative / total) * 100),
    neutral: Math.round((neutral / total) * 100)
  };
};

const detectStressIndicators = (texts: string[]): StressIndicators => {
  const anxietyKeywords = ['anxiety', 'overwhelmed', 'stress', 'pressure', 'worry', 'nervous'];
  const sleepKeywords = ['sleepless', 'can\'t sleep', 'insomnia', 'tired', 'exhausted'];
  
  let anxietyCount = 0;
  let sleepCount = 0;
  
  texts.forEach(text => {
    const lowerText = text.toLowerCase();
    anxietyCount += anxietyKeywords.filter(kw => lowerText.includes(kw)).length;
    sleepCount += sleepKeywords.filter(kw => lowerText.includes(kw)).length;
  });
  
  // Calculate stress level based on keyword frequency
  const stressLevel = Math.min(100, Math.round(
    (anxietyCount * 5) + (sleepCount * 3) + (Math.random() * 20)
  ));
  
  return {
    stressLevel,
    anxietyKeywords: anxietyCount,
    sleepDisruption: sleepCount
  };
};

const calculateUsageScore = (usageData: {
  dailyAverage: number;
  hourlyUsage: { hour: string; activity: number }[];
}): number => {
  // Score based on daily average (higher usage = higher potential negative impact)
  const dailyScore = Math.min(100, Math.round(
    (usageData.dailyAverage / 4) * 100
  ));
  
  // Score based on late-night usage
  const lateNightUsage = usageData.hourlyUsage
    .filter(h => {
      const hour = parseInt(h.hour.split(':')[0]);
      return hour >= 22 || hour <= 5;
    })
    .reduce((sum, h) => sum + h.activity, 0);
  
  const lateNightScore = Math.min(50, Math.round(
    (lateNightUsage / 100) * 50
  ));
  
  return Math.round((dailyScore * 0.7) + (lateNightScore * 0.3));
};

const generateRecommendations = (report: {
  emotionalTone: EmotionalTone;
  stressIndicators: StressIndicators;
  usagePatterns: {
    dailyAverage: number;
  };
}): Recommendations => {
  const recommendations: Recommendations = {
    immediateActions: [],
    longTermStrategies: [],
  };
  
  // Immediate actions 
  if (report.usagePatterns.dailyAverage > 3) {
    recommendations.immediateActions.push(
      "Set app usage limits on your device",
      "Designate tech-free times (e.g., during meals, 1 hour before bed)"
    );
  }
  
  if (report.stressIndicators.stressLevel > 60) {
    recommendations.immediateActions.push(
      "Practice 5-minute breathing exercises when feeling stressed",
      "Take a 24-hour social media break"
    );
  }
  
  // Long-term strategies
  recommendations.longTermStrategies.push(
    "Establish a consistent sleep schedule",
    "Develop offline hobbies (reading, sports, arts)",
    "Schedule regular digital detox weekends"
  );
  
  if (report.emotionalTone.negative > 30) {
    recommendations.longTermStrategies.push(
      "Curate your feed to follow more positive accounts",
      "Practice gratitude journaling"
    );
  }
  
  // Professional help suggestions
  if (report.stressIndicators.stressLevel > 80 || report.emotionalTone.negative > 50) {
    recommendations.professionalHelp = [
      "Consider consulting a mental health professional",
      "Explore cognitive behavioral therapy techniques",
      "Contact local support groups for digital wellness"
    ];
  }
  
  return recommendations;
};

const SocialMediaMentalHealthAnalyzer: React.FC = () => {
  const [profileUrl, setProfileUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<MentalHealthReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [platform, setPlatform] = useState<SocialPlatform | null>(null);

  // Cache reports by URL to ensure consistency
  const reportCache = useMemo(() => new Map<string, MentalHealthReport>(), []);

  useEffect(() => {
    if (profileUrl) {
      if (profileUrl.includes('twitter.com') || profileUrl.includes('x.com')) {
        setPlatform('twitter');
      } else if (profileUrl.includes('instagram.com')) {
        setPlatform('instagram');
      } else {
        setPlatform(null);
      }
    }
  }, [profileUrl]);

  const analyzeProfile = async () => {
    if (!profileUrl || !platform) return;
    
    // Check cache first to avoid re-analysis
    if (reportCache.has(profileUrl)) {
      setReport(reportCache.get(profileUrl)!);
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setReport(null);

    try {
      // Get platform data
      const platformResponse = await mockPlatformAPIs[platform](profileUrl);
      
      // Perform analysis
      const emotionalTone = analyzeEmotionalTone(platformResponse.texts);
      const stressIndicators = detectStressIndicators(platformResponse.texts);
      const usageScore = calculateUsageScore(platformResponse.usageData);
      
      // Generate consistent comparison scores based on URL
      const seed = Array.from(profileUrl).reduce((hash, char) => 
        (hash << 5) - hash + char.charCodeAt(0), 0);
      const platformAvg = 65 + (seed % 20); // 65-85
      const ageGroupAvg = 60 + (seed % 25); // 60-85
      
      // Calculate overall score (weighted average)
      const overallScore = Math.round(
        (emotionalTone.positive * 0.4) + 
        ((100 - stressIndicators.stressLevel) * 0.3) +
        ((100 - usageScore) * 0.3)
      );
      
      // Generate report
      const reportData: MentalHealthReport = {
        overallScore,
        emotionalTone,
        stressIndicators,
        usagePatterns: {
          dailyAverage: parseFloat(platformResponse.usageData.dailyAverage.toFixed(1)),
          peakHours: platformResponse.usageData.peakHours,
          weeklyTotal: Math.round(platformResponse.usageData.weeklyTotal),
          platformBreakdown: { [platform]: 100 },
          hourlyUsage: platformResponse.usageData.hourlyUsage
        },
        contentAnalysis: {
          positiveContentRatio: emotionalTone.positive,
          negativeContentRatio: emotionalTone.negative,
          engagementRatio: 40 + (seed % 40) // 40-80%
        },
        recommendations: generateRecommendations({
          emotionalTone,
          stressIndicators,
          usagePatterns: { dailyAverage: platformResponse.usageData.dailyAverage }
        }),
        comparison: {
          platformAverage: platformAvg,
          ageGroupAverage: ageGroupAvg
        }
      };
      
      // Cache the report
      reportCache.set(profileUrl, reportData);
      setReport(reportData);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze profile. Please try again with a valid URL.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
        Social Media Mental Health Analyzer
      </h2>
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              placeholder="Paste profile URL (e.g., twitter.com/username, instagram.com/username)"
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {platform && (
              <p className="text-sm text-gray-500 mt-1">
                Analyzing {platform} profile
              </p>
            )}
          </div>
          <button
            onClick={analyzeProfile}
            disabled={isAnalyzing || !platform}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : 'Analyze Profile'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Note: This demo uses simulated data. A production version would connect to real social media APIs.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg text-red-700 dark:text-red-300 mb-6">
          {error}
        </div>
      )}

      {report && (
        <div className="space-y-8">
          {/* Health Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h3 className="font-bold text-xl">Mental Health Assessment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Based on {platform} activity analysis
                </p>
              </div>
              <div className="flex items-center mt-4 md:mt-0">
                <div className="text-center">
                  <span className={`text-4xl font-bold ${
                    report.overallScore >= 80 ? 'text-green-600' : 
                    report.overallScore >= 60 ? 'text-yellow-500' : 'text-red-600'
                  }`}>
                    {report.overallScore}
                  </span>
                  <span className="text-lg font-medium text-gray-500">/100</span>
                </div>
                <div className="ml-4">
                  <p className={`font-medium ${
                    report.overallScore >= 80 ? 'text-green-600' : 
                    report.overallScore >= 60 ? 'text-yellow-500' : 'text-red-600'
                  }`}>
                    {report.overallScore >= 80 ? 'Excellent' : 
                     report.overallScore >= 60 ? 'Moderate' : 'Needs Improvement'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {report.comparison && (
                      `Compared to ${report.comparison.platformAverage} (platform avg)`
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className={`h-3 rounded-full ${
                  report.overallScore >= 80 ? 'bg-green-500' : 
                  report.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${report.overallScore}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-500">Emotional Tone</p>
                <p className="font-medium">
                  {report.emotionalTone.positive}% positive
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Stress Level</p>
                <p className="font-medium">
                  {report.stressIndicators.stressLevel}/100
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Daily Usage</p>
                <p className="font-medium">
                  {report.usagePatterns.dailyAverage} hrs/day
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Analysis Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Emotional Tone Analysis */}
            <div className="bg-white dark:bg-gray-700 p-5 rounded-xl shadow">
              <h4 className="font-semibold text-lg mb-3">Emotional Tone Analysis</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-green-600">Positive</span>
                    <span className="text-sm font-medium">{report.emotionalTone.positive}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${report.emotionalTone.positive}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-yellow-500">Neutral</span>
                    <span className="text-sm font-medium">{report.emotionalTone.neutral}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-yellow-500 h-2.5 rounded-full" 
                      style={{ width: `${report.emotionalTone.neutral}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-red-600">Negative</span>
                    <span className="text-sm font-medium">{report.emotionalTone.negative}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-red-600 h-2.5 rounded-full" 
                      style={{ width: `${report.emotionalTone.negative}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mt-3">
                {report.emotionalTone.positive > report.emotionalTone.negative ? 
                 "Your content shows predominantly positive emotions." : 
                 "Your content contains significant negative expressions that may warrant attention."}
              </p>
            </div>

            {/* Stress Indicators */}
            <div className="bg-white dark:bg-gray-700 p-5 rounded-xl shadow">
              <h4 className="font-semibold text-lg mb-3">Stress Indicators</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Overall Stress Level</span>
                    <span className={`text-sm font-medium ${
                      report.stressIndicators.stressLevel > 70 ? 'text-red-600' :
                      report.stressIndicators.stressLevel > 40 ? 'text-yellow-500' : 'text-green-600'
                    }`}>
                      {report.stressIndicators.stressLevel}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        report.stressIndicators.stressLevel > 70 ? 'bg-red-600' :
                        report.stressIndicators.stressLevel > 40 ? 'bg-yellow-500' : 'bg-green-600'
                      }`}
                      style={{ width: `${report.stressIndicators.stressLevel}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Anxiety Keywords</p>
                    <p className="font-medium">
                      {report.stressIndicators.anxietyKeywords} detected
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sleep Mentions</p>
                    <p className="font-medium">
                      {report.stressIndicators.sleepDisruption} references
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mt-2">
                  {report.stressIndicators.stressLevel > 70 ? 
                   "Your activity shows strong stress indicators that may require intervention." :
                   report.stressIndicators.stressLevel > 40 ?
                   "Moderate stress indicators detected. Consider stress-management techniques." :
                   "Minimal stress indicators detected in your activity."}
                </p>
              </div>
            </div>

            {/* Usage Patterns */}
            <div className="bg-white dark:bg-gray-700 p-5 rounded-xl shadow">
              <h4 className="font-semibold text-lg mb-3">Usage Patterns</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Daily Average</p>
                    <p className="font-medium text-xl">
                      {report.usagePatterns.dailyAverage} hours
                    </p>
                    <p className="text-xs text-gray-500">
                      {report.usagePatterns.dailyAverage > 3 ? 
                       "Above recommended limits" : 
                       "Within healthy range"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Weekly Total</p>
                    <p className="font-medium text-xl">
                      {report.usagePatterns.weeklyTotal} hours
                    </p>
                    <p className="text-xs text-gray-500">
                      {report.usagePatterns.weeklyTotal > 21 ? 
                       "Significant time investment" : 
                       "Moderate usage"}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">Peak Activity Hours</p>
                  <div className="flex flex-wrap gap-2">
                    {report.usagePatterns.peakHours.map((hour, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full text-sm">
                        {hour}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {report.usagePatterns.peakHours.some(h => h.includes('PM') && 
                     report.usagePatterns.peakHours.some(h => h.includes('AM'))) ?
                     "Evening and late-night usage patterns detected" :
                     "Primary usage during daytime hours"}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Analysis */}
            <div className="bg-white dark:bg-gray-700 p-5 rounded-xl shadow">
              <h4 className="font-semibold text-lg mb-3">Content Engagement</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Positive Content</p>
                    <p className="font-medium text-xl">
                      {report.contentAnalysis.positiveContentRatio}%
                    </p>
                    <p className="text-xs text-gray-500">
                      of your posts show positive sentiment
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Engagement Rate</p>
                    <p className="font-medium text-xl">
                      {report.contentAnalysis.engagementRatio.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      average interaction per post
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Platform Distribution</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${report.usagePatterns.platformBreakdown[platform!]}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Primary platform: {platform}
                  </p>
                </div>
                
                <p className="text-sm text-gray-500">
                  {report.contentAnalysis.positiveContentRatio > 60 ?
                   "Your content creates a generally positive online presence." :
                   "Consider balancing your content with more positive expressions."}
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl">
            <h4 className="font-semibold text-lg mb-4">Personalized Recommendations</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Immediate Actions</h5>
                <ul className="space-y-2">
                  {report.recommendations.immediateActions.map((action, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Long-term Strategies</h5>
                <ul className="space-y-2">
                  {report.recommendations.longTermStrategies.map((strategy, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>{strategy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {report.recommendations.professionalHelp && report.recommendations.professionalHelp.length > 0 && (
              <div className="mt-6 bg-white dark:bg-gray-700 p-4 rounded-lg">
                <h5 className="font-medium text-red-600 dark:text-red-400 mb-2">Professional Help Suggestions</h5>
                <ul className="space-y-2">
                  {report.recommendations.professionalHelp.map((help, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>{help}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaMentalHealthAnalyzer;