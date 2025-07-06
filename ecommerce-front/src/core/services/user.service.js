import api from '../utils/api';
import { API_ENDPOINTS } from '../constants/api.endpoints';

export const UserService = {
  /**
   * Obtiene todos los usuarios (solo admin)
   */
  getAll: async (params = {}) => {
   
      const queryString = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryString.append(key, value);
        }
      });

      const url = `${API_ENDPOINTS.USERS.GET_ALL}?${queryString.toString()}`;
      const response = await api.get(url);
      return response.data;
    
  },

  /**
   * Obtiene un usuario por ID
   */
  getById: async (userId) => {
    try {
      console.log("route: ", `${API_ENDPOINTS.USERS.GET_BY_ID}/${userId}`)
      const response = await api.get(`${API_ENDPOINTS.USERS.GET_BY_ID}/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Actualiza un usuario
   */
  update: async (userId, userData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.USERS.UPDATE}/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.log("erro en user update: ",error)
      throw error.response?.data || error.message;
    }
  },

  /**
   * Elimina un usuario (solo admin)
   */
  delete_at: async (userId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.USERS.DELETE_AT}/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  delete_db: async (id) => {
    //console.log("api: ",api.del());
    const response = await api.del(`${API_ENDPOINTS.USERS.DELETE_DATABASE}/${id}`);
    return response;
  },
};