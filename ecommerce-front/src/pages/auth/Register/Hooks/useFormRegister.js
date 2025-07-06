// src/hooks/useFormLogin.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/core/constants/api.routes';
import { validarCampo } from '@/utils/validations';
import { AuthService } from '@/core/services/auth.service';
import { toast } from 'react-toastify';
import { useApp } from '../../../../contexts/AppContext';

export const useFormRegister = () => {
  const init = [
    {
      name: "Name",
      value: "",
      required: true,
      type: "text",
      validationType: "text" 
    },
    {
      name: "Email",
      value: "",
      required: true,
      type: "email",
      validationType: "email" 
    },
    {
      name: "Password",
      value: "",
      required: true,
      type: "password",
      validationType: "password"
    },
    {
      name: "ConfirmPassword",
      value: "",
      required: true,
      type: "password",
      validationType: "password"
    }
  ];

  const [formData, setFormData] = useState(init);
  const [loading,setLoading]=useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useApp();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    formData.forEach(field => {
      if (field.required && !field.value.trim()) {
        newErrors[field.name] = `${field.name} es requerido`;
        isValid = false;
      } else if (field.validationType && !validarCampo(field.value, field.validationType)) {
        newErrors[field.name] = `${field.name} no es válido`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

 
    if (formData[2].value !== formData[3].value) {
      toast.error('Passwords do not match');
      return;
    }

    // Convertir array a objeto { Email: value, Password: value }
    const formValues = formData.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {});

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const success=await register({
        name: formData[0].value,
        email: formData[1].value,
        password: formData[2].value
      });

      if(success) {
        //console.log("esta es la ruta: ",APP_ROUTES.PRIVATE.PROFILE)
        navigate(APP_ROUTES.PUBLIC.HOME.link, { 
          replace: true,
          state: { forceRefresh: true } // Puedes usar este estado para forzar recarga
        });
        //window.location.reload();
      }
      
    } catch (error) {
      console.log("error: ", error)
      toast.error(error.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
    
    //console.log("token: ",token)
    
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => 
      prev.map(item => 
        item.name === name 
          ? { ...item, value } 
          : item
      )
    );
    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit
  };
};