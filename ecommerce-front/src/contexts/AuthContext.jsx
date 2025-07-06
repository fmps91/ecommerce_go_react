import { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../core/services/auth.service';
import { toast } from 'react-toastify';
//import { UserService } from '../../../../ecommerce-front/src/core/services/user.service';
import { UserService } from '../core/services/user.service';
import { APP_ROUTES } from '../core/constants/api.routes';



const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [routesReady, setRoutesReady] = useState(false);
  const [routes, setRoutes]= useState([])
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    
    getme();
    
  }, []);

  const loadUser = async () => {
    const session=localStorage.getItem('user')
    const token = session ? JSON.parse(session) : null;
    //const token = sessionStorage.getItem('user');
    //console.log("token: ",token)
    if (token) {
      try {
        const userData = await AuthService.getMe()
        setUser(userData.data);
        setLoading(false);
      } catch (error) {
        sessionStorage.removeItem('user');
        setLoading(false);
      }
    }
    
  };


  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await AuthService.login(credentials);
      //console.log("response: ",response)
      //localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      //loadUser()
      //await getme()
      toast.success('Login successful');
      setLoading(false);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      setLoading(false);
      return false;
    }

    
  };

  const register = async (credentials) => {
    setLoading(true);
    try {
      const response = await AuthService.register(credentials)
      //console.log("response: ",response)
      //localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      //loadUser()
      //await getme()
      toast.success('Register successfull');
      setLoading(false);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      setLoading(false);
      return false;
    }
    
  };

  const getme = async () => {
    const session = localStorage.getItem('user');
    const token = session ? JSON.parse(session) : null;
   
    if (token) {
      try {
        //setLoading(true);
        const authData = await AuthService.getMe();
        console.log("authData: ",authData.data )
        setUser(authData.data);
        RoutesSetup(authData.data); // Esto actualizará routes
        setLoading(false);
      } catch (error) {
        console.error("Error in getme:", error);
        //RoutesSetup(null); // Establecer rutas para usuario no autenticado
      } finally {
        //RoutesSetup(null);
        //setLoading(false);
      }
    } else {
      setRoutes(RoutesSetup(null)); // Establecer rutas para usuario no autenticado
      setLoading(false);
    }
    //setRoutes(RoutesSetup(null))
    setLoading(false);
  };



  const logout = () => {
    //localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };


  const RoutesSetup = (foundUser) => {
    console.log("user Routes: ", foundUser);
    
    
    if (foundUser == null) {
      setRoutes([
        APP_ROUTES.PUBLIC.HOME,
        APP_ROUTES.PUBLIC.LOGIN,
        APP_ROUTES.PUBLIC.REGISTER
      ]);
      console.log("routes: ",routes)
      setRoutesReady(true);
    } else if (foundUser["is_admin"] == true) {
      setRoutes([
        APP_ROUTES.ADMIN.DASHBOARD,
        APP_ROUTES.ADMIN.ORDER_MANAGEMENT,
        APP_ROUTES.ADMIN.PRODUCT_MANAGEMENT,
        APP_ROUTES.ADMIN.USER_MANAGEMENT
      ]);
      console.log("routes: ",routes)
      setRoutesReady(true);
      console.log("isAdmin: ")
    } else if (foundUser["is_admin"] == false) {
      setRoutes([
        APP_ROUTES.PRIVATE.CART,
        APP_ROUTES.PRIVATE.ORDERS,
        APP_ROUTES.PRIVATE.PROFILE,
      ]);
      console.log("routes: ",routes)
      setRoutesReady(true);
    }
    
    
    
  };


  return (
    <AuthContext.Provider value={{ routes, routesReady,user,loadUser, loading, login, register, getme,logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);