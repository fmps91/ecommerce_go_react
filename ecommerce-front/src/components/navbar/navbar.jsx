
import './Navbar.css';
import React, { useState } from 'react';
import { BsPersonCircle } from "react-icons/bs";
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import InputCustom from '../Input';

const Navbar = ({ onSearch }) => {
  const { user, loading, login, logout } = useAuth();

  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (value) => {
    //e.preventDefault();
    //console.log(value)
    setInputValue(value);
    //onSearch(value);
    // Llama a onSearch directamente con cada cambio (búsqueda en tiempo real)

  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Opcional: puedes mantener esto para búsqueda al hacer submit
    onSearch(inputValue);
  };



  return (


    <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
      <div className="container-fluid">

        <Link to={`/`} key={"session"} style={{ textDecoration: "none", color: "inherit" }}>
          <p className="navbar-brand">Ecommerce</p>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to={`/login`} key={"session"} style={{ textDecoration: "none", color: "inherit" }}>
                <p className="color">Login</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to={`/register`} key={"session"} style={{ textDecoration: "none", color: "inherit" }}>
                <p className="color" >Register</p>
              </Link>
            </li>

            <li className="nav-item">
              <Link to={`/products`} key={"session"} style={{ textDecoration: "none", color: "inherit" }}>
                <p className="color" >Products</p>
              </Link>
            </li>


          </ul>


          <form className="d-flex" role="search" onSubmit={handleSearch}>
            <div className="row align-items-center">


              <div id="inputcuston" >
                <InputCustom
                  value={inputValue}
                  onChange={(value) => handleInputChange(value)}
                  placeholder={"ingrese producto"}
                  size="large"
                ></InputCustom>
              </div>



              <div id="button"  >
                <button className="btn btn-outline-success" >Buscar</button>
              </div>

            </div>
          </form>


          <div className="user " style={{ marginTop: "1em" }}
          >
            <div className="container text-center">
              <div className="row justify-content-center">
                <div className="row">
                  <BsPersonCircle size={40} style={{ color: "darkgrey" }} />
                </div>

                {user !== null ?
                  <div className="row">
                    <div className="row">
                      <h2>{user?.username}</h2>
                    </div>
                    <div className="row">
                      <details style={{ color: "darkgrey" }}><summary>Options</summary>
                        <div>
                         {/*  <Link to={`/profile`} key={"session"} style={{ textDecoration: "none", color: "inherit" }}>
                            <p style={{ color: "darkgrey", padding: 0, margin: 0 }}>Profile</p>
                          </Link> */}
                          <Link to={"/profile"} style={{ textDecoration: "none", color: "inherit" }}  reloadDocument>
                          <p style={{ color: "darkgrey", padding: 0, margin: 0 }}>Profile</p>

                          </Link>
                          {/* <a style={{ textDecoration: "none",color: "darkgrey", padding: 0, margin: 0 }} href="/profile">Profile</a> */}
                        </div>

                        <div style={{ color: "darkgrey" }} onClick={logout}>Cerrar sesion</div>
                      </details>

                    </div>
                  </div>
                  :
                  <div className="row">
                    <Link to={`/login`} key={"session"} style={{ textDecoration: "none", color: "inherit" }}>
                      <p style={{ color: "darkgrey" }}>SingIn</p>
                    </Link>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

