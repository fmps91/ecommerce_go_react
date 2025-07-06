import { useState, useEffect } from 'react';
//import { Card, Container, Row, Col } from 'bootstrap';
import {
  FaBoxes,
  FaUsers,
  FaDollarSign,
  FaChartLine
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../core/constants/api.routes';
import Navbar from '../../components/navbar/navbar';
import { useApp } from '../../contexts/AppContext';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { UserService } from '../../core/services/user.service';

const AdminDashboard = () => {
  const options = [
    {
      title: "Gestion de Usuarios",
      description: "es la administracion de los usuarios",
      icon: "bi bi-star",
      //features: ["Obtener Usuario", "Obtener usuarios", "Función básica"],
      buttonText: "Seleccionar",
      isFeatured: false,
      link: "/admin/users"
    },
    {
      title: "Gestion de Productos",
      description: "es la administracion de los productos",
      icon: "bi bi-gem",
      //features: ["Todas las funciones básicas", "Función premium 1", "Función premium 2", "Soporte prioritario"],
      buttonText: "Seleccionar",
      isFeatured: false,
      link: "/admin/products"
    },
    {
      title: "Gestion de las Ordenes",
      description: "es la administracion de los ordenes",
      icon: "bi bi-building",
      //features: ["Todas las funciones premium", "Personalización", "Soporte 24/7", "Integraciones"],
      buttonText: "Seleccionar",
      isFeatured: false,
      link: "/admin/oders"
    }
  ];

  const { user, routes, getme, loading } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    getme()
    //console.log("user: ",user)
    console.log("user: ", user)
  }, []);

  const handleSearch = async (e) => {
    localStorage.setItem("term", e)
    navigate(APP_ROUTES.PUBLIC.HOME.link,{ 
      replace: true,
      state: { forceRefresh: true } // Puedes usar este estado para forzar recarga
    });
  };

  return (
    <div className="container my-5">
      {loading == true ?
        <div key="spin1" className="text-center my-5">
          <div className="spinner-border" role="status">
          </div>
        </div>
        :

        <div className="my-2" role="">

          <Navbar
            onSearch={handleSearch}
            routes={routes}
          />
        </div>

      }
      <h2 className="text-center mb-4">Administracion del sistema</h2>
      <div className="row g-4">
        {options.map((option, index) => (
          <div key={index} className="col-md-4">
            <div className={`card h-100 ${option.isFeatured ? 'border-primary shadow-lg' : ''}`}>

              <div className="card-body text-center">
                <i className={`${option.icon} fs-1 text-primary mb-3`}></i>
                <h3 className="card-title">{option.title}</h3>
                <p className="card-text">{option.description}</p>

              </div>
              <div className="card-footer bg-transparent border-top-0 pb-3">
                <button className={`btn w-100 ${option.isFeatured ? 'btn-primary' : 'btn-outline-primary'}`} onClick={()=>{
                  navigate(option.link)
                  
                }}>
                  {option.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;