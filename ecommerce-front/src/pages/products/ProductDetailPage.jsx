import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
//import { Container, Row, Col, Spinner, Button, Alert } from 'bootstrap';
import { ProductService } from '../../core/services/product.service';
import { useCart } from '../../contexts/CartContext';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../core/constants/api.routes';
import { BsInbox } from 'react-icons/bs';
import Navbar from '../../components/navbar/navbar';
import InputCustom from '../../components/Input';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const resp = await ProductService.getById(id);
        resp.data.quantity=0
        setProduct(resp.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="my-5 text-center">
        <div animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-5">
        <div variant="danger">{error}</div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container py-2">
      <div className="pb-4">
        <Navbar

        />
      </div>

      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate(APP_ROUTES.PUBLIC.PRODUCTS)}
      >
        <FaArrowLeft /> Back to Products
      </button>


      <div className="row">
        <div className="col-md-6">
          <div className="product-image-container mb-4">
            {product.images.length > 0 ?

              <div className="d-flex justify-content-center">
                <img
                  //style={{ width: "10em" }}
                  src={`data:${product.images[0].ContentType};base64,${product.images[0].Data}`}
                  alt={product.name}
                  className="img-fluid" // Opcional: hace que la imagen sea responsive
                />
              </div>
              :
              <div className="pt-4">
                <h5 className="text-center">image not available</h5>
                <BsInbox size="100" className="card-img-top product-image" />
              </div>
            }

          </div>
        </div>
        <div className="col-md-6">
          <h1>{product?.name}</h1>
          <p className="text-muted">{product?.description}</p>
          <h3 className="my-4">${product?.price.toFixed(2)}</h3>

          <div className="row pb-4">
            <div className="col-2">
            quantity
            </div>
            <div className="col-6">
            <InputCustom
                type={"text"}
                value={quantity}
                onChange={(v) =>
                  setQuantity(v)
                }
                required={true}
                
              />
            </div>
          
          </div>
          <div className="d-flex gap-3 mb-4">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => addToCart(product,quantity)}
            >
              <FaShoppingCart /> Add to Cart
        </button>
          </div>
          

          <div className="product-details">
            <h5>Details</h5>
            <ul className="list-unstyled">
              <li>Stock: {product?.stock}</li>
              <li>Category: {product?.category}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;