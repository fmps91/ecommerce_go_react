import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { APP_ROUTES } from '../core/constants/api.routes';

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  //user ? console.log("tiene session") : console.log("no tiene session")


  return user?.isAdmin ? <Outlet /> : <Navigate to={APP_ROUTES.PUBLIC.HOME} />;
};

export default AdminRoute;