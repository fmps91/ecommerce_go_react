import { useState, useEffect } from 'react';
//import { Card, Container, Row, Col } from 'bootstrap';
import { 
  FaBoxes, 
  FaUsers, 
  FaDollarSign, 
  FaChartLine 
} from 'react-icons/fa';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { UserService } from '../../core/services/user.service';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          ProductService.getAll(),
          UserService.getAll(),  // <- Esto usa UserService
          OrderService.getAll()
        ]);

        const revenue = ordersRes.data.reduce(
          (sum, order) => sum + order.total, 0
        );

        setStats({
          totalProducts: productsRes.data.length,
          totalUsers: usersRes.data.length,
          totalOrders: ordersRes.data.length,
          totalRevenue: revenue
        });
      } catch (error) {
        setError(error.message || 'Failed to load dashboard stats');
        console.error('Error:', error);
      
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container my-5 text-center">
  <div className="spinner-border" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
</div>

    );
  }

  return (
    <div className="container my-5">
  <h2 className="mb-4">Admin Dashboard</h2>
  
  <div className="row g-4 mb-4">
    <div className="col-md-3">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
              <FaBoxes size={24} className="text-primary" />
            </div>
            <div>
              <h6 className="mb-0">Total Products</h6>
              <h3 className="mb-0">{stats.totalProducts}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="col-md-3">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="bg-success bg-opacity-10 p-3 rounded me-3">
              <FaUsers size={24} className="text-success" />
            </div>
            <div>
              <h6 className="mb-0">Total Users</h6>
              <h3 className="mb-0">{stats.totalUsers}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="col-md-3">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="bg-warning bg-opacity-10 p-3 rounded me-3">
              <FaChartLine size={24} className="text-warning" />
            </div>
            <div>
              <h6 className="mb-0">Total Orders</h6>
              <h3 className="mb-0">{stats.totalOrders}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="col-md-3">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="bg-info bg-opacity-10 p-3 rounded me-3">
              <FaDollarSign size={24} className="text-info" />
            </div>
            <div>
              <h6 className="mb-0">Total Revenue</h6>
              <h3 className="mb-0">${stats.totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default AdminDashboard;