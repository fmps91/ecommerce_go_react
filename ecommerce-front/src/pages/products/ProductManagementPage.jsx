import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaArrowUp, FaArrowDown, FaChevronRight, FaStepForward, FaChevronLeft, FaStepBackward } from 'react-icons/fa';
import { MdDeleteForever } from "react-icons/md";
import { ProductService } from '../../core/services/product.service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../core/constants/api.routes';
import { BsInbox } from 'react-icons/bs';
import ProductForm from './components/ProductForm';
import { useApp } from '../../contexts/AppContext';
import Navbar from '../../components/navbar/navbar';

const ProductManagementPage = () => {

  const [products, setProducts] = useState([]);
  const [loadingProd, setLoadingProd] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const navigate = useNavigate();
  //const { getme,loadUser,user } = useAuth();
  const { user, routes,getme,loading } = useApp();

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    search: "",
    sortBy: 'created_at',
    order: 'desc',
    category: "",
    stock: "0",
    images: true
  });

  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1
  });


  const handleCreate = () => {
    setCurrentProduct(null);
    setShowForm(true);
  };

  const handleUpdate = (product) => {
    setCurrentProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {

      try {
        await ProductService.delete_db(id)

        toast.success('Producto eliminado correctamente');
        //fetchProducts();
      } catch (error) {
        console.log("err: ", error)
        toast.error(error.message || 'Error al eliminar producto');
      }
    }
  };

  const handleSubmit = async (productData) => {
    try {
      const formData = new FormData();

      // Añadir campos básicos
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('category', productData.category);
      formData.append('price', productData.price);
      formData.append('stock', productData.stock);

      // Añadir imágenes (solo las nuevas)
      productData.images.forEach((img, index) => {
        if (img.file) {
          formData.append('images', img.file);
        } else if (img.isPrimary) {
          formData.append('primaryImageIndex', index.toString());
        }
      });

      if (currentProduct) {
        await ProductService.update(currentProduct.ID, formData);
        toast.success('Producto actualizado correctamente');
      } else {
        await ProductService.create(formData);
        toast.success('Producto creado correctamente');
      }

      fetchProducts();
      setShowForm(false);
    } catch (error) {
      throw new Error(error.message || (currentProduct ? 'Error al actualizar' : 'Error al crear'));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setCurrentProduct(null);
  };

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

  };

  const handleFilter = async (e) => {
    e.preventDefault()
    setFilters(prev => ({ ...prev, page: 1 }));
    setLoadingProd(true);
    try {

      const response = await ProductService.getAllParams(filters)
      console.log("response: ", response)
      setProducts(response.data.products)

    } catch (error) {
      console.log("errores: ", error)
    }
    setLoadingProd(false);
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
      // Si ya estamos ordenando por esta columna, cambiamos la dirección
      if (prev.sortBy === column) {
        return {
          ...prev,
          order: prev.order === 'asc' ? 'desc' : 'asc',
          page: 1 // Resetear a primera página al cambiar orden
        };
      }
      // Si es una columna nueva, ordenar asc por defecto
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


  useEffect(() => {
    fetchProducts();

    getme()
    //console.log("user: ",user)
    if (user==="") {
      navigate(APP_ROUTES.PUBLIC.HOME.link,{ 
        replace: true,
        state: { forceRefresh: true } // Puedes usar este estado para forzar recarga
      });
    }

  }, [filters.page, filters.pageSize, filters.sortBy, filters.order]);

  const fetchProducts = async () => {
    try {
      setLoadingProd(true);
      const response = await ProductService.getAllParams(filters);
      setProducts(response.data.products);
      setPagination({
        totalItems: response.data.pagination.total_items,
        totalPages: response.data.pagination.total_pages
      });
    } catch (error) {
      toast.error(error.message || 'Error al cargar productos');
    } finally {
      setLoadingProd(false);
    }
  };

  const handleSearch = async(e) => {
    localStorage.setItem("term",e)
    /* navigate(APP_ROUTES.PUBLIC.HOME.link,{ 
      replace: true,
      state: { forceRefresh: true } // Puedes usar este estado para forzar recarga
    }); */
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
        <h2>Product Management</h2>
        <button
          className="btn btn-primary"
          onClick={handleCreate}
        >
          <FaPlus className="me-2" />
          Add Product
        </button>
      </div>

      {showForm && (
        <ProductForm
          onSubmit={handleSubmit}
          isUpdate={!!currentProduct}
          onCancel={handleCancel}
          initialProduct={currentProduct}
        />
      )}



      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Filtros de Productos</h5>
          <form onSubmit={handleFilter}>
            {/* Paginación */}
            <div className="row mb-3">
              <div className="col-md-3">
                <label htmlFor="page" className="form-label">Página</label>
                <input
                  type="number"
                  className="form-control"
                  id="page"
                  name="page"
                  min="1"
                  value={filters.page}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="pageSize" className="form-label">Productos por página</label>
                <input
                  type="number"
                  className="form-control"
                  id="pageSize"
                  name="pageSize"
                  min="1"
                  max="21"
                  value={filters.pageSize}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Búsqueda */}
            <div className="mb-3">
              <label htmlFor="search" className="form-label">Buscar</label>
              <input
                type="text"
                className="form-control"
                id="search"
                name="search"
                placeholder="Nombre o descripción"
                value={filters.search}
                onChange={handleChange}
              />
              <div className="form-text">
                La búsqueda es insensible a mayúsculas/minúsculas
              </div>
            </div>

            {/* Ordenación */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="sortBy" className="form-label">Ordenar por</label>
                <select
                  className="form-select"
                  id="sortBy"
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleChange}
                >
                  <option value="created_at">Fecha de creación</option>
                  <option value="name">Nombre</option>
                  <option value="price">Precio</option>
                  <option value="stock">Stock</option>
                  <option value="updated_at">Fecha de actualización</option>
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="order" className="form-label">Dirección</label>
                <select
                  className="form-select"
                  id="order"
                  name="order"
                  value={filters.order}
                  onChange={handleChange}
                >
                  <option value="desc">Descendente</option>
                  <option value="asc">Ascendente</option>
                </select>
              </div>
            </div>

            {/* Filtros adicionales */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="category" className="form-label">Categoría</label>
                <input
                  type="text"
                  className="form-control"
                  id="category"
                  name="category"
                  placeholder="Filtrar por categoría"
                  value={filters.category}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="stock" className="form-label">Stock</label>
                <select
                  className="form-select"
                  id="stock"
                  name="stock"
                  value={filters.stock}
                  onChange={handleChange}
                >
                  <option value="0">Todos</option>
                  <option value="in_stock">En stock</option>
                  <option value="out_of_stock">Sin stock</option>
                  <option value="5">Stock mayor a 5</option>
                  <option value="10">Stock mayor a 10</option>
                </select>
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="images"
                    name="images"
                    checked={filters.images}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="images">
                    Incluir imágenes
                  </label>
                </div>
              </div>
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">
                Aplicar Filtros
              </button>
            </div>
          </form>
        </div>
      </div>

      {loadingProd ? (
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
                    <th>Image</th>
                    <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                      Name {renderSortIcon('name')}
                    </th>
                    <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                      Price {renderSortIcon('price')}
                    </th>
                    <th onClick={() => handleSort('stock')} style={{ cursor: 'pointer' }}>
                      Stock {renderSortIcon('stock')}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.ID}>
                      <td>{product.ID}</td>
                      <td>
                        {product.images?.length > 0 ? (
                          <img
                            src={`data:${product.images[0].ContentType};base64,${product.images[0].Data}`}
                            alt={product.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        ) : (
                            <BsInbox size="40" />
                          )}
                      </td>
                      <td>{product.name}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>{product.stock}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleUpdate(product)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(product.ID)}
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

export default ProductManagementPage;