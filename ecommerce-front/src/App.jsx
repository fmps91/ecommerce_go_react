/* import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css' */

import { Routes, Route, Navigate } from 'react-router-dom';
import { APP_ROUTES } from './core/constants/api.routes';
import LoginPage from './pages/auth/Login/LoginPage';
import RegisterPage from './pages/auth/Register/RegisterPage';
import ProductListPage from './pages/products/ProductListPage/ProductListPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import CartPage from './pages/cart/CartPage';
import OrdersPage from './pages/orders/OrdersPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Importa el CSS de Bootstrap (global)
import 'bootstrap/dist/css/bootstrap.min.css';

// Importa el JS de Bootstrap (con Popper incluido)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import ProfilePage from './pages/profile/ProfilePage';
import ProductManagementPage from './pages/products/ProductManagementPage';
import UserManagementPage from './pages/user/UserManagementPage';

function App() {
  return (
    <>
      <Routes>
        <Route path={APP_ROUTES.PUBLIC.HOME} element={<ProductListPage />} />
        <Route path={APP_ROUTES.PUBLIC.LOGIN} element={<LoginPage />} />
        <Route path={APP_ROUTES.PUBLIC.REGISTER} element={<RegisterPage />} />
        <Route path={APP_ROUTES.PUBLIC.PRODUCTS} element={<ProductListPage />} />
        <Route path={APP_ROUTES.PUBLIC.PRODUCT_DETAIL} element={<ProductDetailPage />} />
        
        <Route element={<PrivateRoute />}>
          <Route path={APP_ROUTES.PRIVATE.CART} element={<CartPage />} />
          <Route path={APP_ROUTES.PRIVATE.ORDERS} element={<OrdersPage />} />
          <Route path={APP_ROUTES.PRIVATE.PROFILE} element={<ProfilePage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path={APP_ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
          <Route path={APP_ROUTES.ADMIN.PRODUCT_MANAGEMENT} element={<ProductManagementPage />} />
          <Route path={APP_ROUTES.ADMIN.USER_MANAGEMENT} element={<UserManagementPage />} />
        </Route>

        <Route path="*" element={<Navigate to={APP_ROUTES.PUBLIC.HOME} />} />
      </Routes>
      <ToastContainer 
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;