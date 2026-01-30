import api from './api';

export const availabilityAPI = {
  // Get all availability slots for the current interviewer
  getMyAvailability: async () => {
    const response = await api.get('/availability');
    return response.data;
  },

  // Get availability slots by date range
  getAvailabilityByDateRange: async (start, end) => {
    const response = await api.get('/availability/range', {
      params: {
        start: start.toISOString(),
        end: end.toISOString()
      }
    });
    return response.data;
  },

  // Create a single availability slot
  createAvailabilitySlot: async (slotData) => {
    // Helper function to format date without timezone
    const formatLocalDateTime = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const response = await api.post('/availability', {
      startDateTime: formatLocalDateTime(new Date(slotData.startDateTime)),
      endDateTime: formatLocalDateTime(new Date(slotData.endDateTime)),
      description: slotData.description
    });
    return response.data;
  },

  // Create multiple availability slots at once
  createBulkAvailabilitySlots: async (slots) => {
    const response = await api.post('/availability/bulk', {
      slots: slots.map(slot => ({
        startDateTime: slot.startDateTime,
        endDateTime: slot.endDateTime,
        description: slot.description
      }))
    });
    return response.data;
  },

  // Delete an availability slot
  deleteAvailabilitySlot: async (slotId) => {
    await api.delete(`/availability/${slotId}`);
  },

  // Get availability statistics
  getAvailabilityStats: async () => {
    const response = await api.get('/availability/stats');
    return response.data;
  }
};

export default availabilityAPI;