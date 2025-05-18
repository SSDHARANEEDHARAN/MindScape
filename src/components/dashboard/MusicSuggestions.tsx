import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

const MOOD_MUSIC_LIBRARY = {
  happy: [
    { id: 1, title: "Happy Pop Song", artist: "Pop Artist", duration: "3:45", bpm: 120 },
    { id: 2, title: "Upbeat Dance Track", artist: "Dance Group", duration: "4:12", bpm: 128 },
    { id: 3, title: "Feel Good Anthem", artist: "Indie Band", duration: "3:30", bpm: 115 },
    { id: 4, title: "Summer Vibes", artist: "Chill Artist", duration: "3:55", bpm: 110 },
    { id: 5, title: "Positive Energy", artist: "Electronic Duo", duration: "4:20", bpm: 125 },
    { id: 6, title: "Joyful Melody", artist: "Piano Master", duration: "3:15", bpm: 100 },
    { id: 7, title: "Sunshine Rhythm", artist: "Acoustic Trio", duration: "3:40", bpm: 118 },
    { id: 8, title: "Good Mood Groove", artist: "Funk Band", duration: "4:05", bpm: 122 },
    { id: 9, title: "Happy Beats", artist: "Hip Hop Artist", duration: "3:50", bpm: 105 },
    { id: 10, title: "Euphoric Tune", artist: "EDM Producer", duration: "5:00", bpm: 130 }
  ],
  sad: [
    { id: 11, title: "Melancholic Ballad", artist: "Soul Singer", duration: "4:30", bpm: 70 },
    { id: 12, title: "Emotional Piano", artist: "Classical Pianist", duration: "3:20", bpm: 60 },
    { id: 13, title: "Heartfelt Song", artist: "Folk Artist", duration: "3:45", bpm: 75 },
    { id: 14, title: "Reflective Melody", artist: "Indie Solo", duration: "4:15", bpm: 80 },
    { id: 15, title: "Comforting Tune", artist: "Ambient Creator", duration: "5:10", bpm: 65 },
    { id: 16, title: "Healing Sounds", artist: "Therapist Musician", duration: "4:45", bpm: 72 },
    { id: 17, title: "Touching Lyrics", artist: "Storyteller", duration: "3:55", bpm: 68 },
    { id: 18, title: "Gentle Harmony", artist: "Vocal Ensemble", duration: "4:20", bpm: 78 },
    { id: 19, title: "Soothing Instrumental", artist: "Orchestra", duration: "6:00", bpm: 62 },
    { id: 20, title: "Cathartic Release", artist: "Experimental Band", duration: "4:50", bpm: 74 }
  ],
  stressed: [
    { id: 21, title: "Calming Nature Sounds", artist: "Nature Recordings", duration: "8:00", bpm: 50 },
    { id: 22, title: "Meditation Music", artist: "Zen Master", duration: "10:00", bpm: 55 },
    { id: 23, title: "Stress Relief", artist: "Therapy Sounds", duration: "7:30", bpm: 58 },
    { id: 24, title: "Peaceful Piano", artist: "Calm Pianist", duration: "5:45", bpm: 60 },
    { id: 25, title: "Anxiety Reducer", artist: "Mental Health Artist", duration: "6:15", bpm: 52 },
    { id: 26, title: "Relaxing Guitar", artist: "Acoustic Healer", duration: "4:40", bpm: 65 },
    { id: 27, title: "Tension Release", artist: "Sound Therapist", duration: "9:00", bpm: 48 },
    { id: 28, title: "Mindful Breathing", artist: "Meditation Guide", duration: "5:00", bpm: 54 },
    { id: 29, title: "Serene Atmosphere", artist: "Ambient Composer", duration: "7:00", bpm: 56 },
    { id: 30, title: "De-stress Melody", artist: "Relaxation Expert", duration: "6:30", bpm: 58 }
  ],
  neutral: [
    { id: 31, title: "Chill Background", artist: "Background Artist", duration: "4:00", bpm: 90 },
    { id: 32, title: "Easy Listening", artist: "Radio Favorite", duration: "3:50", bpm: 95 },
    { id: 33, title: "Neutral Vibes", artist: "Mood Creator", duration: "4:10", bpm: 88 },
    { id: 34, title: "Balanced Tune", artist: "Harmony Group", duration: "3:30", bpm: 92 },
    { id: 35, title: "Everyday Sound", artist: "Popular Band", duration: "4:20", bpm: 85 },
    { id: 36, title: "Casual Melody", artist: "Indie Collective", duration: "3:45", bpm: 94 },
    { id: 37, title: "Simple Pleasures", artist: "Minimalist Composer", duration: "4:15", bpm: 89 },
    { id: 38, title: "Mellow Mix", artist: "DJ Relax", duration: "5:00", bpm: 93 },
    { id: 39, title: "Gentle Flow", artist: "Smooth Operator", duration: "4:30", bpm: 87 },
    { id: 40, title: "Comfortable Rhythm", artist: "Easygoing Artist", duration: "3:55", bpm: 91 }
  ],
  focus: [
    { id: 41, title: "Deep Concentration", artist: "Focus Music", duration: "50:00", bpm: 60 },
    { id: 42, title: "Study Session", artist: "Academic Sounds", duration: "45:00", bpm: 62 },
    { id: 43, title: "Productivity Boost", artist: "Work Enhancer", duration: "30:00", bpm: 65 },
    { id: 44, title: "Flow State", artist: "Peak Performance", duration: "60:00", bpm: 58 },
    { id: 45, title: "Brain Power", artist: "Cognitive Enhancer", duration: "40:00", bpm: 63 },
    { id: 46, title: "Attention Span", artist: "Focus Helper", duration: "55:00", bpm: 59 },
    { id: 47, title: "Mental Clarity", artist: "Mind Sharpener", duration: "35:00", bpm: 64 },
    { id: 48, title: "Work Deeply", artist: "Productivity Pro", duration: "25:00", bpm: 61 },
    { id: 49, title: "Creative Flow", artist: "Idea Generator", duration: "20:00", bpm: 66 },
    { id: 50, title: "Task Master", artist: "Efficiency Expert", duration: "15:00", bpm: 67 }
  ]
};

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  bpm: number;
}

interface MoodData {
  category: string;
  percentage: number;
}

const MusicPlayerWithAI: React.FC = () => {
  const { userData } = useUser();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const analyzeMood = useCallback(() => {
    if (!userData) return [];

    let happy = 30;
    let sad = 20;
    let stressed = 25;
    let neutral = 25;

    if (userData.sleepTime) {
      if (userData.sleepTime < 5) {
        happy -= 15;
        stressed += 20;
      } else if (userData.sleepTime < 7) {
        happy -= 5;
        stressed += 10;
      } else if (userData.sleepTime > 8) {
        happy += 5;
        stressed -= 5;
      }
    }

    if (userData.screenTime) {
      if (userData.screenTime > 6) {
        happy -= 10;
        stressed += 15;
      } else if (userData.screenTime > 4) {
        happy -= 5;
        stressed += 5;
      }
    }

    if (userData.age) {
      if (userData.age < 25) {
        happy += 5;
        sad += 5;
      } else if (userData.age > 40) {
        stressed += 5;
        neutral += 5;
      }
    }

    happy = Math.max(0, Math.min(100, happy));
    sad = Math.max(0, Math.min(100, sad));
    stressed = Math.max(0, Math.min(100, stressed));
    neutral = Math.max(0, Math.min(100, neutral));

    const total = happy + sad + stressed + neutral;
    happy = Math.round((happy / total) * 100);
    sad = Math.round((sad / total) * 100);
    stressed = Math.round((stressed / total) * 100);
    neutral = 100 - happy - sad - stressed;

    return [
      { category: 'happy', percentage: happy },
      { category: 'sad', percentage: sad },
      { category: 'stressed', percentage: stressed },
      { category: 'neutral', percentage: neutral }
    ];
  }, [userData]);

  const getRecommendedSongs = useCallback(async (moodData: MoodData[]) => {
    setIsLoading(true);
    try {
      const primaryMood = moodData.reduce((prev, current) => 
        (prev.percentage > current.percentage) ? prev : current
      ).category;

      const focusMode = userData?.sleepTime && userData.sleepTime >= 8;
      let songs: Song[] = focusMode 
        ? [...MOOD_MUSIC_LIBRARY.focus] 
        : [...MOOD_MUSIC_LIBRARY[primaryMood as keyof typeof MOOD_MUSIC_LIBRARY]];

      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBy0KCb5kFziYZC5gXkFgB3mXEmMzsatTE`;
      
      const prompt = `Based on mood analysis:
      Happy: ${moodData.find(m => m.category === 'happy')?.percentage}%
      Sad: ${moodData.find(m => m.category === 'sad')?.percentage}%
      Stressed: ${moodData.find(m => m.category === 'stressed')?.percentage}%
      Neutral: ${moodData.find(m => m.category === 'neutral')?.percentage}%
      ${focusMode ? 'Focus Mode: Activated' : ''}

      Songs for ${primaryMood} mood:
      ${songs.map(s => `${s.title} by ${s.artist} (${s.bpm}BPM)`).join('\n')}

      Please:
      1. Select top 3 most appropriate songs
      2. Provide explanation for each
      3. Suggest best time to play each

      Return JSON with: songIds, explanations, and bestTimes.`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 1000
          }
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      try {
        const parsedResponse = JSON.parse(responseText);
        const recommendedSongIds = parsedResponse.songIds || [];
        const explanations = parsedResponse.explanations || [];
        const bestTimes = parsedResponse.bestTimes || [];

        const recommendedSongs = recommendedSongIds
          .map((id: number) => songs.find(s => s.id === id))
          .filter(Boolean) as Song[];

        let explanationText = `Based on your ${primaryMood} mood ${focusMode ? 'with focus mode' : ''}:\n\n`;
        recommendedSongs.forEach((song, index) => {
          explanationText += `• ${song.title} by ${song.artist}\n`;
          explanationText += `  Best time: ${bestTimes[index] || 'anytime'}\n`;
          explanationText += `  Why: ${explanations[index] || 'Perfect for your current state'}\n\n`;
        });

        setCurrentSong(recommendedSongs[0] || null);
        setExplanation(explanationText);
      } catch (e) {
        console.error('Failed to parse AI response', e);
        setCurrentSong(songs[0] || null);
        setExplanation(`Playing ${primaryMood} ${focusMode ? 'focus' : ''} music for you.`);
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      const primaryMood = moodData.reduce((prev, current) => 
        (prev.percentage > current.percentage) ? prev : current
      ).category;
      const focusMode = userData?.sleepTime && userData.sleepTime >= 8;
      const songs = focusMode 
        ? [...MOOD_MUSIC_LIBRARY.focus] 
        : [...MOOD_MUSIC_LIBRARY[primaryMood as keyof typeof MOOD_MUSIC_LIBRARY]];
      
      setCurrentSong(songs[0] || null);
      setExplanation(`Playing ${focusMode ? 'focus' : primaryMood} music (AI service unavailable)`);
    } finally {
      setIsLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    const moodData = analyzeMood();
    if (moodData.length > 0) {
      getRecommendedSongs(moodData);
    }
  }, [analyzeMood, getRecommendedSongs]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextSong = () => {
    if (!currentSong) return;
    // In this simplified version, we'll just get new recommendations
    const moodData = analyzeMood();
    getRecommendedSongs(moodData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        AI Music Companion
      </h2>

      {/* Music Player */}
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 mb-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : currentSong ? (
          <>
            <div className="flex items-center mb-6">
              <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-lg mr-4">
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
                ) : (
                  <Play className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {currentSong.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {currentSong.artist} • {currentSong.duration} • {currentSong.bpm}BPM
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={nextSong}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <SkipBack className="h-6 w-6" />
                </button>
                <button
                  onClick={togglePlay}
                  className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </button>
                <button
                  onClick={nextSong}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <SkipForward className="h-6 w-6" />
                </button>
              </div>

              <div className="flex items-center">
                <Volume2 className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-24 accent-indigo-600"
                />
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>0:00</span>
              <span>{currentSong.duration}</span>
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            Analyzing your mood and selecting perfect music...
          </div>
        )}
      </div>

      {/* AI Explanation */}
      {explanation && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-indigo-800 dark:text-indigo-300">
            AI Music Recommendation
          </h4>
          <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default MusicPlayerWithAI;