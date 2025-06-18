import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { validarCampo } from '@/utils/validations';
import { APP_ROUTES } from '@/core/constants/api.routes';
import { AuthService } from '../../../core/services/auth.service';


export const useFormProfile = () => {
  const { user, loadUser,setUser } = useAuth()

  const init = [
    {
      name: "Id",
      value: user.id,
      required: false,
      type: "text",
      validationType: "text",
    },
    {
      name: "Name",
      value: user.name,
      required: true,
      type: "text",
      validationType: "text",
    },
    {
      name: "Email",
      value: user.email,
      required: true,
      type: "email",
      validationType: "email",
    },
    {
      name: "Password",
      value: "",
      required: true,
      type: "password",
      validationType: "password",
    },
  ]

  const [formData, setFormData] = useState(init)
  const [tempData, setTempData] = useState(init)
  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)


  useEffect(() => {
    loadUser()
    setFormData(init)
  }, [])


  // Actualizar tempData cuando formData cambie
  useEffect(() => {
    setTempData(formData)
  }, [formData])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Actualizar tempData manteniendo la estructura de array
    setTempData((prev) =>
      prev.map((field) => (field.name.toLowerCase() === name.toLowerCase() ? { ...field, value } : field)),
    )

    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
  
    tempData.forEach((field) => {
      const fieldName = field.name.toLowerCase();
      const fieldValue = field.value?.toString().trim() || "";
  
      // Solo validar campos requeridos o que tengan valor
      if (field.required || fieldValue) {
        // Validación de campo vacío
        if (field.required && !fieldValue) {
          newErrors[fieldName] = `${field.name} es requerido`;
          isValid = false;
        } 
        // Validación de formato solo si hay valor
        else if (fieldValue && field.validationType && !validarCampo(fieldValue, field.validationType)) {
          newErrors[fieldName] = `${field.name} no es válido`;
          isValid = false;
        }
      }
    });
  
    setErrors(newErrors);
    return isValid;
  };

  const handleEdit = () => {
    setIsEditing(true)
    setTempData([...formData]) // Crear una copia profunda
    setErrors({})
  }

  const handleCancel = () => {
    setIsEditing(false)
    setTempData([...formData]) // Restaurar datos originales
    setErrors({})
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
  
    console.log("Validando formulario...");
    //console.log("Datos a validar:", tempData);
  
    if (!validateForm()) {
      console.log("Errores de validación:", errors);
      return false;
    }
  
    setIsLoading(true);
  
    try {
      // Convertir array a objeto { Email: value, Password: value }
      const formValues = tempData.reduce((acc, field) => {
        // Solo enviar password si ha cambiado o no está vacío
        if (field.name.toLowerCase() !== 'password' || field.value) {
          acc[field.name] = field.value;
        }
        return acc;
      }, {});
  
      console.log("Datos a enviar:", formValues);
  
      // Aquí tu lógica de actualización real
      const updatedUser = await AuthService.update(
        formValues.Id,
        {
          "name":formValues['Name'],
          "email":formValues['Email'],
          "password":formValues['Password'],  
        }
        );
      console.log("request: ",updatedUser)
      /* const updatedUser = await AuthService.update(formValues);
      
      if (updatedUser) {
        setFormData(tempData);
        setUser(updatedUser);
        setIsEditing(false);
        setErrors({});
        return true;
      } */
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      setErrors({ 
        general: error.message || "Error al actualizar el perfil. Inténtalo de nuevo." 
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función helper para obtener un campo por nombre
  const getFieldByName = (name) => {
    return tempData.find((field) => field.name.toLowerCase() === name.toLowerCase()) || { value: "" }
  }

  // Función helper para obtener valor de campo
  const getFieldValue = (name) => {
    const field = getFieldByName(name)
    return field.value
  }

  return {
    formData,
    tempData,
    isEditing,
    isLoading,
    showPassword,
    errors, // Ahora se exporta errors
    setFormData,
    setTempData,
    setErrors,
    setIsLoading,
    setShowPassword,
    handleInputChange,
    handleEdit,
    handleCancel,
    handleSubmit,
    getFieldByName,
    getFieldValue,
  }
}
