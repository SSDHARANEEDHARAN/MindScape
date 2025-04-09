import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { useUser } from '../hooks/useUser'; // Correct import for useUser
import { UserData } from '../types/types';
import PersonalInfoStep from '../onboarding/PersonalInfoStep';
import DailyHabitsStep from '../onboarding/DailyHabitsStep';
import DeviceIntegrationStep from '../onboarding/DeviceIntegrationStep';

// Corrected defaultUserData
const defaultUserData: UserData = {
  name: '',
  age: 0,
  height: 0,
  weight: 0,
  morningFood: '',
  eveningFood: '',
  sleepTime: 0,
  screenTime: 0,
  hasLoraModule: false,
  hasEsp32: false,
  medicalCheckups: [], // Added this property
  challenge: '', // Added this property
};

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const { setUserData: setContextUserData, setIsOnboarded } = useUser(); // Access context methods
  const navigate = useNavigate();
  
  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };
  
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  
  const completeOnboarding = () => {
    setContextUserData(userData);
    setIsOnboarded(true);
    navigate('/dashboard');
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PersonalInfoStep 
            userData={userData} 
            updateUserData={updateUserData} 
            nextStep={nextStep} 
          />
        );
      case 2:
        return (
          <DailyHabitsStep 
            userData={userData} 
            updateUserData={updateUserData} 
            nextStep={nextStep} 
            prevStep={prevStep} 
          />
        );
      case 3:
        return (
          <DeviceIntegrationStep 
            userData={userData} 
            updateUserData={updateUserData} 
            completeOnboarding={completeOnboarding} 
            prevStep={prevStep} 
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
            <Brain className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold">MoodMirror</h1>
          <p className="text-gray-600 mt-2">AI-Powered Mental Health Analysis</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i === step 
                      ? 'bg-indigo-600 text-white' 
                      : i < step 
                        ? 'bg-indigo-200 text-indigo-800' 
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i}
                </div>
                <span className="text-xs mt-1">
                  {i === 1 ? 'Personal' : i === 2 ? 'Habits' : 'Devices'}
                </span>
              </div>
            ))}
          </div>
          
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;