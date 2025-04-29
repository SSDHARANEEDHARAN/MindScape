import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';

interface HealthInsight {
  category: string;
  score: number;
  recommendation: string;
  improvementTip?: string;  // Added specific field for improvement tips
  needsImprovement?: boolean;
}

const HealthMetricsDashboard: React.FC = () => {
  const { userData } = useUser();
  const [metrics, setMetrics] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateHealthMetrics = (): HealthInsight[] => {
      if (!userData) return [];

      // Calculate BMI and sleep score
      const bmi = userData.weight / ((userData.height / 100) ** 2);
      const sleepScore = Math.min(100, (userData.sleepTime / 8) * 100);
      
      // Physical health data
      const physicalScore = bmi < 18.5 ? 60 : bmi < 25 ? 90 : bmi < 30 ? 70 : 50;
      const physicalNeedsImprovement = physicalScore < 70;
      const physicalRec = physicalNeedsImprovement
        ? `Your BMI is ${bmi.toFixed(1)} which is ${bmi < 18.5 ? 'below' : 'above'} the healthy range.`
        : 'Your physical health is in good condition!';
      const physicalTip = physicalNeedsImprovement
        ? `Action: ${bmi < 18.5 ? 'Increase calorie intake' : 'Increase physical activity'} and ${bmi < 18.5 ? 'strength training' : 'balanced diet'}.`
        : '';

      // Sleep health data
      const sleepNeedsImprovement = sleepScore < 70;
      const sleepRec = sleepNeedsImprovement
        ? `You're getting ${userData.sleepTime} hours of sleep (recommended: 7-9 hours).`
        : 'Your sleep duration is excellent!';
      const sleepTip = sleepNeedsImprovement
        ? `Action: Try to sleep ${8 - userData.sleepTime} more hours and reduce screen time before bed.`
        : '';

      return [
        { 
          category: 'Physical Health', 
          score: physicalScore, 
          recommendation: physicalRec,
          improvementTip: physicalTip,
          needsImprovement: physicalNeedsImprovement
        },
        { 
          category: 'Sleep Quality', 
          score: Math.round(sleepScore),
          recommendation: sleepRec,
          improvementTip: sleepTip,
          needsImprovement: sleepNeedsImprovement
        }
      ];
    };

    // Simulate data loading
    const timer = setTimeout(() => {
      setMetrics(calculateHealthMetrics());
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [userData]);

  const getScoreColor = (score: number) => 
    score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444';

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Health Insights</h2>
      
      <div className="space-y-3">
        {metrics.map((metric) => (
          <div key={metric.category} className="border rounded-lg p-3">
            <div className="flex items-center">
              <div className="relative w-14 h-14 mr-3">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                  <circle cx="50" cy="50" r="40" fill="none" 
                    stroke={getScoreColor(metric.score)} strokeWidth="8"
                    strokeDasharray={`${metric.score * 2.51}, 251`}
                    transform="rotate(-90 50 50)"/>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" 
                  style={{ color: getScoreColor(metric.score) }}>
                  {metric.score}%
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{metric.category}</h3>
                <p className="text-sm text-gray-600">{metric.recommendation}</p>
              </div>
            </div>
            
            {metric.needsImprovement && metric.improvementTip && (
              <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                <p className="font-medium text-blue-800">Improvement Tip:</p>
                <p className="text-gray-700">{metric.improvementTip}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthMetricsDashboard;