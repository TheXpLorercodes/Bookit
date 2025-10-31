import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Experiences
export const getExperiences = async (page = 1, limit = 10) => {
  const response = await api.get('/experiences', { params: { page, limit } });
  return response.data;
};

export const getExperienceById = async (id: string) => {
  const response = await api.get(`/experiences/${id}`);
  return response.data.experience;
};

export const getExperienceSlots = async (id: string) => {
  const response = await api.get(`/experiences/${id}/slots`);
  return response.data.slots;
};

// Bookings
export const createBooking = async (data: any) => {
  const response = await api.post('/bookings', data);
  return response.data.booking;
};

export const getBooking = async (id: string) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data.booking;
};

// Promo Codes
export const validatePromoCode = async (code: string, amount: number) => {
  const response = await api.post('/promo/validate', {
    code,
    booking_amount: amount,
  });
  return response.data;
};
