import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

export const useUserForm = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    is_admin: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!user.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!user.email.trim()) newErrors.email = 'El email es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = 'Email no válido';
    }
    if (!user.password && !user.id) newErrors.password = 'La contraseña es requerida';
    else if (user.password && user.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createUser = async () => {
    if (!validateForm()) return false;
    
    setLoading(true);
    try {
      const response = await AuthService.register(user)
      toast.success('Usuario creado exitosamente');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear usuario');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id) => {
    if (!validateForm()) return false;
    
    setLoading(true);
    try {
      //const response = await axios.put(`/api/users/${id}`, user);
      const response = await UserService.update(id,user)
      toast.success('Usuario actualizado exitosamente');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar usuario');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return false;
    
    setLoading(true);
    try {
      await UserService.delete_db(id)
      toast.success('Usuario eliminado exitosamente');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar usuario');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUser({
      name: '',
      email: '',
      password: '',
      is_admin: ''
    });
    setErrors({});
  };

  return {
    user,
    setUser,
    errors,
    loading,
    handleInputChange,
    createUser,
    updateUser,
    deleteUser,
    resetForm
  };
};