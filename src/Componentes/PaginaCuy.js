import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CompCabecera from './CompCabecera';
import CompPiePagina from './CompPiePagina';
import axios from 'axios';

class PaginaCuy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productosDestacados: [],
            categorias: [],
            loading: true,
            error: null
        };
    }

    // URL del backend - VALOR POR DEFECTO si no existe la variable
    API_BASE_URL = process.env.REACT_APP_API_URL;

    componentDidMount() {
        this.cargarDatosIniciales();
    }

    cargarDatosIniciales = async () => {
        try {
            this.setState({ loading: true, error: null });

            // Cargar productos destacados y categorías en paralelo
            const [productosResponse, categoriasResponse] = await Promise.all([
                this.obtenerProductosDestacados(),
                this.obtenerCategorias()
            ]);

            this.setState({
                productosDestacados: productosResponse,
                categorias: categoriasResponse,
                loading: false
            });

        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
            this.setState({
                error: 'Error al cargar los datos. Verifica que el backend esté corriendo.',
                loading: false
            });
        }
    }

    obtenerProductosDestacados = async () => {
        try {
            console.log('Intentando conectar a:', `${this.API_BASE_URL}/Productos`);
            const response = await axios.get(`${this.API_BASE_URL}/Productos`);
            // Tomar los primeros 6 productos como destacados
            return response.data.slice(0, 6);
        } catch (error) {
            console.error('Error al obtener productos destacados:', error);
            throw error; // Propagar el error para manejarlo arriba
        }
    }

    obtenerCategorias = async () => {
        try {
            console.log('Intentando conectar a:', `${this.API_BASE_URL}/CategoriaCuys`);
            const response = await axios.get(`${this.API_BASE_URL}/CategoriaCuys`);
            return response.data.slice(0, 4); // Mostrar solo 4 categorías principales
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            throw error; // Propagar el error para manejarlo arriba
        }
    }

    handleAgregarAlCarrito = (productoId) => {
        const { isAuthenticated, requireAuth } = this.props;
        
        if (!isAuthenticated) {
            requireAuth(() => {
                this.agregarProductoAlCarrito(productoId);
            });
        } else {
            this.agregarProductoAlCarrito(productoId);
        }
    }

    agregarProductoAlCarrito = async (productoId) => {
        try {
            const token = sessionStorage.getItem('token');
            const producto = this.state.productosDestacados.find(p => p.idProducto === productoId);

            const carritoData = {
                idProducto: productoId,
                cantidad: 1,
                precio: producto.precio
            };

            const response = await axios.post(
                `${this.API_BASE_URL}/Carrito`, 
                carritoData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200 || response.status === 201) {
                alert('Producto agregado al carrito exitosamente');
            }

        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            alert('Error al agregar el producto al carrito');
        }
    }

    render() {
        const { usuario, isAuthenticated, onLogin, onLogout } = this.props;
        const { productosDestacados, categorias, loading, error } = this.state;

        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <CompCabecera 
                    usuario={usuario}
                    isAuthenticated={isAuthenticated}
                    onLogin={onLogin}
                    onLogout={onLogout}
                />
                
                <main role="main" className="flex-grow-1" style={{ paddingTop: '90px' }}>
                    {/* Hero Section */}
                    <section className="bg-primary text-white py-5 mb-5">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <h1 className="display-4 fw-bold mb-3">
                                        Bienvenido a CuyShop
                                    </h1>
                                    <p className="lead mb-4">
                                        Descubre los mejores cuyes frescos y de la más alta calidad. 
                                        Tradición peruana en cada producto.
                                    </p>
                                    <Link to="/productos" className="btn btn-light btn-lg">
                                        Ver Productos
                                    </Link>
                                </div>
                                <div className="col-lg-6">
                                    <div 
                                        style={{
                                            width: '100%',
                                            height: '300px',
                                            backgroundColor: '#6c757d',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        <span>CuyShop - Imagen Principal</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Estado de conexión */}
                    <div className="container">
                        <div className="alert alert-info">
                            <strong>Estado de conexión:</strong> Conectando a {this.API_BASE_URL}
                            {error && <div className="text-danger mt-2">{error}</div>}
                        </div>
                    </div>

                    {/* Categorías Section */}
                    <section className="py-5">
                        <div className="container">
                            <h2 className="text-center mb-5">Nuestras Categorías</h2>
                            {loading ? (
                                <div className="text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="sr-only">Cargando categorías...</span>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="alert alert-warning text-center">
                                    {error}
                                    <button 
                                        className="btn btn-primary ml-3"
                                        onClick={this.cargarDatosIniciales}
                                    >
                                        Reintentar
                                    </button>
                                </div>
                            ) : (
                                <div className="row">
                                    {categorias.map(categoria => (
                                        <div key={categoria.idCategoria} className="col-md-3 col-sm-6 mb-4">
                                            <Link 
                                                to={`/productos/porcategoria/${categoria.idCategoria}`} 
                                                className="text-decoration-none"
                                            >
                                                <div className="card h-100 shadow-sm categoria-card">
                                                    <div 
                                                        style={{
                                                            width: '100%',
                                                            height: '200px',
                                                            backgroundColor: '#6c757d',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        {categoria.nombreCategoria}
                                                    </div>
                                                    <div className="card-body text-center">
                                                        <h5 className="card-title text-dark">
                                                            {categoria.nombreCategoria}
                                                        </h5>
                                                        <p className="card-text text-muted small">
                                                            {categoria.descripcion || 'Explora esta categoría'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Productos Destacados Section */}
                    <section className="py-5 bg-light">
                        <div className="container">
                            <h2 className="text-center mb-5">Productos Destacados</h2>
                            {loading ? (
                                <div className="text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="sr-only">Cargando productos...</span>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="alert alert-warning text-center">
                                    {error}
                                    <button 
                                        className="btn btn-primary ml-3"
                                        onClick={this.cargarDatosIniciales}
                                    >
                                        Reintentar
                                    </button>
                                </div>
                            ) : (
                                <div className="row">
                                    {productosDestacados.map(producto => (
                                        <div key={producto.idProducto} className="col-lg-4 col-md-6 mb-4">
                                            <div className="card h-100 shadow-sm">
                                                <div 
                                                    style={{
                                                        width: '100%',
                                                        height: '250px',
                                                        backgroundColor: '#6c757d',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white'
                                                    }}
                                                >
                                                    {producto.nombreProducto}
                                                </div>
                                                <div className="card-body d-flex flex-column">
                                                    <h5 className="card-title">{producto.nombreProducto}</h5>
                                                    <p className="card-text text-muted flex-grow-1">
                                                        {producto.descripcion}
                                                    </p>
                                                    <div className="mb-3">
                                                        <span className="h5 text-primary">
                                                            S/. {producto.precio?.toFixed(2)}
                                                        </span>
                                                        {producto.stock > 0 ? (
                                                            <small className="text-success ml-2">En stock</small>
                                                        ) : (
                                                            <small className="text-danger ml-2">Sin stock</small>
                                                        )}
                                                    </div>
                                                    <div className="btn-group">
                                                        <Link 
                                                            to={`/producto/${producto.idProducto}`}
                                                            className="btn btn-outline-primary"
                                                        >
                                                            Ver Detalles
                                                        </Link>
                                                        <button 
                                                            className="btn btn-primary"
                                                            onClick={() => this.handleAgregarAlCarrito(producto.idProducto)}
                                                            disabled={producto.stock === 0}
                                                        >
                                                            Agregar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <div className="text-center mt-4">
                                <Link to="/productos" className="btn btn-primary btn-lg">
                                    Ver Todos los Productos
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Información adicional */}
                    <section className="py-5">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-4 text-center mb-4">
                                    <div className="mb-3">
                                        <i className="fas fa-truck fa-3x text-primary"></i>
                                    </div>
                                    <h4>Envío Rápido</h4>
                                    <p className="text-muted">
                                        Entrega fresca y rápida en todo Lima
                                    </p>
                                </div>
                                <div className="col-md-4 text-center mb-4">
                                    <div className="mb-3">
                                        <i className="fas fa-award fa-3x text-primary"></i>
                                    </div>
                                    <h4>Calidad Garantizada</h4>
                                    <p className="text-muted">
                                        Productos frescos y de la mejor calidad
                                    </p>
                                </div>
                                <div className="col-md-4 text-center mb-4">
                                    <div className="mb-3">
                                        <i className="fas fa-headset fa-3x text-primary"></i>
                                    </div>
                                    <h4>Soporte 24/7</h4>
                                    <p className="text-muted">
                                        Atención al cliente siempre disponible
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <CompPiePagina />

                {/* CSS adicional para hover effects - SIN STYLED-JSX */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                        .categoria-card:hover {
                            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                            transform: translateY(-2px);
                            transition: all 0.3s ease;
                        }
                    `
                }} />
            </div>
        );
    }
}

export default PaginaCuy;