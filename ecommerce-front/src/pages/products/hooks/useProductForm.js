import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const useProductForm = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    images: []
  });
  
  const [primaryImageIndex, setPrimaryImageIndex] = useState(-1);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = files.map(file => {
      if (!file.type.match('image.*')) {
        setError('Por favor, sube solo archivos de imagen');
        return null;
      }
      return file;
    }).filter(Boolean);

    // Previsualización de imágenes
    const imagePreviews = [];
    newImages.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        imagePreviews.push({
          preview: reader.result,
          file,
          isPrimary: product.images.length === 0 && imagePreviews.length === 0
        });

        if (imagePreviews.length === newImages.length) {
          setProduct(prev => ({
            ...prev,
            images: [...prev.images, ...imagePreviews]
          }));
          
          if (product.images.length === 0 && imagePreviews.length > 0) {
            setPrimaryImageIndex(0);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const setAsPrimary = (index) => {
    const updatedImages = product.images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    
    setProduct(prev => ({
      ...prev,
      images: updatedImages
    }));
    setPrimaryImageIndex(index);
  };

  const removeImage = (index) => {
    const updatedImages = product.images.filter((_, i) => i !== index);
    setProduct(prev => ({
      ...prev,
      images: updatedImages
    }));
    
    if (primaryImageIndex === index) {
      setPrimaryImageIndex(updatedImages.length > 0 ? 0 : -1);
    } else if (index < primaryImageIndex) {
      setPrimaryImageIndex(prev => prev - 1);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!product.name.trim()) newErrors.name = 'El nombre es requerido';
    if (product.price <= 0) newErrors.price = 'El precio debe ser mayor que cero';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const prepareFormData = (productData) => {
    const formData = new FormData();
    
    // Añadir campos básicos
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('category', productData.category);
    formData.append('price', productData.price.toString());
    formData.append('stock', productData.stock.toString());
    
    // Añadir imágenes
    productData.images.forEach((img, index) => {
      if (img.file) {
        formData.append('images', img.file);
      }
    });
    
    return formData;
  };


  const resetForm = () => {
    setProduct({
      name: '',
      description: '',
      category: '',
      price: 0,
      stock: 0,
      images: []
    });
    setPrimaryImageIndex(-1);
    setErrors({});
  };

  return {
    product,
    setProduct,
    primaryImageIndex,
    errors,
    loading,
    setPrimaryImageIndex,
    handleInputChange,
    handleImageUpload,
    setAsPrimary,
    removeImage,
    //createProduct,
    //updateProduct,
    //deleteProduct,
    resetForm
  };
};