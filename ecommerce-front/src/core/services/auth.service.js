import {post,get,put} from '../utils/api';
import { API_ENDPOINTS } from '../constants/api.endpoints';

export const AuthService = {
  login: async (credentials) => {
    const response = await post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },
  getMe: async () => {
    const response = await get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },
  update: async (id,body) => {
    const response = await put(`${API_ENDPOINTS.AUTH.UPDATE}/${id}`,body)//get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },
};