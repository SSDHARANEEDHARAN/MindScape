import React from 'react';
import { UserData } from '../types/types';
import { Radio, Wifi, Monitor } from 'lucide-react';

interface DeviceIntegrationStepProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  completeOnboarding: () => void;
  prevStep: () => void;
}

const DeviceIntegrationStep: React.FC<DeviceIntegrationStepProps> = ({ 
  userData, 
  updateUserData, 
  completeOnboarding,
  prevStep 
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeOnboarding();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Device Integration</h2>
      <p className="text-center mb-6 text-gray-600">
        Connect your devices for better health tracking
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-start">
            <div className="flex items-center h-5 mt-1">
              <input
                id="loraModule"
                type="checkbox"
                checked={userData.hasLoraModule}
                onChange={(e) => updateUserData({ hasLoraModule: e.target.checked })}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="loraModule" className="font-medium flex items-center">
                <Radio className="w-5 h-5 mr-2 text-indigo-600" />
                Rasperrypi 5
              </label>
              <p className="text-sm text-gray-500">
                Long-range data transmission for remote health monitoring
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-start">
            <div className="flex items-center h-5 mt-1">
              <input
                id="esp32"
                type="checkbox"
                checked={userData.hasEsp32}
                onChange={(e) => updateUserData({ hasEsp32: e.target.checked })}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="esp32" className="font-medium flex items-center">
                <Monitor className="w-5 h-5 mr-2 text-indigo-600" />
                ESP32 Display 
              </label>
              <p className="text-sm text-gray-500">
                Real-time display of your health metrics and mood data
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Wifi className="w-5 h-5 mr-2 text-indigo-600" />
            <span className="font-medium">Google Sync</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Securely back up your health data to Google Cloud
          </p>
          <button
            type="button"
            className="mt-2 text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-100"
          >
            Connect Google Account
          </button>
        </div>
        
        <div className="pt-4 flex space-x-4">
          <button
            type="button"
            onClick={prevStep}
            className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Back
          </button>
          <button
            type="submit"
            className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Complete Setup
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeviceIntegrationStep;