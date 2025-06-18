import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaSearch, FaUserShield, FaUser } from 'react-icons/fa';
import { UserService } from '../../core/services/user.service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../core/constants/api.routes';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserService.getAll({ email: searchTerm });
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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
      </div>

      <div className="mb-3">
        <div className="input-group">
          <span className="input-group-text">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search users by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchUsers()}
          />
          <button 
            className="btn btn-outline-secondary" 
            onClick={fetchUsers}
          >
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className={`btn btn-sm ${user.isAdmin ? 'btn-success' : 'btn-secondary'}`}
                      onClick={() => toggleAdminStatus(user.id, user.isAdmin)}
                    >
                      {user.isAdmin ? (
                        <>
                          <FaUserShield className="me-1" />
                          Admin
                        </>
                      ) : (
                        <>
                          <FaUser className="me-1" />
                          User
                        </>
                      )}
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => navigate(`${APP_ROUTES.ADMIN.USER_MANAGEMENT}/${user.id}`)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      <FaTrash />
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

export default UserManagementPage;