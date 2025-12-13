import { create } from 'zustand';
import { avatarAPI } from '../utils/api';

export const useAvatarStore = create((set, get) => ({
  avatars: [],
  currentAvatar: null,
  loading: false,
  error: null,

  fetchAvatars: async () => {
    set({ loading: true, error: null });
    try {
      const response = await avatarAPI.getAll();
      set({ avatars: response.data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch avatars', 
        loading: false 
      });
    }
  },

  generateAvatar: async (file, style, characterName) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('style', style);
      formData.append('characterName', characterName);

      const response = await avatarAPI.generate(formData);
      set({ 
        currentAvatar: response.data, 
        avatars: [response.data, ...get().avatars],
        loading: false 
      });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to generate avatar', 
        loading: false 
      });
      return null;
    }
  },

  deleteAvatar: async (id) => {
    try {
      await avatarAPI.delete(id);
      set({ avatars: get().avatars.filter(a => a._id !== id) });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete avatar' });
      return false;
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentAvatar: () => set({ currentAvatar: null }),
}));
