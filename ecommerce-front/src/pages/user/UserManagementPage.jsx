import { useState, useEffect } from 'react';
import { 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaSearch, 
  FaArrowUp, 
  FaArrowDown, 
  FaChevronRight, 
  FaStepForward, 
  FaChevronLeft, 
  FaStepBackward,
  FaUserShield,
  FaUser
} from 'react-icons/fa';
import { UserService } from '../../core/services/user.service';
import { toast } from 'react-toastify';
import UserForm from './components/UserForm';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [current, setCurrent] = useState(null);
  const navigate = useNavigate();
  //const { getme,loadUser,user } = useAuth();
  const { user, routes,getme,loading } = useApp();
  
  // Estado para filtros y paginación
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 2,
    name: "",
    email: "",
    sortBy: 'created_at',
    order: 'desc',
    is_admin: "" // "all", "true", "false"
  });

  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1
  });

  // Obtener usuarios cuando cambian los filtros
  useEffect(() => {
    fetchUsers();

    getme()
    //console.log("user: ",user)
    if (user==="") {
      navigate(APP_ROUTES.PUBLIC.HOME.link,{ 
        replace: true,
        state: { forceRefresh: true } // Puedes usar este estado para forzar recarga
      });
    }


  }, [filters.page, filters.pageSize, filters.sortBy, filters.order]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      
      // Preparar parámetros para la API
      const params = {
        page: filters.page,
        pageSize: filters.pageSize,
        search: filters.search,
        sort_by: filters.sortBy,
        order: filters.order,
        isAdmin: filters.isAdmin
      };

      const response = await UserService.getAll(params);
      console.log("response: ",response.data)
      setUsers(response.data.users);
      setPagination({
        totalItems: response.data.pagination.total_items,
        totalPages: response.data.pagination.total_pages
      });
    } catch (error) {
      toast.error(error.message || 'Error al cargar usuarios');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Manejar cambio de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  // Manejar ordenación por columna
  const handleSort = (column) => {
    setFilters(prev => {
      if (prev.sortBy === column) {
        return {
          ...prev,
          order: prev.order === 'asc' ? 'desc' : 'asc',
          page: 1
        };
      }
      return {
        ...prev,
        sortBy: column,
        order: 'asc',
        page: 1
      };
    });
  };

  // Renderizar ícono de ordenación
  const renderSortIcon = (column) => {
    if (filters.sortBy !== column) return null;
    return filters.order === 'asc' ? <FaArrowUp /> : <FaArrowDown />;
  };

  // Manejar cambios en los filtros
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Aplicar filtros (resetear a página 1)
  const handleFilter = async (e) => {
    e.preventDefault();
    await fetchUsers();
  };

  const handleSearch = async(e) => {
    localStorage.setItem("term",e)
    /* navigate(APP_ROUTES.PUBLIC.HOME.link,{ 
      replace: true,
      state: { forceRefresh: true } // Puedes usar este estado para forzar recarga
    }); */
  };

  // Manejar creación/edición de usuarios
  const handleCreate = () => {
    setCurrent(null)
    setShowFilters(false)
    setShowForm(true);
  };

  const handleUpdate = (user) => {
    setCurrent(user)
    setShowFilters(false)
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await UserService.delete_db(userId)
        toast.success('Usuario eliminado correctamente');
        fetchUsers();
      } catch (error) {
        toast.error(error.message || 'Error al eliminar usuario');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowFilters(true)
    setCurrent(null);
  };

  const handleSubmit = async() => {
    setShowForm(false);
    setShowFilters(true)
    await fetchUsers();
  };

  return (
    <div className="container mt-4">

      {loading == true ?
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

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Administración de Usuarios</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          <FaPlus className="me-2" />
          Crear Usuario
        </button>
      </div>

      {showForm && (
        <UserForm 
          onSubmit={handleSubmit}
          isUpdate={!!current}
          onCancel={handleCancel}
          initial={current}
        />
      )}

      {showFilters && (
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Filtros de Usuarios</h5>
          <form onSubmit={handleFilter}>
            <div className="row g-3">
              
              <div className="col-md-6">
                <label htmlFor="search" className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="Nombre"
                  value={filters.name}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="search" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="correo@1.com"
                  value={filters.email}
                  onChange={handleChange}
                />
              </div>

              
              <div className="col-md-3">
                <label htmlFor="isAdmin" className="form-label">Rol</label>
                <select
                  className="form-select"
                  id="isAdmin"
                  name="isAdmin"
                  value={filters.isAdmin}
                  onChange={handleChange}
                >
                  <option value="">All</option>
                  <option value="true">Administradores</option>
                  <option value="false">Usuarios normales</option>
                </select>
              </div>

              
              <div className="col-md-3">
                <label htmlFor="sortBy" className="form-label">Ordenar por</label>
                <select
                  className="form-select"
                  id="sortBy"
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleChange}
                >
                  <option value="created_at">Fecha creación</option>
                  <option value="name">Nombre</option>
                  <option value="email">Email</option>
                </select>
              </div>

              
              <div className="col-md-2">
                <label htmlFor="order" className="form-label">Orden</label>
                <select
                  className="form-select"
                  id="order"
                  name="order"
                  value={filters.order}
                  onChange={handleChange}
                >
                  <option value="asc">Ascendente</option>
                  <option value="desc">Descendente</option>
                </select>
              </div>

              
              <div className="col-md-2">
                <label htmlFor="pageSize" className="form-label">Por página</label>
                <select
                  className="form-select"
                  id="pageSize"
                  name="pageSize"
                  value={filters.pageSize}
                  onChange={handleChange}
                >
                  <option value="2">2</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      )}

      {loadingUsers ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="table-responsive mb-3">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th onClick={() => handleSort('ID')} style={{ cursor: 'pointer' }}>
                    ID {renderSortIcon('ID')}
                  </th>
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                    Nombre {renderSortIcon('name')}
                  </th>
                  <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                    Email {renderSortIcon('email')}
                  </th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.ID}>
                    <td>{user.ID}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${user.is_admin ? 'bg-success' : 'bg-secondary'}`}>
                        {user.is_admin ? (
                          <>
                            <FaUserShield className="me-1" />
                            Admin
                          </>
                        ) : (
                          <>
                            <FaUser className="me-1" />
                            Usuario
                          </>
                        )}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleUpdate(user)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(user.ID)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="6" className="text-center">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="me-2">
                          Mostrando {(filters.page - 1) * filters.pageSize + 1} -{' '}
                          {Math.min(filters.page * filters.pageSize, pagination.totalItems)} de{' '}
                          {pagination.totalItems} productos
                        </span>
                      </div>
                      <div>
                        <span className="me-3">
                          Página {filters.page} de {pagination.totalPages}
                        </span>
                        <button 
                          className="btn btn-sm btn-outline-secondary me-1"
                          onClick={() => handlePageChange(1)}
                          disabled={filters.page === 1}
                        >
                          <FaStepBackward />
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-secondary me-1"
                          onClick={() => handlePageChange(filters.page - 1)}
                          disabled={filters.page === 1}
                        >
                          <FaChevronLeft />
                        </button>
                        <span className="mx-2">
                          {filters.page}
                        </span>
                        <button 
                          className="btn btn-sm btn-outline-secondary me-1"
                          onClick={() => handlePageChange(filters.page + 1)}
                          disabled={filters.page >= pagination.totalPages}
                        >
                          <FaChevronRight />
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handlePageChange(pagination.totalPages)}
                          disabled={filters.page >= pagination.totalPages}
                        >
                          <FaStepForward />
                        </button>
                      </div>
                      <div>
                        <select
                          className="form-select form-select-sm"
                          value={filters.pageSize}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            pageSize: Number(e.target.value),
                            page: 1 // Reset to first page when changing page size
                          }))}
                          style={{ width: '80px' }}
                        >
                          <option value="2">2</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="50">50</option>
                        </select>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>

           
    
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagementPage;