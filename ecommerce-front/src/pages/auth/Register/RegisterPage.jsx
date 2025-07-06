import { Link, useNavigate } from 'react-router-dom';

import { FaUserPlus } from 'react-icons/fa';
import InputCustom from '@/components/Input';

import { useFormRegister } from './Hooks/useFormRegister';
import Navbar from '../../../components/navbar/navbar';
import { useEffect } from 'react';
import { APP_ROUTES } from '../../../core/constants/api.routes';
import { useAuth } from '../../../contexts/AuthContext';

//import { Form, Button, Card } from 'bootstrap';
import { useApp } from '../../../contexts/AppContext';

const RegisterPage = () => {
  
  const {
    formData,
    errors,
    handleChange,
    handleSubmit
  } = useFormRegister();

  const navigate = useNavigate();
  const { getme,loading,routes, user } = useApp();


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
    /* navigate(APP_ROUTES.PUBLIC.HOME.link,{ 
      replace: true,
      state: { forceRefresh: true } // Puedes usar este estado para forzar recarga
    }); */
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
      <div className="card auth-card">
        <div className="card-body">
          <div className="text-center mb-4">
            <FaUserPlus size={32} className="mb-3" />
            <h2>Create Account</h2>
          </div>
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

            <button
              type="submit"
              className="btn btn-primary w-100"
              
            >
             Register
            </button>
          </form>




          <div className="text-center mt-3">
            Already have an account?{' '}
            <Link to="/login" key="session" style={{ textDecoration: "none" }}>
              <div style={{ display: 'inline', color: 'blue' }}>Login here</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;