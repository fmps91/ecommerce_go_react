// src/pages/LoginPage.js
import { FaSignInAlt } from 'react-icons/fa';
import InputCustom from '@/components/Input';
import { useFormLogin } from './hooks/useFormLogin';
//import './styles/login.scss';
import { useEffect } from 'react';

import Navbar from '../../../components/navbar/navbar';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../../core/constants/api.routes';
import { useApp } from '../../../contexts/AppContext';



const LoginPage = () => {
  const {
    formData,
    errors,
    handleChange,
    handleSubmit
  } = useFormLogin();
  const navigate = useNavigate();
  //const { getme,loadUser,user } = useAuth();
  const { user, routes,getme,loading } = useApp();

  useEffect(() => {
    getme()
    //console.log("user: ",user)
    if (user) {
      navigate(APP_ROUTES.PUBLIC.HOME.link,{ 
        replace: true,
        state: { forceRefresh: true } // Puedes usar este estado para forzar recarga
      });
    }
  }, [user, navigate]); 

  const handleSearch = async(e) => {
    localStorage.setItem("term",e)
  };

  return (
    <div className="container auth-container py-5">
      {loading ==true ?
         <div key="spin1" className="text-center my-5">
         <div className="spinner-border" role="status">
         </div>
       </div>
       :
       <div key="" >
       <div className="" role="">
         <h2>si tiene algo</h2>
         <p>{routes?.length}</p>
         <Navbar
        onSearch={handleSearch}
        routes={routes}
      />
       </div>
     </div>

      }
      <div className="card login-card">
      <div className="card-body">
        <h2 className="text-center mb-4">
          <FaSignInAlt /> 
          <div>
          Login
          </div>
          
        </h2>
        <form onSubmit={handleSubmit}>
          {formData.map((item, index) => (
            <div key={index} className="mb-3">
              <label className="form-label">{item.name}</label>
              <InputCustom
                type={item.type || "text"}
                value={item.value}
                onChange={(v) =>
                  handleChange({
                    target: {
                      name: item.name,
                      value: v,
                    },
                  })
                }
                required={item.required}
                error={errors[item.name]}
              />
              {errors[item.name] && (
                <div className="text-danger small mt-1">{errors[item.name]}</div>
              )}
            </div>
          ))}
          
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;