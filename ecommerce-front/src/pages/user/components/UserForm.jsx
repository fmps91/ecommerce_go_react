import React, { useEffect } from 'react';
import { useUserForm } from '../hooks/useUserForm';

const UserForm = ({ onSubmit, isUpdate, onCancel, initial }) => {

//const UserForm = ({ userData, onSuccess, isUpdate, onCancel, initialProduct }) => {
  const {
    user,
    setUser,
    errors,
    loading,
    handleInputChange,
    createUser,
    updateUser,
    resetForm
  } = useUserForm();

  // Si recibimos datos de usuario (para edición)
  useEffect(() => {
    if (initial) {
      setUser({
        id: initial.ID,
        name: initial.name,
        email: initial.email,
        password: initial.password,
        is_admin: initial.is_admin
      });
      
    }
    console.log("all user: ",user)
  }, [initial,setUser,isUpdate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success;
    
    if (isUpdate) {
      success = await updateUser(user.id);
    } else {
      success = await createUser();
    }
    
    if (success) {
      onSubmit();
      if (!isUpdate) resetForm();
    }
  };



  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title text-align-center">
          {isUpdate ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </h5>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nombre</label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              id="name"
              name="name"
              value={user.name}
              onChange={handleInputChange}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              {isUpdate ? 'Nueva Contraseña (dejar en blanco para no cambiar)' : 'Contraseña'}
            </label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              id="password"
              name="password"
              value={user.password}
              onChange={handleInputChange}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
          
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="is_admin"
              name="is_admin"
              checked={user.is_admin}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="isAdmin">Administrador</label>
          </div>
          
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                  <span role="status"> {isUpdate ? 'Actualizando...' : 'Creando...'}</span>
                </>
              ) : (
                isUpdate ? 'Actualizar Usuario' : 'Crear Usuario'
              )}
            </button>
            
            
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => {
                  resetForm();
                  onCancel();
                }}
              >
                Cancelar
              </button>
           
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;