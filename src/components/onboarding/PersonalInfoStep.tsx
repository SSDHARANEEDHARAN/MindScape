import React from 'react';
import { UserData } from '../types/types';

interface PersonalInfoStepProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  nextStep: () => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ 
  userData, 
  updateUserData, 
  nextStep 
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Tell us about yourself</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={userData.name}
            onChange={(e) => updateUserData({ name: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="John Doe"
            required
          />
        </div>
        
        <div>
          <label htmlFor="age" className="block text-sm font-medium mb-1">
            Age
          </label>
          <input
            type="number"
            id="age"
            value={userData.age || ''}
            onChange={(e) => updateUserData({ age: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="25"
            min="1"
            max="120"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="height" className="block text-sm font-medium mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              id="height"
              value={userData.height || ''}
              onChange={(e) => updateUserData({ height: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="175"
              min="50"
              max="250"
              required
            />
          </div>
          
          <div>
            <label htmlFor="weight" className="block text-sm font-medium mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              value={userData.weight || ''}
              onChange={(e) => updateUserData({ weight: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="70"
              min="1"
              max="300"
              required
            />
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoStep;