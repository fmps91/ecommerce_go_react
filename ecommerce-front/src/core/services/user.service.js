import api from '../utils/api';
import { API_ENDPOINTS } from '../constants/api.endpoints';

export const UserService = {
  /**
   * Obtiene todos los usuarios (solo admin)
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.USERS.GET_ALL, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtiene un usuario por ID
   */
  getById: async (userId) => {
    try {
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
      throw error.response?.data || error.message;
    }
  },

  /**
   * Elimina un usuario (solo admin)
   */
  delete: async (userId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.USERS.DELETE}/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Cambia el rol de un usuario (admin/normal)
   */
  changeRole: async (userId, isAdmin) => {
    try {
      const response = await api.patch(
        `${API_ENDPOINTS.USERS.CHANGE_ROLE}/${userId}`,
        { is_admin: isAdmin }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};