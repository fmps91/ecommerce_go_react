import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import UserForm from './UserForm';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../../../core/services/user.service';


const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserService.getAll();
      console.log("users: ",response.data)
      setUsers(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await UserService.delete(userId);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error(error.message || 'Failed to delete user');
      }
    }
  };

  const toggleAdminStatus = async (userId, currentStatus) => {
    try {
      await UserService.changeRole(userId, !currentStatus);
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Failed to update user role');
    }
  };



  const handleSuccess = () => {
    fetchUsers();
    setShowForm(false);
    setEditingUser(null);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Administración de Usuarios</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingUser(null);
            setShowForm(true);
          }}
        >
          Crear Nuevo Usuario
        </button>
      </div>

      {showForm && (
        <div className="mb-4">
          <UserForm 
            userData={editingUser} 
            onSuccess={handleSuccess}
            isUpdate={!!editingUser}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.ID}>
                  <td>{user.ID}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.is_admin ? (
                      <span className="badge bg-danger">Admin</span>
                    ) : (
                      <span className="badge bg-secondary">Usuario</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => {
                        setEditingUser(user);
                        setShowForm(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(user.ID)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;