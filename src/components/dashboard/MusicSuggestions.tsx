/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react';

// Importing audio files from the components folder or other folder inside src
import goodVibes from '../music/Khadgam - Love Failure BGM.mp3';
import sunnyDays from '../music/Khadgam - Love Failure BGM.mp3';

interface MusicSuggestionsProps {
  currentMood?: 'happy' | 'sad' | 'stressed' | 'neutral' | 'relaxed';
}

const MusicSuggestions: React.FC<MusicSuggestionsProps> = ({ currentMood = 'neutral' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);


  const suggestions = [
    // Happy Mood Songs
    {
      title: "Good Vibes",
      artist: "Happy Tunes",
      mood: "happy",
      duration: "3:45",
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      musicUrl: goodVibes,
    },
    {
      title: "Sunny Days",
      artist: "Summer Beats",
      mood: "happy",
      duration: "3:20",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      musicUrl: sunnyDays, 
    },
    
  ];

  // Filter suggestions based on current mood and limit to 5 songs
  const filteredSuggestions = suggestions
    .filter(song => song.mood === currentMood)
    .slice(0, 5); // Limit to 5 songs

  // Handle play/pause functionality
  const togglePlay = (index: number) => {
    if (currentTrack === index && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      setCurrentTrack(index);
      setIsPlaying(true);
    }
  };

  // Handle next track functionality
  const nextTrack = () => {
    if (currentTrack === null) return;

    const nextIndex = (currentTrack + 1) % filteredSuggestions.length;
    setCurrentTrack(nextIndex);
    setIsPlaying(true);
  };

  // Handle mute/unmute functionality
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Update audio source when currentTrack changes
  useEffect(() => {
    if (audioRef.current && currentTrack !== null) {
      audioRef.current.src = filteredSuggestions[currentTrack].musicUrl;
      audioRef.current.load(); // Load the new source
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          console.error("Autoplay failed. User interaction is required.");
        });
      }
    }
  }, [currentTrack, isPlaying]);

  // Get mood emoji
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'sad': return '😔';
      case 'stressed': return '😟';
      case 'relaxed': return '😌';
      default: return '😐';
    }
  };

  // Update current time and duration of the audio
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  // Format time to mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Music className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
        Music Recommendations
      </h2>

      <div className="mb-4 bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg">
        <p className="text-sm">
          <span className="font-medium">Current Mood:</span> {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)} {getMoodEmoji(currentMood)}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          Music suggestions tailored to your current emotional state
        </p>
      </div>

      <div className="space-y-3">
        {filteredSuggestions.map((song, index) => (
          <div
            key={index}
            className={`flex items-center p-2 rounded-lg ${currentTrack === index
              ? 'bg-indigo-50 dark:bg-indigo-900/30'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
              <img
                src={song.imageUrl}
                alt={song.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="font-medium text-sm">{song.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{song.artist}</p>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mr-2">
              {song.duration}
            </div>
            <button
              onClick={() => togglePlay(index)}
              className={`p-2 rounded-full ${currentTrack === index && isPlaying
                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              {currentTrack === index && isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>
          </div>
        ))}
      </div>

      {currentTrack !== null && (
        <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <p className="font-medium text-sm truncate">{filteredSuggestions[currentTrack].title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{filteredSuggestions[currentTrack].artist}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => togglePlay(currentTrack)}
                className="p-1.5 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={nextTrack}
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
            <div
              className="bg-indigo-600 h-1 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(currentTime)}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* Audio element for playback */}
      <audio
        ref={audioRef}
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        preload="auto"
      />
    </div>
  );
};

export default MusicSuggestions;
