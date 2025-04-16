import React, { useState, useEffect, useRef } from 'react';
import { 
  Watch, Send, MessageSquare, X, Battery, Wifi, Activity, 
  Image as ImageIcon, Settings, Volume2 as VolumeIcon, ChevronLeft, 
  ChevronRight, Power, Heart, Sun, Moon, Clock, Music, 
  Home, Zap, SunDim
} from 'lucide-react';

function Watchs() {
  // State declarations
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showFullMessage, setShowFullMessage] = useState(false);
  const [sentMessage, setSentMessage] = useState('');
  const [time, setTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isWifiConnected, setIsWifiConnected] = useState(true);
  const [volume, setVolume] = useState(50);
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const [currentView, setCurrentView] = useState('main');
  const [customBackground, setCustomBackground] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [heartRate, setHeartRate] = useState(72);
  const [steps, setSteps] = useState(4582);
  const [charging, setCharging] = useState(false);
  const [showChargingAnimation, setShowChargingAnimation] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [brightness, setBrightness] = useState(80);
  const [selectedTone, setSelectedTone] = useState('default');
  const [showHeartRate, setShowHeartRate] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notificationStyle, setNotificationStyle] = useState('modern');

  // Notification styles
  const notificationStyles = {
    default: 'bg-gradient-to-r from-blue-600 to-blue-500',
    minimal: 'bg-gray-800/80 border border-gray-700',
    colorful: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500',
    modern: 'bg-white/10 backdrop-blur-md border border-white/20',
    retro: 'bg-amber-500/90 border-2 border-amber-300',
    glass: 'bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg',
    neon: 'bg-black border border-cyan-400 shadow-[0_0_10px_#00f7ff]'
  };

  // Notification tones
  const notificationTones = {
    default: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
    chime: 'https://assets.mixkit.co/active_storage/sfx/2108/2108-preview.mp3',
    beep: 'https://assets.mixkit.co/active_storage/sfx/247/247-preview.mp3',
    alert: 'https://assets.mixkit.co/active_storage/sfx/2695/2695-preview.mp3'
  };

  const apps = [
    { name: 'Messages', icon: MessageSquare, color: 'text-blue-400' },
    { name: 'Health', icon: Heart, color: 'text-red-400' },
    { name: 'Music', icon: Music, color: 'text-purple-400' },
    { name: 'Alarms', icon: Clock, color: 'text-yellow-400' },
    { name: 'Settings', icon: Settings, color: 'text-gray-400' },
    { name: 'Gallery', icon: ImageIcon, color: 'text-green-400' },
  ];

  // Simulate system connection
  useEffect(() => {
    const handleSystemCharge = () => {
      setCharging(true);
      setShowChargingAnimation(true);
      setTimeout(() => setShowChargingAnimation(false), 2000);
    };

    window.addEventListener('system-charge', handleSystemCharge);
    return () => window.removeEventListener('system-charge', handleSystemCharge);
  }, []);

  // Time update
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (now.getSeconds() !== time.getSeconds()) {
        setTime(now);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [time]);

  // System monitoring
  useEffect(() => {
    if (!isPoweredOn) return;
    
    const interval = setInterval(() => {
      setIsWifiConnected(navigator.onLine);
      setBatteryLevel(prev => {
        const newLevel = charging 
          ? Math.min(100, prev + 2) 
          : Math.max(0, prev - (Math.random() * 0.5));
        return parseFloat(newLevel.toFixed(1));
      });
      
      if (showHeartRate) {
        setHeartRate(prev => Math.max(60, Math.min(120, prev + (Math.random() > 0.5 ? 1 : -1))));
      }
      
      setSteps(prev => {
        const newSteps = prev + Math.floor(Math.random() * 3);
        return newSteps > 10000 ? 0 : newSteps;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isPoweredOn, charging, showHeartRate]);

  // Handle message submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isPoweredOn) return;

    setSentMessage(message);
    setIsAnimating(true);
    setShowNotification(false);
    setShowFullMessage(false);
    setNotificationCount(prev => prev + 1);

    const audio = new Audio(notificationTones[selectedTone as keyof typeof notificationTones]);
    audio.volume = volume / 100;
    audio.play().catch(e => console.log("Audio play failed:", e));

    setTimeout(() => {
      setShowNotification(true);
      setTimeout(() => {
        setIsAnimating(false);
        setMessage('');
      }, 2000);
    }, 1000);
  };

  // Handle image upload for wallpaper
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomBackground(e.target?.result as string);
        setCurrentView('main');
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle views
  const goToView = (view: string) => {
    setCurrentView(view);
  };

  // Toggle power function
  const togglePower = () => {
    if (!isPoweredOn) {
      setShowChargingAnimation(true);
      setTimeout(() => setShowChargingAnimation(false), 2000);
    }
    setIsPoweredOn(prev => !prev);
  };

  // Watch content based on current view
  const getWatchContent = () => {
    if (!isPoweredOn) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="relative">
            <Power className="w-16 h-16 text-gray-600" />
            {showChargingAnimation && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></div>
                <Zap className="w-8 h-8 text-blue-400 animate-bounce" />
              </div>
            )}
          </div>
          <p className="text-gray-500 mt-4 text-center">
            {charging ? 'Charging...' : 'Powered off'}
            <br />
            {charging && `${batteryLevel}%`}
          </p>
        </div>
      );
    }

    switch (currentView) {
      case 'settings':
        return (
          <div className={`flex-1 p-4 ${isDarkMode ? 'bg-gray-900/90' : 'bg-white/90'}`}>
            <h3 className={`text-sm mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Settings size={14} />
              Settings
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className={`text-xs flex items-center justify-between ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span>Volume</span>
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{volume}%</span>
                </label>
                <div className="flex items-center gap-2">
                  <VolumeIcon size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Theme</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsDarkMode(true)}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1 text-xs
                      ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    <Moon size={12} /> Dark
                  </button>
                  <button
                    onClick={() => setIsDarkMode(false)}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1 text-xs
                      ${!isDarkMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    <Sun size={12} /> Light
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Notification Style</label>
                <select
                  value={notificationStyle}
                  onChange={(e) => setNotificationStyle(e.target.value)}
                  className={`w-full text-xs p-2 rounded-lg border ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
                >
                  {Object.keys(notificationStyles).map(style => (
                    <option key={style} value={style}>
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Notification Tone</label>
                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value)}
                  className={`w-full text-xs p-2 rounded-lg border ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
                >
                  {Object.keys(notificationTones).map(tone => (
                    <option key={tone} value={tone}>
                      {tone.charAt(0).toUpperCase() + tone.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 'health':
        return (
          <div className={`flex-1 p-4 ${isDarkMode ? 'bg-gray-900/90' : 'bg-white/90'}`}>
            <h3 className={`text-sm mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Heart size={14} className="text-red-400" />
              Health Stats
            </h3>
            <div className="space-y-4">
              <button 
                onClick={() => setShowHeartRate(!showHeartRate)}
                className={`w-full p-3 rounded-xl flex flex-col items-center ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-200'}`}
              >
                <div className="flex items-center gap-2">
                  <Heart size={16} className="text-red-400" />
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Heart Rate Monitor</span>
                </div>
                {showHeartRate && (
                  <div className="mt-2 text-2xl font-bold text-red-400">
                    {heartRate} <span className="text-sm">BPM</span>
                  </div>
                )}
              </button>
              
              <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Steps Today</div>
                  <div className="text-blue-400 text-sm font-medium">{steps.toLocaleString()}</div>
                </div>
                <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"
                    style={{ width: `${Math.min(100, (steps / 10000) * 100)}%` }}
                  />
                </div>
                <div className="text-right text-gray-500 text-xs mt-1">
                  Goal: 10,000 steps
                </div>
              </div>
            </div>
          </div>
        );

      case 'apps':
        return (
          <div className={`flex-1 p-4 ${isDarkMode ? 'bg-gray-900/90' : 'bg-white/90'}`}>
            <h3 className={`text-sm mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Home size={14} />
              Apps
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {apps.map((app, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (app.name === 'Settings') goToView('settings');
                    if (app.name === 'Health') goToView('health');
                    if (app.name === 'Gallery') fileInputRef.current?.click();
                  }}
                  className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${app.color} bg-opacity-20`}>
                    <app.icon size={16} />
                  </div>
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{app.name}</span>
                </button>
              ))}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        );

      default:
        return (
          <div 
            className="relative flex-1 flex flex-col items-center justify-center"
            style={customBackground ? {
              backgroundImage: `url(${customBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            } : undefined}
          >
            {/* Time and date display */}
            <div className={`text-center mb-4 px-4 py-2 rounded-2xl ${customBackground ? 'bg-black/30 backdrop-blur-sm' : ''}`}>
              <div className={`text-3xl font-light ${customBackground ? 'text-white' : 'text-gray-900'}`}>
                {time.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </div>
              <div className={`text-sm ${customBackground ? 'text-gray-300' : 'text-gray-600'}`}>
                {time.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>

            {/* Watch icon with animation */}
            <Watch
              className={`w-20 h-20 ${customBackground ? 'text-white' : 'text-blue-600'} transition-all duration-500
                ${isAnimating ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}
                ${customBackground ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'drop-shadow-[0_0_8px_rgba(37,99,235,0.3)]'}`}
            />

            {/* Notification */}
            {showNotification && (
              <button
                onClick={() => {
                  setShowFullMessage(true);
                  setShowNotification(false);
                }}
                className={`absolute top-1/3 left-1/2 transform -translate-x-1/2 
                  ${notificationStyles[notificationStyle as keyof typeof notificationStyles]}
                  px-4 py-2 rounded-2xl text-sm animate-bounce 
                  shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 
                  active:scale-95 flex items-center gap-2 backdrop-blur-sm`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-white">New Message</span>
                {notificationCount > 1 && (
                  <span className="bg-white/20 rounded-full px-1.5 text-xs text-white">{notificationCount}</span>
                )}
              </button>
            )}

            {/* Status bar */}
            <div className={`absolute bottom-4 left-0 right-0 px-4 flex justify-between items-center text-xs
              ${customBackground ? 'text-white' : 'text-gray-900'}`}>
              <div className="flex items-center gap-1">
                <Wifi
                  size={12}
                  className={isWifiConnected ? (customBackground ? 'text-green-300' : 'text-green-600') : 'text-red-400'} 
                />
                {isWifiConnected && <span>{customBackground ? 'WiFi' : 'Connected'}</span>}
              </div>
              <div className="flex items-center gap-1">
                {charging && (
                  <Zap 
                    size={12} 
                    className={customBackground ? 'text-yellow-300' : 'text-yellow-600'} 
                  />
                )}
                <Battery
                  size={14}
                  className={`${
                    batteryLevel > 60 ? (customBackground ? 'text-green-300' : 'text-green-600') :
                    batteryLevel > 20 ? (customBackground ? 'text-yellow-300' : 'text-yellow-600') :
                    'text-red-400'
                  }`}
                />
                <span>{batteryLevel}%</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            AI Smart Watch
          </h1>
          <p className="text-gray-600">Experience the future of communication</p>
        </div>

        {/* Watch container */}
        <div className="relative flex justify-center my-12">
          <div className={`relative w-64 h-72 rounded-[2.5rem] border-[14px] border-gray-300 
            bg-white ${isAnimating ? 'animate-pulse' : ''} 
            shadow-[0_0_50px_rgba(0,0,100,0.1)] transition-all duration-500
            ${!isPoweredOn ? 'opacity-75' : ''}`}
          >
            {/* Watch face */}
            <div className={`absolute inset-0 rounded-[1.8rem] flex flex-col overflow-hidden transition-colors duration-500
              ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
              
              {/* Status bar */}
              <div className={`flex justify-between items-center px-4 py-2 text-xs ${isDarkMode ? 'text-gray-400 bg-gray-800/50' : 'text-gray-600 bg-white/50'} backdrop-blur-sm`}>
                <div className="flex items-center gap-1">
                  <Wifi
                    size={12}
                    className={isWifiConnected ? (isDarkMode ? 'text-green-400' : 'text-green-600') : 'text-red-400'} 
                  />
                  <Activity size={12} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                </div>
                <div className="flex items-center gap-2">
                  {charging && (
                    <Zap 
                      size={12} 
                      className={isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} 
                    />
                  )}
                  <Battery
                    size={14}
                    className={`${
                      batteryLevel > 60 ? (isDarkMode ? 'text-green-400' : 'text-green-600') :
                      batteryLevel > 20 ? (isDarkMode ? 'text-yellow-400' : 'text-yellow-600') :
                      'text-red-400'
                    }`}
                  />
                  <span>{batteryLevel}%</span>
                </div>
              </div>

              {/* Main watch content */}
              {getWatchContent()}

              {/* Full message view */}
              {showFullMessage && (
                <div className={`absolute inset-0 p-4 flex flex-col animate-fade-in ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={`font-semibold flex items-center gap-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      <MessageSquare size={16} />
                      Message
                    </h3>
                    <button
                      onClick={() => setShowFullMessage(false)}
                      className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className={`flex-1 rounded-2xl p-4 border ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-100 border-gray-300/50'}`}>
                    <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{sentMessage}</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setShowFullMessage(false)}
                      className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* Control panel */}
              {showControlPanel && (
                <div className={`absolute bottom-0 left-0 right-0 p-4 rounded-t-2xl backdrop-blur-lg ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'}`}>
                  <div className="flex justify-center mb-2">
                    <div className="w-8 h-1 rounded-full bg-gray-500"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <SunDim size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={brightness}
                        onChange={(e) => setBrightness(parseInt(e.target.value))}
                        className="flex-1 mx-4"
                      />
                      <span className={`text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{brightness}%</span>
                    </div>
                    <button 
                      onClick={() => {
                        setCurrentView('settings');
                        setShowControlPanel(false);
                      }}
                      className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`}
                    >
                      <Settings size={14} />
                      <span>Settings</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Watch physical buttons */}
            <div className="absolute -right-[16px] top-1/4 h-10 w-2 bg-gray-300 rounded-r"></div>
            <div className="absolute -right-[16px] top-2/4 h-10 w-2 bg-gray-300 rounded-r"></div>

            {/* Power button */}
            <button
              onClick={togglePower}
              className={`absolute -right-[20px] top-1/3 w-4 h-8 rounded-r-lg cursor-pointer transition-colors
                ${isPoweredOn ? 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-300 hover:to-gray-400' 
                  : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500'}`}
            />

            {/* Navigation buttons - replaced with direct view switching */}
            <button
              onClick={() => goToView('health')}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 transition-colors
                text-gray-500 hover:text-black`}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => goToView('apps')}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 transition-colors
                text-gray-500 hover:text-black`}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Hand animation */}
          <div className={`absolute bottom-0 right-0 transform translate-x-8 translate-y-8
            ${isAnimating ? 'animate-wave' : ''}`}>
            <div className="w-32 h-40 bg-gradient-to-br from-[#FFE0BD] to-[#FFD1A1] rounded-full relative shadow-lg">
              <div className="absolute bottom-0 right-0 w-full h-3/4 
                bg-gradient-to-r from-[#FFE0BD] to-[#FFD1A1] rounded-full">
                <div className="absolute -left-4 top-1/2 w-10 h-20 
                  bg-gradient-to-l from-gray-800 to-gray-700 rounded-l-xl transform -translate-y-1/2
                  shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Control form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="rounded-lg shadow-sm">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 
                placeholder-gray-500 rounded-2xl focus:outline-none focus:ring-2 
                transition-all duration-300 focus:shadow-[0_0_20px_rgba(59,130,246,0.2)]
                bg-white/70 text-gray-900 focus:ring-blue-400/50 focus:border-blue-400/50"
              rows={4}
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!isPoweredOn}
              className="group relative flex-1 flex justify-center py-3 px-4 
                text-sm font-medium rounded-2xl text-white overflow-hidden
                bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-500 
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 
                transition-all duration-300 shadow-lg shadow-blue-400/30 hover:shadow-blue-400/50
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 mr-2" />
              Send to Watch
            </button>
            <button
              type="button"
              onClick={() => goToView('health')}
              className="p-3 rounded-2xl flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-red-600 transition-colors"
            >
              <Heart size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* Swipe area for control panel */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-20"
        onTouchStart={(e) => {
          const startY = e.touches[0].clientY;
          const handleTouchMove = (moveEvent: TouchEvent) => {
            const currentY = moveEvent.touches[0].clientY;
            if (currentY - startY > 50) {
              setShowControlPanel(true);
              document.removeEventListener('touchmove', handleTouchMove);
            }
          };
          document.addEventListener('touchmove', handleTouchMove);
          document.addEventListener('touchend', () => {
            document.removeEventListener('touchmove', handleTouchMove);
          }, { once: true });
        }}
      ></div>
    </div>
  );
}

export default Watchs;