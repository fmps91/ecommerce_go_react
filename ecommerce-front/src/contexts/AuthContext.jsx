import { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../core/services/auth.service';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const loadUser = async () => {
    const session=sessionStorage.getItem('user')
    const token = session ? JSON.parse(session) : null;
    //const token = sessionStorage.getItem('user');
    //console.log("token: ",token)
    if (token) {
      try {
        const userData = await AuthService.getMe()
        setUser(userData.data);
      } catch (error) {
        sessionStorage.removeItem('user');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    
    loadUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await AuthService.login(credentials);
      //console.log("response: ",response)
      //localStorage.setItem('token', response.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      toast.success('Login successful');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const register = async (credentials) => {
    try {
      const response = await AuthService.register(credentials)
      //console.log("response: ",response)
      //localStorage.setItem('token', response.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      toast.success('Register successfull');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      return false;
    }
  };


  const logout = () => {
    //localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user,loadUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);