
import './Navbar.css';
import React, { useState, useEffect } from 'react';
import { BsPersonCircle } from "react-icons/bs";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import InputCustom from '../Input';
import { APP_ROUTES } from '../../core/constants/api.routes';
import { useApp } from '../../contexts/AppContext';


const Navbar = ({ onSearch, routes }) => {
  //const { user, getme,loading, login, logout } = useAuth();
  const { user, routesReady, logout } = useApp();
  const location = useLocation();

  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    //const { name, value, type, checked } = e.target;
    //console.log("value: ",e)
    setInputValue(e);
    localStorage.setItem("term", inputValue)
    //onSearch(e);
    //console.log("path: ",location.pathname)

    //
    // Llama a onSearch directamente con cada cambio (búsqueda en tiempo real)

  };

  const handleSearch = (e) => {

    e.preventDefault();
    //onSearch(inputValue);
    localStorage.setItem("term", inputValue)
    onSearch(inputValue);

    if (location.pathname != "/") {
      navigate(APP_ROUTES.PUBLIC.HOME.link, {
        replace: true,
        state: { forceRefresh: true } // Puedes usar este estado para forzar recarga
      });
    } else {
      if (inputValue == "") {
        //localStorage.setItem("term", `""`)
        //console.log("termino a: ",sessionStorage.getItem("term"))
      }
    }


  };


  return (


    <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
      <div className="container-fluid">

      <div className="flex-shrink-0"> {/* Logo con margen fijo */}
            <Link to={`/`} key={"logo"} style={{ textDecoration: "none", color: "inherit" }}>
              <p className="navbar-brand mb-0">Ecommerce</p> {/* mb-0 para eliminar margen inferior */}
            </Link>
          </div>
          <button 
            className="navbar-toggler mx-2" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarSupportedContent" 
            aria-controls="navbarSupportedContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse flex-grow-1" id="navbarSupportedContent">          
          <div className="d-flex flex-column flex-lg-row w-100 align-items-lg-center">

            {routes["user"] == "admin" ?
              <div>
                <div className="dropdown d-none d-lg-flex mx-5"> {/* Solo visible en mobile */}
                  <button className="btn btn-dark dropdown-toggle" id="admin1" data-bs-toggle="dropdown">
                    Menú
                </button>
                  <ul className="dropdown-menu">
                    {routes.routes?.map((e, index) => (
                      <li key={index}>
                        <Link to={e.link} className="dropdown-item">
                          {e.name}
                        </Link>
                      </li>
                    )) || <li className="dropdown-item">No hay opciones</li>}
                  </ul>
                </div>

                <div className="dropdown d-lg-none" id="admin2"> {/* Solo visible en mobile */}
                  <ul className="navbar-nav me-auto"> {/* Solo visible en desktop */}
                    {routes.routes?.map((e, index) => (
                      <li key={index} className="nav-item">
                        <Link to={e.link} className="nav-link">
                          {e.name}
                        </Link>
                      </li>
                    )) || <div>No hay opciones</div>}
                  </ul>
                </div>
              </div>

              :
              routes["user"] == "user" ?
              <div className="mx-5">
                <ul className="navbar-nav me-auto ">
                  {routes.routes ?
                    routes.routes.map((e, index) => {
                      return (<li key={index} className="nav-item">
                        <Link to={e.link} key={"session"} style={{ textDecoration: "none", color: "inherit" }}>
                          <p className="color">{e.name}</p>
                        </Link>
                      </li>)
                    })
                    :
                    <div>
                      <h4>no hay nada user </h4>
                    </div>
                  }


                </ul>
                </div>
                :
                <div className="mx-5">
                  <ul className="navbar-nav me-auto ">
                    {routes.routes ?
                      routes.routes.map((e, index) => {
                        return (<li key={index} className="nav-item">
                          <Link to={e.link} key={"session"} style={{ textDecoration: "none", color: "inherit" }}>
                            <p className="color">{e.name}</p>
                          </Link>
                        </li>)
                      })
                      :
                      <div>
                        <h4>no hay nada sin user</h4>
                      </div>
                    }
                  </ul>
                </div>
            }
          </div>

          <form className="d-flex" role="search" onSubmit={handleSearch}>
            <div className="row align-items-center">

              <div id="inputcuston" >
                <InputCustom
                  value={inputValue}
                  onChange={(e) => { handleInputChange(e) }}
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

                          <Link to={"/profile"} style={{ textDecoration: "none", color: "inherit" }} reloadDocument>
                            <p style={{ color: "darkgrey", padding: 0, margin: 0 }}>Profile</p>

                          </Link>
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

