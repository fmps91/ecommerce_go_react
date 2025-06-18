import api from '../utils/api';
import { API_ENDPOINTS } from '../constants/api.endpoints';

export const OrderService = {
  // Crear una nueva orden
  createOrder: async (orderData) => {
    try {
      const response = await api.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener todas las órdenes del usuario actual
  getUserOrders: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ORDERS.GET_ALL);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener una orden específica por ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ORDERS.GET_BY_ID}/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Actualizar el estado de una orden (admin)
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.ORDERS.UPDATE}/${orderId}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cancelar una orden (usuario)
  cancelOrder: async (orderId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.ORDERS.DELETE}/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener todas las órdenes (admin)
  getAllOrders: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.ORDERS.ADMIN_ALL, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};