export const version="/api/v1";

export const API_ENDPOINTS = {
    
    AUTH: {
      LOGIN: version+'/auth/signin',
      REGISTER: version+'/auth/signup',
      UPDATE: version+'/auth/update',
      ME: version+'/users/me',
    },
    USERS: {
      GET_BY_ID: version+'/users',
      GET_ALL: version+'/users',
      UPDATE: version+'/users',
      DELETE_AT: version+'/users',
      DELETE_DATABASE: version+'/users/custom',
    },
    PRODUCTS: {
      GET_ALL: version+'/products',
      GET_ALL_PARAMS: version+'/products/params',
      GET_BY_ID: version+'/products',
      CREATE: version+'/products',
      UPDATE: version+'/products',
      DELETE_AT: version+'/products',
      DELETE_DATABASE: version+'/products/custom',
    },
    ORDERS: {
      CREATE: version+'/orders',
      GET_ALL: version+'/orders',
      GET_BY_ID: version+'/orders',
      UPDATE: version+'/orders',
      DELETE_AT: version+'/orders',
      DELETE_DATABASE: version+'/orders/custom',
    },
  };
