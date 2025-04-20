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
} from '../Admin/types';
import { DeviceCard } from '../Admin/DeviceCard';
import { MessageInput } from '../Admin/MessageInput';
import { SignalFlow } from '../Admin/SignalFlow';
import { DisplayPreview } from '../Admin/DisplayPreview';
import { SystemConfig } from '../Admin/SystemConfig';
import { Activity } from 'lucide-react';
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
  const autoIntervalRef = useRef<NodeJS["Timeout"] | null>(null);

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
    if (messageMode === 'AUTO') {
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
  }, [messageMode, handleSendMessage]);

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