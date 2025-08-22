import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class CompCabecera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            busqueda: '',
            showUserMenu: false
        };
    }

    handleBusquedaChange = (e) => {
        this.setState({ busqueda: e.target.value });
    }

    handleBusquedaSubmit = (e) => {
        e.preventDefault();
        const { busqueda } = this.state;
        if (busqueda.trim()) {
            // Redirigir a página de búsqueda (por implementar)
            window.location.href = `/productos?search=${encodeURIComponent(busqueda.trim())}`;
        }
    }

    toggleUserMenu = () => {
        this.setState(prevState => ({
            showUserMenu: !prevState.showUserMenu
        }));
    }

    // Cerrar menú cuando se hace click fuera
    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.userMenuRef && !this.userMenuRef.contains(event.target)) {
            this.setState({ showUserMenu: false });
        }
    }

    render() {
        const { usuario, isAuthenticated, onLogin, onLogout } = this.props;
        const { busqueda, showUserMenu } = this.state;

        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow">
                <div className="container">
                    {/* Logo/Brand */}
                    <Link className="navbar-brand fw-bold" to="/">
                        <i className="fas fa-paw mr-2"></i>
                        CuyShop
                    </Link>

                    {/* Mobile menu button */}
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav" 
                        aria-expanded="false" 
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Navigation */}
                    <div className="collapse navbar-collapse" id="navbarNav">
                        {/* Left side navigation */}
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    <i className="fas fa-home mr-1"></i>
                                    Inicio
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/productos">
                                    <i className="fas fa-box mr-1"></i>
                                    Productos
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a 
                                    className="nav-link dropdown-toggle" 
                                    href="#" 
                                    id="categoriasDropdown" 
                                    role="button" 
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="fas fa-tags mr-1"></i>
                                    Categorías
                                </a>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" to="/productos/destacados">Destacados</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><Link className="dropdown-item" to="/productos/porcategoria/1">Cuyes Tiernos</Link></li>
                                    <li><Link className="dropdown-item" to="/productos/porcategoria/2">Cuyes Adultos</Link></li>
                                    <li><Link className="dropdown-item" to="/productos/porcategoria/3">Procesados</Link></li>
                                </ul>
                            </li>
                        </ul>

                        {/* Search bar */}
                        <form className="d-flex me-3" onSubmit={this.handleBusquedaSubmit}>
                            <div className="input-group">
                                <input 
                                    className="form-control" 
                                    type="search" 
                                    placeholder="Buscar productos..." 
                                    value={busqueda}
                                    onChange={this.handleBusquedaChange}
                                    style={{ minWidth: '200px' }}
                                />
                                <button className="btn btn-outline-light" type="submit">
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>
                        </form>

                        {/* Right side navigation */}
                        <ul className="navbar-nav">
                            {isAuthenticated ? (
                                <>
                                    {/* Carrito */}
                                    <li className="nav-item">
                                        <Link className="nav-link position-relative" to="/carrito">
                                            <i className="fas fa-shopping-cart"></i>
                                            <span className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">
                                                0 {/* Aquí puedes agregar contador dinámico */}
                                            </span>
                                        </Link>
                                    </li>

                                    {/* Usuario Menu */}
                                    <li className="nav-item dropdown" ref={ref => this.userMenuRef = ref}>
                                        <a 
                                            className="nav-link dropdown-toggle d-flex align-items-center" 
                                            href="#" 
                                            onClick={this.toggleUserMenu}
                                            role="button"
                                            aria-expanded={showUserMenu}
                                        >
                                            <i className="fas fa-user-circle me-1"></i>
                                            <span className="d-none d-md-inline">
                                                {usuario?.nombreUsuario || 'Usuario'}
                                            </span>
                                        </a>
                                        
                                        {showUserMenu && (
                                            <ul className="dropdown-menu dropdown-menu-end show">
                                                <li>
                                                    <h6 className="dropdown-header">
                                                        <i className="fas fa-user me-2"></i>
                                                        {usuario?.nombreUsuario}
                                                    </h6>
                                                </li>
                                                <li><hr className="dropdown-divider" /></li>
                                                
                                                <li>
                                                    <Link className="dropdown-item" to="/perfil">
                                                        <i className="fas fa-user-edit me-2"></i>
                                                        Mi Perfil
                                                    </Link>
                                                </li>
                                                
                                                <li>
                                                    <Link className="dropdown-item" to="/mis-pedidos">
                                                        <i className="fas fa-box me-2"></i>
                                                        Mis Pedidos
                                                    </Link>
                                                </li>
                                                
                                                <li>
                                                    <Link className="dropdown-item" to="/favoritos">
                                                        <i className="fas fa-heart me-2"></i>
                                                        Favoritos
                                                    </Link>
                                                </li>

                                                {/* Menu de admin si es administrador */}
                                                {usuario?.rol === 'admin' && (
                                                    <>
                                                        <li><hr className="dropdown-divider" /></li>
                                                        <li>
                                                            <Link className="dropdown-item text-warning" to="/admin">
                                                                <i className="fas fa-cogs me-2"></i>
                                                                Panel Admin
                                                            </Link>
                                                        </li>
                                                    </>
                                                )}

                                                <li><hr className="dropdown-divider" /></li>
                                                
                                                <li>
                                                    <button 
                                                        className="dropdown-item text-danger"
                                                        onClick={onLogout}
                                                    >
                                                        <i className="fas fa-sign-out-alt me-2"></i>
                                                        Cerrar Sesión
                                                    </button>
                                                </li>
                                            </ul>
                                        )}
                                    </li>
                                </>
                            ) : (
                                <>
                                    {/* Botones de login para usuarios no autenticados */}
                                    <li className="nav-item">
                                        <button 
                                            className="btn btn-outline-light me-2"
                                            onClick={() => onLogin && onLogin('login')}
                                        >
                                            <i className="fas fa-sign-in-alt me-1"></i>
                                            Iniciar Sesión
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button 
                                            className="btn btn-light"
                                            onClick={() => onLogin && onLogin('register')}
                                        >
                                            <i className="fas fa-user-plus me-1"></i>
                                            Registrarse
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default CompCabecera;