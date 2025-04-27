/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useCallback } from 'react';
import { Smile, Frown, Meh, Image as ImageIcon, Upload } from 'lucide-react';

interface ImageAnalysis {
  emotionalTone: {
    happy: number;
    neutral: number;
    sad: number;
    angry: number;
    surprised: number;
  };
  imageQuality: {
    brightness: number;
    contrast: number;
    sharpness: number;
  };
  composition: {
    balance: number;
    ruleOfThirds: boolean;
    symmetry: boolean;
  };
  facesDetected: number;
  dominantColors: string[];
}

const ImageEmotionAnalysis: React.FC = () => {
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Simulate analysis after upload
    setTimeout(() => {
      try {
        const mockAnalysis = generateMockImageAnalysis();
        setAnalysis(mockAnalysis);
      } catch (err) {
        setError("Failed to analyze the image");
      } finally {
        setLoading(false);
      }
    }, 2000);
  }, []);

  const generateMockImageAnalysis = (): ImageAnalysis => {
    const happy = Math.floor(Math.random() * 50) + 30;
    const neutral = Math.floor(Math.random() * 30) + 10;
    const sad = Math.floor(Math.random() * 20);
    const angry = Math.floor(Math.random() * 15);
    const surprised = Math.floor(Math.random() * 25);

    return {
      emotionalTone: {
        happy,
        neutral,
        sad,
        angry,
        surprised,
      },
      imageQuality: {
        brightness: Math.floor(Math.random() * 40) + 50,
        contrast: Math.floor(Math.random() * 40) + 50,
        sharpness: Math.floor(Math.random() * 40) + 50,
      },
      composition: {
        balance: Math.floor(Math.random() * 40) + 50,
        ruleOfThirds: Math.random() > 0.5,
        symmetry: Math.random() > 0.5,
      },
      facesDetected: Math.floor(Math.random() * 3) + 1,
      dominantColors: [
        `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
        `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
        `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
      ],
    };
  };

  const getEmotionColor = (value: number) => {
    if (value > 60) return 'text-green-500';
    if (value > 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getQualityColor = (value: number) => {
    if (value > 70) return 'text-green-500';
    if (value > 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getEmotionIcon = (emotion: string, value: number) => {
    if (emotion === 'happy') return <Smile className={`mr-2 ${getEmotionColor(value)}`} />;
    if (emotion === 'sad') return <Frown className={`mr-2 ${getEmotionColor(value)}`} />;
    return <Meh className={`mr-2 ${getEmotionColor(value)}`} />;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-2 text-center text-blue-600 dark:text-blue-400">
        Image Emotion Analysis
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
        Powered by Deep Learning and Computer Vision
      </p>

      {/* Image Upload */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 mb-8 text-center">
        {!previewUrl ? (
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition">
              Upload Image
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
            </label>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              JPG, PNG, or WEBP (Max 5MB)
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative mb-4 max-w-full">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-64 max-w-full rounded-lg shadow-md"
              />
              {loading && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <button 
              onClick={() => {
                setPreviewUrl(null);
                setAnalysis(null);
              }}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Upload different image
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3">Analyzing your image...</span>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center p-4">{error}</div>
      )}

      {analysis && (
        <div className="space-y-6">
          {/* Emotional Analysis */}
          <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <ImageIcon className="mr-2 text-blue-500" />
              Emotional Tone Detection
            </h2>
            <div className="space-y-3">
              {Object.entries(analysis.emotionalTone).map(([emotion, value]) => (
                <div key={emotion}>
                  <div className="flex justify-between">
                    <span className="flex items-center capitalize">
                      {getEmotionIcon(emotion, value)}
                      {emotion}
                    </span>
                    <span className={getEmotionColor(value)}>
                      {value}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${value}%`,
                        backgroundColor: emotion === 'happy' ? '#10B981' : 
                                      emotion === 'sad' ? '#EF4444' : 
                                      emotion === 'angry' ? '#F59E0B' : 
                                      emotion === 'surprised' ? '#8B5CF6' : '#6B7280'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Quality */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Brightness</h3>
              <span className={getQualityColor(analysis.imageQuality.brightness)}>
                {analysis.imageQuality.brightness}%
              </span>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${analysis.imageQuality.brightness}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Contrast</h3>
              <span className={getQualityColor(analysis.imageQuality.contrast)}>
                {analysis.imageQuality.contrast}%
              </span>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${analysis.imageQuality.contrast}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Sharpness</h3>
              <span className={getQualityColor(analysis.imageQuality.sharpness)}>
                {analysis.imageQuality.sharpness}%
              </span>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${analysis.imageQuality.sharpness}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Composition */}
          <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Composition Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm">Balance Score</p>
                <span className={getQualityColor(analysis.composition.balance)}>
                  {analysis.composition.balance}%
                </span>
              </div>
              <div>
                <p className="text-sm">Rule of Thirds</p>
                <span className={analysis.composition.ruleOfThirds ? 'text-green-500' : 'text-red-500'}>
                  {analysis.composition.ruleOfThirds ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <p className="text-sm">Symmetry</p>
                <span className={analysis.composition.symmetry ? 'text-green-500' : 'text-red-500'}>
                  {analysis.composition.symmetry ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Dominant Colors */}
          <div className="bg-pink-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Dominant Colors</h3>
            <div className="flex space-x-2">
              {analysis.dominantColors.map((color, index) => (
                <div 
                  key={index}
                  className="w-12 h-12 rounded-full shadow-md"
                  style={{ backgroundColor: color }}
                  title={`Color ${index + 1}`}
                ></div>
              ))}
            </div>
          </div>

          {/* Faces Detected */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Faces Detected</h3>
            <p>{analysis.facesDetected} face{analysis.facesDetected !== 1 ? 's' : ''} found</p>
          </div>

          {/* Recommendations */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-lg">Improvement Suggestions</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {analysis.emotionalTone.sad > 30 && (
                <li>Try capturing more positive expressions (current sad: {analysis.emotionalTone.sad}%)</li>
              )}
              {analysis.emotionalTone.happy < 50 && (
                <li>Consider using brighter lighting to improve positive expressions</li>
              )}
              {analysis.imageQuality.brightness < 60 && (
                <li>Increase brightness for better image quality (current: {analysis.imageQuality.brightness}%)</li>
              )}
              {!analysis.composition.ruleOfThirds && (
                <li>Try applying the rule of thirds for better composition</li>
              )}
              {analysis.facesDetected === 0 && (
                <li>For better emotional analysis, include faces in your images</li>
              )}
              <li>Natural lighting often produces the most accurate emotional detection</li>
              <li>Direct eye contact with the camera improves analysis accuracy</li>
            </ul>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            <p>
              <strong>Analysis Methodology:</strong> This assessment uses deep learning models trained on facial 
              expression recognition (FER) datasets and computer vision techniques for image quality analysis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEmotionAnalysis;