import axios from 'axios';

const API_BASE_URL = 'http://localhost:8090/api/v1/user';

export const registerUser = async (user) => {
  return await axios.post(`${API_BASE_URL}/save`, user);
};

export const loginUser = async (email, password) => {
  return await axios.post(`${API_BASE_URL}/login`, { email, password });
};


// Get medications for a specific date and user
export const getMedicationsByDate = async (email, date) => {
  return await axios.get(`${API_BASE_URL}/medications`, {
    params: { email, date }
  });
};

// Add a new medication
export const addMedication = async (medication) => {
  return await axios.post(`${API_BASE_URL}/medications/add`, medication);
};
