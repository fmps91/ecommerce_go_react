import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { APP_ROUTES } from '../core/constants/api.routes';

const GloblalRoute = () => {
  //const { user, getme,loading } = useAuth();
  const { user, getme, loading, routesReady } = useApp();

  useEffect(() => {
    
    getme();
      
  }, []);


  return <Outlet />;
};

export default GloblalRoute;