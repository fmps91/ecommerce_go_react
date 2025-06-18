import { useContext } from 'react';
import { useCart } from '../../contexts/CartContext'; // Cambia esta línea
//import { Table, Button, Container, Row, Col, Card } from 'bootstrap';
import { FaTrash, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { APP_ROUTES } from '../../core/constants/api.routes';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Lógica de checkout iría aquí
    toast.success('Order placed successfully!');
    clearCart();
    navigate(APP_ROUTES.PRIVATE.ORDERS);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  return (
    <div className="container my-5">
  <button 
    className="btn btn-outline-secondary mb-4"
    onClick={() => navigate(APP_ROUTES.PUBLIC.PRODUCTS)}
  >
    <FaArrowLeft /> Continue Shopping
  </button>

  <h2 className="mb-4">Your Shopping Cart</h2>
  
  {cartItems.length === 0 ? (
    <div className="card">
      <div className="card-body text-center py-5">
        <FaShoppingCart size={48} className="mb-3 text-muted" />
        <h4>Your cart is empty</h4>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate(APP_ROUTES.PUBLIC.PRODUCTS)}
        >
          Browse Products
        </button>
      </div>
    </div>
  ) : (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <img 
                      src={`data:image/jpeg;base64,${item.image}`} 
                      alt={item.name}
                      style={{ width: '50px', marginRight: '15px' }}
                    />
                    {item.name}
                  </div>
                </td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    style={{ width: '60px' }}
                    className="form-control"
                  />
                </td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="row mt-4">
        <div className="col-md-4 offset-md-8">
          <div className="card">
            <div className="card-body">
              <h5>Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping:</span>
                <span>$0.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong>${total.toFixed(2)}</strong>
              </div>
              <button 
                className="btn btn-primary w-100 mt-3"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )}
</div>
  );
};

export default CartPage;