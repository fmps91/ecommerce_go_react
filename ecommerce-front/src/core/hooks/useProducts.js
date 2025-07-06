import { useState, useEffect } from 'react';
import { ProductService } from '../services/product.service';

export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);


  const handleGetProducts=async (params)=>{
    await fetchProductsParams(params);
  }

  const fetchProductsParams = async (params) => {
    try {
      setLoadingProducts(true);
      const resp= await ProductService.getAllParams(params)
      console.log("data: ",resp.data.products)
      setProducts(resp.data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  return {
    fetchProductsParams,
    handleGetProducts, 
    products, 
    loadingProducts, 
    error 
  };


};