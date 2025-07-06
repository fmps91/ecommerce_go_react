import axios from 'axios';
import { toast } from 'react-toastify';

// Configuración base de axios
const api = axios.create({
  baseURL: 'http://localhost:5000', // Cambia esto por tu backend real
  //timeout: 5000,

});

const Content={
  headers: {
  'Content-Type': 'application/json'
  }
}

// Petición GET
export const get = (url, params = {}) => {
  return api.get(url, { params,...Content });
};

// Petición POST
export const post = (url, data = {},config=Content) => {
  return api.post(url, data, config);
};

// Petición PUT
export const put = (url, data = {},config=Content) => {
  return api.put(url, data, config);
};

// Petición DELETE
export const del = (url, params = {}) => {
  return api.delete(url, { params,...Content });
};


api.interceptors.request.use((config) => {
  // Obtener el token del almacenamiento local o de sessionStorage
  //const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const data = JSON.parse(localStorage.getItem('user'));
  //console.log("user: ",data)

  if (data) {
    config.headers.Authorization = `Bearer ${data.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      toast.error('Sesión expirada. Por favor ingrese nuevamente.');
      localStorage.removeItem('user');
      //window.location.href = '/login';
      
    }
    
    // Manejar otros errores
    if (error.response?.status >= 500) {
      toast.error('Error del servidor. Por favor intente más tarde.');
    }
    
    return Promise.reject(error);
  }
);

export default {
  get,
  post,
  put,
  del,
  api
};