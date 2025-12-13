import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoryStore } from '../store/storyStore';
import { useAvatarStore } from '../store/avatarStore';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';

const CreateStoryPage = () => {
  const navigate = useNavigate();
  const { generateStory, loading: storyLoading } = useStoryStore();
  const { generateAvatar, loading: avatarLoading } = useAvatarStore();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userInput: '',
    theme: 'adventure',
    visualStyle: 'cartoon',
    characterName: '',
    photoFile: null
  });

  const themes = ['adventure', 'romance', 'mystery', 'comedy', 'drama', 'fantasy', 'scifi'];
  const styles = ['cartoon', 'anime', 'comic', 'realistic', 'watercolor', 'sketch'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (file) => {
    setFormData({ ...formData, photoFile: file });
  };

  const handleNext = () => {
    if (step === 1 && !formData.userInput.trim()) {
      alert('Please describe your memory');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    // Generate avatar if photo provided
    let avatarId = null;
    if (formData.photoFile && formData.characterName) {
      const avatar = await generateAvatar(
        formData.photoFile,
        formData.visualStyle,
        formData.characterName
      );
      avatarId = avatar?._id;
    }

    // Generate story
    const story = await generateStory(
      formData.userInput,
      formData.theme,
      formData.visualStyle
    );

    if (story) {
      navigate(`/story/${story._id}`);
    }
  };

  const loading = storyLoading || avatarLoading;

  return (
    <div className="page-container max-w-4xl">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full mx-1 ${
                s <= step ? 'bg-gradient-to-r from-primary-600 to-secondary-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-gray-600 font-medium">
          Step {step} of 3
        </p>
      </div>

      <div className="card-glass p-8">
        {/* Step 1: Story Input */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-display font-bold mb-2">
              Share Your <span className="gradient-text">Memory</span>
            </h2>
            <p className="text-gray-600 mb-6">
              Describe a special moment, experience, or memory you'd like to turn into a storybook
            </p>

            <textarea
              name="userInput"
              value={formData.userInput}
              onChange={handleChange}
              className="textarea-field h-64"
              placeholder="Tell us about your memory... For example: 'I remember the day I took a train journey through the mountains with my best friend. The scenery was breathtaking, and we shared stories and laughter throughout the journey...'"
            />

            <div className="flex justify-end mt-6">
              <button onClick={handleNext} className="btn-primary">
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Theme & Style */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-display font-bold mb-2">
              Choose Your <span className="gradient-text">Style</span>
            </h2>
            <p className="text-gray-600 mb-6">
              Select a theme and visual style for your storybook
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Story Theme
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {themes.map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setFormData({ ...formData, theme })}
                      className={`px-4 py-3 rounded-lg font-medium capitalize transition-all ${
                        formData.theme === theme
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-400'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Visual Style
                </label>
                <div className="grid grid-cols-3 md:grid-cols-3 gap-3">
                  {styles.map((style) => (
                    <button
                      key={style}
                      onClick={() => setFormData({ ...formData, visualStyle: style })}
                      className={`px-4 py-3 rounded-lg font-medium capitalize transition-all ${
                        formData.visualStyle === style
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-400'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={handleBack} className="btn-secondary">
                ← Back
              </button>
              <button onClick={handleNext} className="btn-primary">
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Avatar (Optional) */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-display font-bold mb-2">
              Add Your <span className="gradient-text">Avatar</span>
            </h2>
            <p className="text-gray-600 mb-6">
              Upload a photo to create a personalized character (optional)
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Character Name
                </label>
                <input
                  type="text"
                  name="characterName"
                  value={formData.characterName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Alex, Sarah, Me"
                />
              </div>

              <FileUpload
                onFileSelect={handleFileSelect}
                label="Upload Photo (Optional)"
              />
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={handleBack} className="btn-secondary" disabled={loading}>
                ← Back
              </button>
              <button onClick={handleSubmit} className="btn-primary" disabled={loading}>
                {loading ? <LoadingSpinner size="sm" /> : 'Generate Storybook ✨'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateStoryPage;
