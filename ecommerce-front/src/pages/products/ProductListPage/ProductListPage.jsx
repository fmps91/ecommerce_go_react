import { useState, useEffect } from 'react';
//import { Container, Row, Col, Spinner, Form } from 'bootstrap';
import { useProducts } from '../../../core/hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { FaSearch } from 'react-icons/fa';
import Navbar from '../../../components/navbar/navbar';
import InputCustom from '../../../components/Input';
//import { useAuth } from '../../../contexts/AuthContext';
import { useApp } from '../../../contexts/AppContext';

const ProductListPage = () => {
  /* const { user, loading, routesReady, routes, getme, login, logout } = useAuth(); */
  //const { user, loading, routesReady, routes, getme, login, logout } = useAuth();

  const { user, loading, routesReady, routes, getme, login, logout } = useApp();

  

  const { fetchProductsParams, handleGetProducts, products, loadingProducts, error } = useProducts({
    name: localStorage.getItem("term"),
    page: 1,
    pageSize: 5
  });


  const handleSearch = async (e) => {
    
    const querys = {
      search: localStorage.getItem("term")
    }
    //handleGetProducts(querys);
    await fetchProductsParams(querys)
    //console.log("console: ",query)
  };


  useEffect(() => {
    
    const querys = {
      search: localStorage.getItem("term")
    }
    //handleGetProducts(querys);
    fetchProductsParams(querys)

  }, []);

  

  return (

    <div className="container ">

      {loading == true ?
        <div key="spin1" className="text-center my-5">
          <div className="spinner-border" role="status">
          </div>
        </div>
        :

        <div className="" role="">
          
          <Navbar
            onSearch={handleSearch}
            routes={routes}
          />
        </div>


      }

      {loadingProducts ? (
        <div key="spin" className="text-center my-5">
          <div className="spinner-border" role="status">
          </div>
        </div>
      ) : error ? (

        <div className="alert alert-danger">
          {error}
          <div>
            aqui es
          </div>
        </div>
      ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
              {products.map((product) => (
                <div key={product.ID} className="col" >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
    </div>
  );
};

export default ProductListPage;