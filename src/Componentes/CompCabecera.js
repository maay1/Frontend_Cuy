import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function CompCabecera({ totalProductos = 0 }) {
  const navigate = useNavigate();

  const iniciarSesion = () => {
     //Aquí podrás agregar la lógica cuando tengas el login
    navigate('Ir a iniciar sesión');
  };

  return (
    <header className="w-100 shadow-sm" style={{backgroundColor: '#343a40', borderBottom: '2px solid #e9ecef', position: 'fixed', top: 0, left: 0, zIndex: 1000, height: '65px'}}>
      <div className="container-fluid px-3 px-md-4" style={{height: '100%'}}>
        <div className="row align-items-center" style={{height: '100%'}}>
          <div className="col-12 col-md-4 d-flex align-items-center mb-2 mb-md-0">
            <h1 className="m-0" style={{color: '#ffff', fontWeight: 600, fontSize: '1.4rem'}}>🐹 Tienda Virtual</h1>
          </div>
          <div className="col-12 col-md-8">
            <div className="d-flex flex-wrap justify-content-md-end align-items-center gap-2">
              <Link to="/" className="btn btn-outline-primary btn-sm" style={{borderRadius: '20px'}}>🏠 Inicio</Link>
              <Link to="/carrito" className="btn btn-warning position-relative btn-sm" style={{borderRadius: '20px', fontWeight: '500'}}>
                🛒 Carrito
                {totalProductos > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.7rem'}}>
                    {totalProductos}
                  </span>
                )}
              </Link>
              <Link to="/registro-tarjeta" className="btn btn-outline-secondary btn-sm" style={{borderRadius: '20px'}}>💳 Tarjeta</Link>
              <Link to="/resumen" className="btn btn-outline-secondary btn-sm" style={{borderRadius: '20px'}}>📋 Resumen</Link>
              <Link to="/registro-cliente" className="btn btn-outline-secondary btn-sm" style={{borderRadius: '20px'}}>👤 Registrarse</Link>
              <button onClick={iniciarSesion} className="btn btn-success btn-sm ms-md-2" style={{borderRadius: '20px', fontWeight: '500'}}>🔐 Iniciar Sesión</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default CompCabecera;