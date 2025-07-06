export const APP_ROUTES = {
    PUBLIC: {
      HOME: {
        name:'Products',
        link:'/'
      },
      LOGIN: {
        name:'Login',
        link:'/login'
      },
      REGISTER: {
        name:'Register',
        link:'/register'
      },
      //PRODUCTS: '/products',
      PRODUCT_DETAIL: {
        name:'PRODUCTS_DETAIL',
        link:'/products/:id'
      },
    },
    PRIVATE: {
      CART: {
        name:'CART',
        link:'/cart'
      },
      ORDERS: {
        name:'ORDERS',
        link:'/orders'
      },
      PROFILE: {
        name:'PROFILE',
        link:'/profile'
      },
    },
    ORDERS: {
      CREATE: {
        name:'CREATE_ORDER',
        link:'/create/order'
      },
      GET_ALL: {
        name:'CREATE_ORDER',
        link:'/all/orders'
      },
      GET_BY_ID: {
        name:'GET_BY_ID_ORDER',
        link:'/get_id/order/:id'
      },
      UPDATE: {
        name:'UPDATE_ORDER',
        link:'/update/order/:id'
      },
      DELETE: {
        name:'DELETE_ORDER',
        link:'/delete/order/:id'
      },
      DELETE: {
        name:'ADMIN_DELETE_AT_ORDER',
        link:'/admin/delete/order/:id'
      },
      DELETE_DATABASE: {
        name:'ADMIN_DELETE_DATABASE_USER',
        link:'/admin/users/delete_database/:id'
      },
    },
    USERS: {
      GET_ALL: {
        name:'ADMIN_GET_ALL_USERS',
        link:'/admin/users'
      },       // Solo para administradores
      GET_BY_ID:  {
        name:'ADMIN_GET_BY_ID_USER',
        link:'/admin/users/:id'
      },
      UPDATE: {
        name:'ADMIN_UPDATE_USER',
        link:'/admin/users/update/:id'
      },
      DELETE_AT: {
        name:'ADMIN_DELETE_AT_USER',
        link:'/admin/users/delete/:id'
      },        // Solo para administradores
      DELETE_DATABASE: {
        name:'ADMIN_DELETE_DATABASE_USER',
        link:'/admin/users/delete_database/:id'
      },    // Solo para administradores
    },
    ADMIN: {
      DASHBOARD: {
        name:'ADMIN_DASHBOARD',
        link:'/admin'
      },
      PRODUCT_MANAGEMENT: {
        name:'PRODUCT_MANAGEMENT',
        link:'/admin/products'
      },
      ORDER_MANAGEMENT: {
        name:'ORDER_MANAGEMENT',
        link:'/admin/orders'
      },
      USER_MANAGEMENT: {
        name:'USER_MANAGEMENT',
        link:'/admin/users'
      },
    },
  };