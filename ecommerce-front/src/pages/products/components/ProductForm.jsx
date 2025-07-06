import React from 'react';
import { useEffect } from 'react';
import { useProductForm } from '../hooks/useProductForm';

const ProductForm = ({ onSubmit, isUpdate, onCancel, initialProduct }) => {
  const {
    product,
    setProduct,
    setPrimaryImageIndex,
    primaryImageIndex,
    errors,
    loading,
    handleInputChange,
    handleImageUpload,
    setAsPrimary,
    removeImage
  } = useProductForm();

  useEffect(() => {
    if (initialProduct) {
      console.log("product 123: ",initialProduct)
      // Convertir imágenes del backend a formato de previsualización
      const formattedImages = initialProduct.images.map(img => ({
        preview: `data:${img.ContentType};base64,${img.Data}`,
        isPrimary: img.isPrimary
      }));
      
      setProduct({
        ...initialProduct,
        images: formattedImages
      });
      
      const primaryIdx = initialProduct.images.findIndex(img => img.isPrimary);
      setPrimaryImageIndex(primaryIdx >= 0 ? primaryIdx : -1);
    }
  }, [initialProduct, setProduct, setPrimaryImageIndex]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(product);
    } catch (error) {
      console.error("Error en el formulario:", error);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">
          {isUpdate ? 'Editar Producto' : 'Crear Nuevo Producto'}
        </h5>
        
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nombre *</label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              id="name"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              required
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Descripción</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="3"
              value={product.description}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Categoría</label>
            <input
              type="text"
              className="form-control"
              id="category"
              name="category"
              value={product.category}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="price" className="form-label">Precio *</label>
              <input
                type="number"
                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                id="price"
                name="price"
                min="0"
                value={product.price}
                onChange={handleInputChange}
                required
              />
              {errors.price && <div className="invalid-feedback">{errors.price}</div>}
            </div>
            
            <div className="col-md-6">
              <label htmlFor="stock" className="form-label">Stock</label>
              <input
                type="number"
                className="form-control"
                id="stock"
                name="stock"
                min="0"
                value={product.stock}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="images" className="form-label">Imágenes</label>
            <input
              type="file"
              className="form-control"
              id="images"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
            
            <div className="d-flex flex-wrap gap-3 mt-3">
              {product.images.map((img, index) => (
                <div key={index} className="position-relative" style={{ width: '100px', height: '100px' }}>
                  <img
                    src={img.preview}
                    alt={`Preview ${index}`}
                    className="img-thumbnail w-100 h-100 object-fit-cover"
                  />
                  <button
                    type="button"
                    className="position-absolute top-0 end-0 btn btn-danger btn-sm"
                    onClick={() => removeImage(index)}
                  >
                    &times;
                  </button>
                  <button
                    type="button"
                    className={` position-absolute bottom-0 start-0 btn btn-sm ${img.isPrimary ? 'btn-success' : 'btn-secondary'}`}
                    onClick={() => setAsPrimary(index)}
                  >
                    {img.isPrimary ? 'Principal' : 'Marcar'}
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1"></span>
                  {isUpdate ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                isUpdate ? 'Actualizar Producto' : 'Crear Producto'
              )}
            </button>
            
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
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

export default ProductForm;