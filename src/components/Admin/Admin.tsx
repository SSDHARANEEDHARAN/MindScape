import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Device,
  Message,
  SignalStage,
  MessageMode,
  SystemDevice,
  DeviceType,
  ConnectionStatus,
  HealthStatus,
  Diagnostic
} from '../Admin/Components/types';
import { DeviceCard } from '../Admin/Components/DeviceCard';
import { MessageInput } from '../Admin/Components/MessageInput';
import { SignalFlow } from '../Admin/Components/SignalFlow';
import { DisplayPreview } from '../Admin/Components/DisplayPreview';
import { SystemConfig } from '../Admin/Components/SystemConfig';
import { Activity, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fix NodeJS namespace error
declare global {
  interface NodeJS {
    Timeout: ReturnType<typeof setTimeout>;
  }
}

interface AdminProps {
  darkMode: boolean;
}

const Admin: React.FC<AdminProps> = ({ darkMode }) => {
  const [manualMessages, setManualMessages] = useState<Message[]>([]);
  const [autoMessages, setAutoMessages] = useState<Message[]>([]);
  const [currentStage, setCurrentStage] = useState<SignalStage>('WAITING');
  const [messageMode, setMessageMode] = useState<MessageMode>('MANUAL');
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [connectedDevices, setConnectedDevices] = useState<SystemDevice[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [passkey, setPasskey] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const autoIntervalRef = useRef<NodeJS["Timeout"] | null>(null);

  // Check for existing auth on initial load
  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth) {
      const { isAuthenticated: savedAuthState, username: savedUsername } = JSON.parse(savedAuth);
      if (savedAuthState && savedUsername === '12345') {
        setIsAuthenticated(true);
        setUsername(savedUsername);
      }
    }
  }, []);

  // Load saved state when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const savedState = localStorage.getItem('adminState');
      if (savedState) {
        const {
          manualMessages: savedManualMessages,
          autoMessages: savedAutoMessages,
          currentStage: savedCurrentStage,
          messageMode: savedMessageMode,
          currentMessage: savedCurrentMessage,
          connectedDevices: savedConnectedDevices
        } = JSON.parse(savedState);
        
        setManualMessages(savedManualMessages || []);
        setAutoMessages(savedAutoMessages || []);
        setCurrentStage(savedCurrentStage || 'WAITING');
        setMessageMode(savedMessageMode || 'MANUAL');
        setCurrentMessage(savedCurrentMessage || '');
        setConnectedDevices(savedConnectedDevices || []);
      }
    }
  }, [isAuthenticated]);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (isAuthenticated) {
      const stateToSave = {
        manualMessages,
        autoMessages,
        currentStage,
        messageMode,
        currentMessage,
        connectedDevices
      };
      localStorage.setItem('adminState', JSON.stringify(stateToSave));
    }
  }, [manualMessages, autoMessages, currentStage, messageMode, currentMessage, connectedDevices, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Admin' && passkey === 'Sathiya') {
      setIsAuthenticated(true);
      setAuthError('');
      // Save auth state to localStorage
      localStorage.setItem('adminAuth', JSON.stringify({
        isAuthenticated: true,
        username: 'Admin'
      }));
    } else {
      setAuthError('Invalid username or passkey');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPasskey('');
    // Clear auth from localStorage but keep the data
    localStorage.removeItem('adminAuth');
  };

  const simulateMessageFlow = async () => {
    const stages: SignalStage[] = ['WAITING', 'SENDING', 'RECEIVED', 'RETURNING', 'COMPLETE'];
    for (const stage of stages) {
      setCurrentStage(stage);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const handleSendMessage = useCallback(async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toISOString(),
      status: 'PENDING',
      deviceId: connectedDevices[0]?.id || '',
    };

    const updateMessages = (prev: Message[]): Message[] => {
      const updated = [...prev, newMessage];
      return updated.slice(-3);
    };

    if (messageMode === 'MANUAL') {
      setManualMessages(updateMessages);
    } else {
      setAutoMessages(updateMessages);
    }

    setCurrentMessage(content);

    try {
      await simulateMessageFlow();
      const updateStatus = (msgs: Message[]): Message[] =>
        msgs.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'SENT' as const } : msg
        );

      if (messageMode === 'MANUAL') {
        setManualMessages(updateStatus);
      } else {
        setAutoMessages(updateStatus);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const updateStatus = (msgs: Message[]): Message[] =>
        msgs.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'FAILED' as const } : msg
        );

      if (messageMode === 'MANUAL') {
        setManualMessages(updateStatus);
      } else {
        setAutoMessages(updateStatus);
      }
    }
  }, [connectedDevices, messageMode]);

  useEffect(() => {
    if (messageMode === 'AUTO' && isAuthenticated) {
      setAutoMessages([]);
      setCurrentStage('WAITING');

      autoIntervalRef.current = setInterval(() => {
        const mentalHealthTips = [
          "Take a deep breath and practice mindfulness",
          "Stay hydrated and take breaks",
          "Connect with loved ones",
          "Practice gratitude today"
        ];
        const randomTip = mentalHealthTips[Math.floor(Math.random() * mentalHealthTips.length)];
        handleSendMessage(randomTip);
      }, 10000);

      return () => {
        if (autoIntervalRef.current) {
          clearInterval(autoIntervalRef.current);
        }
      };
    }
  }, [messageMode, handleSendMessage, isAuthenticated]);

  const handleDeviceConnect = (device: SystemDevice) => {
    setConnectedDevices(prev => [...prev, {
      ...device,
      status: 'ACTIVE' as ConnectionStatus
    }]);
  };

  const handleModeSwitch = () => {
    setMessageMode(prev => {
      const newMode: MessageMode = prev === 'AUTO' ? 'MANUAL' : 'AUTO';
      if (newMode === 'MANUAL' && autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
      }
      setCurrentStage('WAITING');
      return newMode;
    });
  };

  const currentMessages = messageMode === 'MANUAL' ? manualMessages : autoMessages;

  const transformedDevices: Device[] = connectedDevices.map(dev => ({
    id: dev.id,
    name: dev.name,
    lastResponse: new Date().toISOString(),
    signalStrength: 100,
    configurationComplete: true,
    currentStage,
    mode: messageMode,
    type: dev.type as DeviceType,
    status: dev.status,
    health: 'GOOD' as HealthStatus,
    messageMode: messageMode,
    logs: [],
    diagnostics: {
      uptime: '5 hours',
      batteryLevel: 95,
      temperature: 30
    } as Diagnostic,
  }));

  if (!isAuthenticated) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
          >
            <div className="flex items-center justify-center mb-6">
              <Activity className="w-8 h-8 text-blue-500 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                MindScape Admin
              </h1>
            </div>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="passkey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Passkey
                </label>
                <input
                  id="passkey"
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              {authError && (
                <div className="mb-4 text-sm text-red-600 dark:text-red-400">
                  {authError}
                </div>
              )}
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Activity className="w-6 h-6 text-blue-500 mr-2" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  MindScape Device Management
                </h1>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold dark:text-white">Connected Devices</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm dark:text-white">Mode:</span>
                    <button
                      onClick={handleModeSwitch}
                      className={`px-3 py-1 rounded-full text-sm ${messageMode === 'AUTO'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'}`}
                    >
                      {messageMode}
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  {transformedDevices.map(device => (
                    <DeviceCard key={device.id} device={device} />
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Signal Flow</h2>
                <SignalFlow currentStage={currentStage} mode={messageMode} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Display Preview</h2>
                <DisplayPreview
                  width={500}
                  height={250}
                  content={currentMessage}
                  deviceName="MindScape Display"
                />
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">System Configuration</h2>
                <SystemConfig onDeviceConnect={handleDeviceConnect} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Send Message</h2>
                <MessageInput
                  onSendMessage={handleSendMessage}
                  disabled={messageMode === 'AUTO' || (currentStage !== 'WAITING' && currentStage !== 'COMPLETE')}
                />
                <div className="mt-4 space-y-2">
                  <AnimatePresence>
                    {currentMessages.map(message => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
                      >
                        <p className="text-sm dark:text-white">{message.content}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(message.timestamp).toLocaleTimeString()}</p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;