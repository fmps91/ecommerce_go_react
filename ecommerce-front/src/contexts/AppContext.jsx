import { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../core/services/auth.service';
import { toast } from 'react-toastify';
//import { UserService } from '../../../../ecommerce-front/src/core/services/user.service';
import { UserService } from '../core/services/user.service';
import { APP_ROUTES } from '../core/constants/api.routes';
import { useNavigate } from 'react-router-dom';



const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [routesReady, setRoutesReady] = useState(false);
  const [routes, setRoutes] = useState(null)
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {

    getme();

  }, []);

  /* const loadUser = async () => {
    const session = localStorage.getItem('user')
    const token = session ? JSON.parse(session) : null;
    //const token = sessionStorage.getItem('user');
    //console.log("token: ",token)
    if (token) {
      try {
        const userData = await AuthService.getMe()
        setUser(userData.data);
        setLoading(false);
      } catch (error) {
        localStorage.removeItem('user');
        setLoading(false);
      }
    }

  }; */


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
        console.log("authData: ", authData.data)
        setUser(authData.data);
        RoutesSetup(authData.data); // Esto actualizará routes
        setLoading(false);
      } catch (error) {
        /* navigate(APP_ROUTES.PUBLIC.HOME.link, {
          replace: true,
          state: { forceRefresh: true } // Puedes usar este estado para forzar recarga
        }); */
        console.error("Error in getme:", error);
        RoutesSetup(null); // Establecer rutas para usuario no autenticado
      } finally {
        //RoutesSetup(null);
        setLoading(false);
      }
    } else {
      RoutesSetup(null); // Establecer rutas para usuario no autenticado
      setLoading(false);
    }
    //setRoutes(RoutesSetup(null))
    //setLoading(false);
  };



  const logout = () => {
    //localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate(APP_ROUTES.PUBLIC.HOME.link, {
      replace: true,
      state: { forceRefresh: true } // Puedes usar este estado para forzar recarga
    });
    toast.success('Logged out successfully');
  };


  const RoutesSetup = (foundUser) => {
    console.log("user Routes: ", foundUser);

    if (foundUser === null) {
      setRoutes(
        {
          "routes":
            [
              APP_ROUTES.PUBLIC.HOME,
              APP_ROUTES.PUBLIC.LOGIN,
              APP_ROUTES.PUBLIC.REGISTER
            ],
          "user": "default"
        }

      );
      console.log("routes: ", routes)
      setRoutesReady(true);
    } else if (foundUser["is_admin"] === true) {
      setRoutes({
        "routes": 
        [
          APP_ROUTES.ADMIN.DASHBOARD,
          APP_ROUTES.ADMIN.ORDER_MANAGEMENT,
          APP_ROUTES.ADMIN.PRODUCT_MANAGEMENT,
          APP_ROUTES.ADMIN.USER_MANAGEMENT,
          APP_ROUTES.PUBLIC.HOME,
        ],
        "user": "admin"

      });
      console.log("routes: ", routes)
      setRoutesReady(true);
      console.log("isAdmin: ")
    } else if (foundUser["is_admin"] === false) {
      setRoutes(
        {
          "routes":
            [
              APP_ROUTES.PRIVATE.CART,
              APP_ROUTES.PRIVATE.ORDERS,
              APP_ROUTES.PRIVATE.PROFILE,
              APP_ROUTES.PUBLIC.HOME,
            ],
          "user": "user"

        }
      );
      console.log("routes: ", routes)
      setRoutesReady(true);
    }

  };


  return (
    <AppContext.Provider value={{ routes, routesReady, user, loading, login, register, getme, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);