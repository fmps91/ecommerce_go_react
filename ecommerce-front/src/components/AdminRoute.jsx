import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { APP_ROUTES } from '../core/constants/api.routes';

const AdminRoute = () => {
  //const { user, getme,loading } = useAuth();
  const { user, getme,loading } = useApp();

  
  if (loading) {
    getme()
    return <div className="text-center my-5">Loading...</div>;
  }
  //user ? console.log("tiene session admin: ",user) : console.log("no tiene session")


  return user?.["is_admin"] ? <Outlet /> : <Navigate to={APP_ROUTES.PUBLIC.HOME.link} />;
};

export default AdminRoute;