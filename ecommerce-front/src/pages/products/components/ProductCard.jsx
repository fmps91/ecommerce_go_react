import { FaCartPlus, FaEye } from 'react-icons/fa';
import { useCart } from '../../../contexts/CartContext';
import { APP_ROUTES } from '../../../core/constants/api.routes';
import { useNavigate } from 'react-router-dom';
import { BsInbox } from "react-icons/bs";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="card product-card" style={{height:"20em"}}>
      {product.images.length > 0 ?

        <div className="d-flex justify-content-center p-0">
          <img
            style={{ width: "10em" }}
            src={`data:${product.images[0].ContentType};base64,${product.images[0].Data}`}
            alt={product.name}
            loading="lazy"
            className="img-fluid" // Opcional: hace que la imagen sea responsive
          />
        </div>
        :
        <div className="pt-4">
          <h5 className="text-center">image not available</h5>
          <BsInbox size="99" className="card-img-top product-image" />
        </div>


      }
      <div className="card-body">
        <h5 className="card-title">{product?.name}</h5>
        <p className="card-text">${product?.price.toFixed(2)}</p>
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => navigate(`${APP_ROUTES.PUBLIC.PRODUCT_DETAIL.link.replace(':id', product?.ID)}`)}
          >
            <FaEye /> View
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => addToCart(product)}
          >
            <FaCartPlus /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;