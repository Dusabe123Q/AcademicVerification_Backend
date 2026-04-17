import api from './api';

export const login = async (username, password) => {
  const response = await api.post('/auth/login', {
    username,
    password,
  });
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    try {
      const payload = JSON.parse(atob(response.data.token.split('.')[1]));
      localStorage.setItem('role', payload.roles && payload.roles.length > 0 ? payload.roles[0] : 'UNKNOWN');
    } catch (error) {
      console.error('JWT parsing error:', error);
      localStorage.setItem('role', 'UNKNOWN');
    }
  }
  return response.data;
};

export const getRole = () => localStorage.getItem('role');

export const logout = () => {
  localStorage.removeItem('token');
};

export const register = async (username, password, role) => {
  return await api.post('/auth/register', {
    username,
    password,
    role
  });
};

export const sendOtp = async ({ email, phone, preferredMethod }) => {
  return await api.post('/auth/send-otp', { email, phone, preferredMethod });
};

export const verifyAndRegister = async ({ email, phone, otp, username, password, role }) => {
  const response = await api.post('/auth/verify-and-register', {
    email, phone, otp, username, password, role
  });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    try {
      const payload = JSON.parse(atob(response.data.token.split('.')[1]));
      localStorage.setItem('role', payload.roles && payload.roles.length > 0 ? payload.roles[0] : 'UNKNOWN');
    } catch (error) {
      console.error('JWT parsing error:', error);
      localStorage.setItem('role', 'UNKNOWN');
    }
  }
  return response.data;
};
