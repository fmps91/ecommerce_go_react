import api from '../utils/api';
import { API_ENDPOINTS } from '../constants/api.endpoints';

export const ProductService = {
  getAll: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_ALL, { params });
    return response.data;
  },
  /* getAllParams: async (params = {}) => {
    //const response = await api.get(`${API_ENDPOINTS.PRODUCTS.GET_ALL_PARAMS}?search=${querys.search}`, { params });
    
    const response = await api.get(`${API_ENDPOINTS.PRODUCTS.GET_ALL_PARAMS}`, { params });
    return response.data;
  }, */
  getAllParams: async (params = {}) => {
    // Construir manualmente el query string
    const queryString = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryString.append(key, value);
      }
    });
    
    const url = `${API_ENDPOINTS.PRODUCTS.GET_ALL_PARAMS}?${queryString.toString()}`;
    const response = await api.get(url);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`${API_ENDPOINTS.PRODUCTS.GET_BY_ID}/${id}`);
    return response.data;
  },
  create: async (productData) => {
    const response = await api.post(API_ENDPOINTS.PRODUCTS.CREATE, productData,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  update: async (id, productData) => {
    const response = await api.put(`${API_ENDPOINTS.PRODUCTS.UPDATE}/${id}`, productData,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  delete_at: async (id) => {
    //console.log("api: ",api.del());
    const response = await api.del(`${API_ENDPOINTS.PRODUCTS.DELETE_AT}/${id}`);
    return response;
  },
  delete_db: async (id) => {
    //console.log("api: ",api.del());
    const response = await api.del(`${API_ENDPOINTS.PRODUCTS.DELETE_DATABASE}/${id}`);
    return response.data;
  },
};