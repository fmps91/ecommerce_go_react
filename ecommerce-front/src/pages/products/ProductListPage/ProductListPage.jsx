import { useState } from 'react';
//import { Container, Row, Col, Spinner, Form } from 'bootstrap';
import { useProducts } from '../../../core/hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { FaSearch } from 'react-icons/fa';
import Navbar from '../../../components/navbar/navbar';
import InputCustom from '../../../components/Input';

const ProductListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { fetchProductsParams, handleGetProducts, products, loading, error } = useProducts({
    name: searchTerm,
    page: 1,
    pageSize: 10
  });


  const handleSearch = (term) => {
    setSearchTerm(term);
    const querys={
      search:term
    }
    fetchProductsParams(querys)
  };


  return (

    <div className="container ">

      <Navbar
        onSearch={handleSearch}
      />

      {loading ? (
        <div key="spin" className="text-center my-5">
          <div className="spinner-border" role="status">
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
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