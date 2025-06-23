import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { topicsAPI } from '../../services/api';
import { ROUTES } from '../../config/constants';

export default function Topics() {
  const [topics, setTopics] = useState([]);
  const [selected, setSelected] = useState([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching initial data...");

        const [topicsResponse, interestsResponse] = await Promise.all([
          topicsAPI.getTopics(),
          topicsAPI.getUserInterests(),
        ]);

        console.log("All topics fetched:", topicsResponse.data);
        console.log("User's interests fetched:", interestsResponse.data);

        setTopics(topicsResponse.data);

        const selectedIds = interestsResponse.data.map(interest => interest.topic.id);
        setSelected(selectedIds);
        console.log("Pre-selected topic IDs:", selectedIds);

      } catch (err) {
        setError('Failed to load your topics. Please try again.');
        console.error('Error fetching initial data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const toggleTopic = (id) => {
    console.log(`Toggling topic ID: ${id}`);
    const newSelected = selected.includes(id)
      ? selected.filter((tid) => tid !== id)
      : [...selected, id];
    
    setSelected(newSelected);
    console.log("New selected IDs:", newSelected);
  };

  const handleSave = async () => {
    if (saving) return;
    console.log("Saving interests with IDs:", selected);
    
    try {
      setSaving(true);
      await topicsAPI.saveUserInterests(selected);
      
      console.log("Interests saved successfully on backend.");
      
      if (user) {
        updateUser({ ...user, has_completed_onboarding: true });
        console.log("User context updated.");
      }
      
      setSaved(true);
      
      setTimeout(() => {
        navigate(ROUTES.home);
      }, 1500);
      
    } catch (err) {
      setError('Failed to save topics. Please try again.');
      console.error('Error saving interests:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark900 flex items-center justify-center">
        <div className="text-white text-lg">Loading your topics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark900 flex items-center justify-center p-2">
      <div className="w-[90%] rounded-2xl p-1">
        <h2 className="text-xl font-bold text-white text-center mb-3">
          Choose Your Topics of Interest
        </h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          Select or update your topics to personalize your experience.
        </p>
        
        {error && (
          <div className="text-red-400 text-sm text-center mb-4">
            {error}
          </div>
        )}
        
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className={`
                px-3 py-1 rounded-lg cursor-pointer transition-all duration-300 border-2 w-fit
                ${selected.includes(topic.id) 
                  ? 'border-purple text-purple bg-purple/10' 
                  : 'border-cyan00 text-cyan00 hover:border-cyan-300 hover:text-cyan-300'
                }
              `}
              onClick={() => toggleTopic(topic.id)}
            >
              <h3 className="text-sm font-semibold whitespace-nowrap">
                {topic.name}
              </h3>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <button
            className={`
              px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300
              ${saving
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-purple text-white hover:bg-purple/80 hover:scale-105'
              }
            `}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          
          {saved && (
            <div className="mt-4 text-green0 font-semibold text-sm">
              Your topics have been saved! Redirecting...
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 