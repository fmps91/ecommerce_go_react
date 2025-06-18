export const APP_ROUTES = {
    PUBLIC: {
      HOME: '/',
      LOGIN: '/login',
      REGISTER: '/register',
      PRODUCTS: '/products',
      PRODUCT_DETAIL: '/products/:id',
    },
    PRIVATE: {
      CART: '/cart',
      ORDERS: '/orders',
      PROFILE: '/profile',
    },
    ORDERS: {
      CREATE: '/orders',
      GET_ALL: '/orders',
      GET_BY_ID: '/orders',
      UPDATE: '/orders',
      DELETE: '/orders',
      ADMIN_ALL: '/admin/orders' // Ruta específica para administradores
    },
    USERS: {
      GET_ALL: '/admin/users',       // Solo para administradores
      GET_BY_ID: '/users',
      UPDATE: '/users',
      DELETE: '/admin/users',        // Solo para administradores
      CHANGE_ROLE: '/admin/users'    // Solo para administradores
    },
    ADMIN: {
      DASHBOARD: '/admin',
      PRODUCT_MANAGEMENT: '/admin/products',
      ORDER_MANAGEMENT: '/admin/orders',
      USER_MANAGEMENT: '/admin/users',
    },
  };