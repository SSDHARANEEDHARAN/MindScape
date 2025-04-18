import React, { useState, useRef, useEffect } from 'react';
import { UserData } from '../types/types';
import { Coffee, Moon, Smartphone } from 'lucide-react';

interface DailyHabitsStepProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const eveningFoodOptions = [
  'Junk Food',
  'Tea',
  'Coffee',
  'Small Tiffen',
  'Hotel Foods',
  'Fries',
  'Others'
];

const DailyHabitsStep: React.FC<DailyHabitsStepProps> = ({
  userData,
  updateUserData,
  nextStep,
  prevStep,
}) => {
  const [disabilityResponse, setDisabilityResponse] = useState<string>('');
  const [healthConditionResponse, setHealthConditionResponse] = useState<string>('');
  const [medicalCheckupDate, setMedicalCheckupDate] = useState<string>('');
  const [hospitalName, setHospitalName] = useState<string>('');
  const [hospitalDistrict, setHospitalDistrict] = useState<string>('');
  const [showFoodOptions, setShowFoodOptions] = useState(false);
  const [foodInputValue, setFoodInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFoodOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      (disabilityResponse === 'Unwell' && healthConditionResponse === '')
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    nextStep();
  };

  const handleFoodSelect = (food: string) => {
    if (food === 'Others') {
      setFoodInputValue('');
      updateUserData({ eveningFood: '' });
    } else {
      setFoodInputValue(food);
      updateUserData({ eveningFood: food });
    }
    setShowFoodOptions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFoodInputValue(e.target.value);
    updateUserData({ eveningFood: e.target.value });
  };

  const handleInputFocus = () => {
    setShowFoodOptions(true);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Daily Habits</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="morningFood"
            className="text-sm font-medium mb-1 flex items-center"
          >
            <Coffee className="w-4 h-4 mr-2" />
            Morning Food
          </label>
          <input
            type="text"
            id="morningFood"
            value={userData.morningFood}
            onChange={(e) => updateUserData({ morningFood: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="What do you typically eat for breakfast?"
            required
          />
        </div>

        {/* Updated Evening Food Selection with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <label
            htmlFor="eveningFood"
            className="text-sm font-medium mb-1"
          >
            Evening Food
          </label>
          <input
            type="text"
            id="eveningFood"
            ref={inputRef}
            value={foodInputValue || userData.eveningFood}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Select or type your evening food"
            required
          />
          
          {showFoodOptions && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 border border-gray-200">
              {eveningFoodOptions.map((food) => (
                <div
                  key={food}
                  className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                  onClick={() => handleFoodSelect(food)}
                >
                  {food}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="sleepTime"
            className="text-sm font-medium mb-1 flex items-center"
          >
            <Moon className="w-4 h-4 mr-2" />
            Sleep Time (hours)
          </label>
          <input
            type="number"
            id="sleepTime"
            value={userData.sleepTime || ''}
            onChange={(e) => updateUserData({ sleepTime: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="8"
            min="1"
            max="24"
            required
          />
        </div>

        <div>
          <label
            htmlFor="screenTime"
            className="text-sm font-medium mb-1 flex items-center"
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Screen Time (hours)
          </label>
          <input
            type="number"
            id="screenTime"
            value={userData.screenTime || ''}
            onChange={(e) => updateUserData({ screenTime: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="4"
            min="0"
            max="24"
            required
          />
        </div>

        {/* Disability Question */}
        <div>
          <label htmlFor="disability" className="text-sm font-medium mb-1">
            Do you identify as a person with a physical disability or require accommodations related to physical mobility?
          </label>
          <select
            id="disability"
            value={disabilityResponse}
            onChange={(e) => setDisabilityResponse(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select an option</option>
            <option value="Unwell">Unwell</option>
            <option value="Yes, I do.">Yes, I do.</option>
            <option value="No, I do not.">No, I do not.</option>
            <option value="I prefer not to say.">I prefer not to say.</option>
          </select>
        </div>

        {/* If Unwell, Health Condition Question */}
        {disabilityResponse === 'Unwell' && (
          <div>
            <label htmlFor="healthCondition" className="text-sm font-medium mb-1">
              Please indicate if you have any health conditions or require accommodations that may affect your participation. If so, please specify.
            </label>
            <select
              id="healthCondition"
              value={healthConditionResponse}
              onChange={(e) => setHealthConditionResponse(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select an option</option>
              <option value="Yes, I have a health condition that may require accommodations.">Yes, I have a health condition that may require accommodations.</option>
              <option value="No, I do not have any health conditions.">No, I do not have any health conditions (last medical checkup was 2 months ago).</option>
              <option value="I prefer not to disclose this information.">I prefer not to disclose this information.</option>
            </select>
          </div>
        )}

        {/* If Health Condition is Yes, Show Medical Checkup Date and Hospital Info */}
        {healthConditionResponse === 'Yes, I have a health condition that may require accommodations.' && (
          <div>
            <label htmlFor="medicalCheckupDate" className="text-sm font-medium mb-1">
              For medical purposes, please provide the date of your most recent medical checkup, if you are comfortable doing so.
            </label>
            <input
              type="date"
              id="medicalCheckupDate"
              value={medicalCheckupDate}
              onChange={(e) => setMedicalCheckupDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />

            <div className="pt-4">
              <label htmlFor="hospitalName" className="text-sm font-medium mb-1">
                Hospital Name (optional):
              </label>
              <input
                type="text"
                id="hospitalName"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter Hospital Name"
              />

              <label htmlFor="hospitalDistrict" className="text-sm font-medium mb-1">
                Hospital District (optional):
              </label>
              <input
                type="text"
                id="hospitalDistrict"
                value={hospitalDistrict}
                onChange={(e) => setHospitalDistrict(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter Hospital District"
              />
            </div>
          </div>
        )}

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
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default DailyHabitsStep;