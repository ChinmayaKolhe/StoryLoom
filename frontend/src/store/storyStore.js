import { create } from 'zustand';
import { storyAPI, panelAPI, bookAPI } from '../utils/api';

export const useStoryStore = create((set, get) => ({
  stories: [],
  currentStory: null,
  loading: false,
  error: null,

  fetchStories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await storyAPI.getAll();
      set({ stories: response.data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch stories', 
        loading: false 
      });
    }
  },

  fetchStory: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await storyAPI.getById(id);
      set({ currentStory: response.data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch story', 
        loading: false 
      });
    }
  },

  generateStory: async (userInput, theme, visualStyle) => {
    set({ loading: true, error: null });
    try {
      const response = await storyAPI.generate({ userInput, theme, visualStyle });
      set({ currentStory: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to generate story', 
        loading: false 
      });
      return null;
    }
  },

  generateAllPanels: async (storyId) => {
    set({ loading: true, error: null });
    try {
      await panelAPI.generateAll(storyId);
      set({ loading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to generate panels', 
        loading: false 
      });
      return false;
    }
  },

  buildStorybook: async (storyId) => {
    set({ loading: true, error: null });
    try {
      const response = await bookAPI.build(storyId);
      set({ currentStory: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to build storybook', 
        loading: false 
      });
      return null;
    }
  },

  deleteStory: async (id) => {
    try {
      await storyAPI.delete(id);
      set({ stories: get().stories.filter(s => s._id !== id) });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete story' });
      return false;
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentStory: () => set({ currentStory: null }),
}));
