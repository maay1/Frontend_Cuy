import React, { Component } from 'react';
import { Routes, Route, useParams, useLocation } from 'react-router-dom';
import CompCabecera from './CompCabecera';
import CompListaCategoria from './CompListaCategoria';
import CompPiePagina from './CompPiePagina';
import CompListaProducto from './CompListaProducto';
import CompProductoDetalle from './CompProductoDetalle';


class PageListaProducto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoriaSeleccionada: null,
            tipoFiltro: 'todos', // 'todos', 'categoria', 'destacados', 'busqueda'
            busqueda: '' // Para filtros de búsqueda
        };
    }

    // URL del backend
    API_BASE_URL = process.env.REACT_APP_API_URL;

    componentDidMount() {
        // Verificar si hay parámetros de búsqueda en la URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        
        if (searchQuery) {
            this.setState({
                tipoFiltro: 'busqueda',
                busqueda: searchQuery,
                categoriaSeleccionada: null
            });
        } else {
            this.setState({
                tipoFiltro: 'todos',
                categoriaSeleccionada: null,
                busqueda: ''
            });
        }
    }

    // Método para manejar cambio de categoría
    handleCategoriaChange = (categoriaId, tipo = 'categoria') => {
        console.log('Cambio de categoría:', { categoriaId, tipo });
        
        if (tipo === 'destacados') {
            this.setState({
                categoriaSeleccionada: null,
                tipoFiltro: 'destacados',
                busqueda: ''
            });
        } else if (categoriaId) {
            this.setState({
                categoriaSeleccionada: categoriaId,
                tipoFiltro: 'categoria',
                busqueda: ''
            });
        } else {
            this.setState({
                categoriaSeleccionada: null,
                tipoFiltro: 'todos',
                busqueda: ''
            });
        }
    }

    // Método para buscar productos
    buscarProductos = (query) => {
        this.setState({
            categoriaSeleccionada: null,
            tipoFiltro: 'busqueda',
            busqueda: query
        });
    }

    // Componente para mostrar lista de productos
    renderListaProductos = () => {
        const { categoriaSeleccionada, tipoFiltro, busqueda } = this.state;
        const { usuario, isAuthenticated, requireAuth } = this.props;

        return (
            <CompListaProducto 
                categoriaId={categoriaSeleccionada}
                tipoFiltro={tipoFiltro}
                busqueda={busqueda}
                usuario={usuario}
                isAuthenticated={isAuthenticated}
                requireAuth={requireAuth}
            />
        );
    }

    // Componente wrapper para manejar parámetros de React Router v6
    ProductoDetalleWrapper = () => {
        const params = useParams();
        const location = useLocation();
        const { usuario, isAuthenticated, onLogout, requireAuth } = this.props;
        const { categoriaSeleccionada } = this.state;
        
        return (
            <div className="row">
                <CompListaCategoria 
                    onCategoriaChange={this.handleCategoriaChange}
                    categoriaActiva={categoriaSeleccionada}
                />
                <CompProductoDetalle 
                    match={{ params }}
                    location={location}
                    usuario={usuario}
                    isAuthenticated={isAuthenticated}
                    onLogout={onLogout}
                    requireAuth={requireAuth}
                />
            </div>
        );
    }

    // Componente wrapper para productos por categoría
    ProductosPorCategoriaWrapper = () => {
        const params = useParams();
        const categoriaId = parseInt(params.categoriaId);
        const { categoriaSeleccionada } = this.state;
        
        // Actualizar estado si la categoría cambió
        if (categoriaSeleccionada !== categoriaId) {
            this.setState({
                categoriaSeleccionada: categoriaId,
                tipoFiltro: 'categoria',
                busqueda: ''
            });
        }
        
        return (
            <div className="row">
                <CompListaCategoria 
                    onCategoriaChange={this.handleCategoriaChange}
                    categoriaActiva={categoriaId}
                />
                {this.renderListaProductos()}
            </div>
        );
    }

    // Componente wrapper para productos destacados
    ProductosDestacadosWrapper = () => {
        const { tipoFiltro } = this.state;
        
        // Actualizar estado si no está en destacados
        if (tipoFiltro !== 'destacados') {
            this.setState({
                categoriaSeleccionada: null,
                tipoFiltro: 'destacados',
                busqueda: ''
            });
        }
        
        return (
            <div className="row">
                <CompListaCategoria 
                    onCategoriaChange={this.handleCategoriaChange}
                    categoriaActiva="destacados"
                />
                {this.renderListaProductos()}
            </div>
        );
    }

    render() {
        const { usuario, isAuthenticated, onLogin, onLogout } = this.props;
        const { categoriaSeleccionada } = this.state;

        return (
            <div>
                <CompCabecera 
                    usuario={usuario}
                    isAuthenticated={isAuthenticated}
                    onLogin={onLogin}
                    onLogout={onLogout}
                    onBuscar={this.buscarProductos}
                />
                <main role="main" className="container" style={{ paddingTop: '90px' }}>
                    <Routes>
                        {/* Ruta para detalle de producto */}
                        <Route 
                            path="/producto/:id" 
                            element={<this.ProductoDetalleWrapper />}
                        />
                        
                        {/* Ruta para productos por categoría */}
                        <Route 
                            path="/porcategoria/:categoriaId" 
                            element={<this.ProductosPorCategoriaWrapper />}
                        />
                        
                        {/* Ruta para productos destacados */}
                        <Route 
                            path="/destacados" 
                            element={<this.ProductosDestacadosWrapper />}
                        />
                        
                        {/* Ruta por defecto - todos los productos */}
                        <Route 
                            path="/*" 
                            element={
                                <div className="row">
                                    <CompListaCategoria 
                                        onCategoriaChange={this.handleCategoriaChange}
                                        categoriaActiva={categoriaSeleccionada}
                                    />
                                    {this.renderListaProductos()}
                                </div>
                            }
                        />
                    </Routes>
                </main>
                <CompPiePagina />
            </div>
        );
    }
}

export default PageListaProducto;