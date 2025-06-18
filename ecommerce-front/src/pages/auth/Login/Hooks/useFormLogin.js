// src/hooks/useFormLogin.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { APP_ROUTES } from '@/core/constants/api.routes';
import { validarCampo } from '@/utils/validations';

export const useFormLogin = () => {
  const init = [
    {
      name: "Email",
      value: "admin@1.com",
      required: true,
      type: "email",
      validationType: "email" 
    },
    {
      name: "Password",
      value: "megaman92",
      required: true,
      type: "password",
      validationType: "password"
    }
  ];

  const [formData, setFormData] = useState(init);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
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
    
    if (!validateForm()) {
      return;
    }

    // Convertir array a objeto { Email: value, Password: value }
    const formValues = formData.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {});

    const success = await login(formValues);
    //console.log("token: ",token)
    if (success) {
      //console.log("esta es la ruta: ",APP_ROUTES.PRIVATE.PROFILE)
      navigate(APP_ROUTES.PUBLIC.PRODUCTS, { 
        replace: true,
        state: { forceRefresh: true } // Puedes usar este estado para forzar recarga
      });
      window.location.reload();
     
    }
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