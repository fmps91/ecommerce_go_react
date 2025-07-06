import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { APP_ROUTES } from '../core/constants/api.routes';

const PrivateRoute = () => {
  //const { loadUser,user, loading,getme } = useAuth();
  const { user, getme,loading } = useApp();

  if (loading) {
    getme()
    return <div className="text-center my-5">Loading...</div>;
  }
  
  //console.log("user: ",user)
  //user ? console.log("tiene session") : console.log("no tiene session")

  return user ? <Outlet /> : <Navigate to={APP_ROUTES.PUBLIC.HOME.link} />;
};

export default PrivateRoute;
