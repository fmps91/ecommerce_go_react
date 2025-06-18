import { useState, useEffect } from 'react';
import { ProductService } from '../services/product.service';

export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Flag para rastrear si el componente está montado
  
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const resp = await ProductService.getAll(params);
        
        // Solo actualiza el estado si el componente está montado
        if (isMounted) {
          //console.log("data: ", resp.data.products);
          resp.data.products.map((e)=>e.quantity=0)
          setProducts(resp.data.products);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
  
    fetchProducts();
  
    // Función de limpieza que se ejecuta al desmontar el componente
    return () => {
      isMounted = false;
    };
  }, []);

  const handleGetProducts=async (querys)=>{
    
    fetchProductsParams(querys);
  }

  const fetchProductsParams = async (querys) => {
    try {
      setLoading(true);
      const resp= await ProductService.getAllParams({},querys)
      console.log("data: ",resp.data.products)
      setProducts(resp.data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchProductsParams,
    handleGetProducts, 
    products, 
    loading, 
    error 
  };


};