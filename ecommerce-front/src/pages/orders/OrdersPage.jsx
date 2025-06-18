import { useState, useEffect } from 'react';
//import { Table, Container, Badge } from 'bootstrap';
import { OrderService } from '../../core/services/order.service';
import { useAuth } from '../../contexts/AuthContext';
import { FaBoxOpen } from 'react-icons/fa';
import { APP_ROUTES } from '../../core/constants/api.routes';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await OrderService.getUserOrders();
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <div className="container my-5">
  <h2 className="mb-4">My Orders</h2>
  
  {orders.length === 0 ? (
    <div className="text-center py-5">
      <FaBoxOpen size={48} className="mb-3 text-muted" />
      <h4>No orders found</h4>
      <p className="text-muted">You haven't placed any orders yet.</p>
      <button 
        className="btn btn-primary"
        onClick={() => navigate(APP_ROUTES.PUBLIC.PRODUCTS)}
      >
        Browse Products
      </button>
    </div>
  ) : (
    <div className="table-responsive">
      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>{order.orderDetails.length}</td>
              <td>${order.total.toFixed(2)}</td>
              <td>{getStatusBadge(order.status)}</td>
              <td>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate(`${APP_ROUTES.PRIVATE.ORDERS}/${order.id}`)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
  );
};

export default OrdersPage;