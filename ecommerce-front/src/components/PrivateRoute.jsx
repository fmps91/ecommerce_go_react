import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { APP_ROUTES } from '../core/constants/api.routes';

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }
  
  //console.log("user: ",user)
  //user ? console.log("tiene session") : console.log("no tiene session")

  return user ? <Outlet /> : <Navigate to={APP_ROUTES.PUBLIC.LOGIN} />;
};

export default PrivateRoute;
