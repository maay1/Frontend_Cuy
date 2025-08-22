import React, { Component } from "react";
import axios from 'axios';

class CompListaCategorias extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categorias: [],
            loading: true,
            error: null
        };
    }

    // URL del backend
    API_BASE_URL = process.env.REACT_APP_API_URL;

    // Método para obtener categorías del backend
    obtenerCategorias = async () => {
        try {
            this.setState({ loading: true });
            
            // Llamada al controlador CategoriaCuysController
            const response = await axios.get(`${this.API_BASE_URL}/CategoriaCuys`);
            
            this.setState({ 
                categorias: response.data,
                loading: false,
                error: null
            });
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            this.setState({ 
                categorias: [],
                loading: false,
                error: 'Error al cargar las categorías'
            });
        }
    }

    // Se ejecuta cuando el componente se monta
    componentDidMount() {
        this.obtenerCategorias();
    }

    // Manejar click en categoría
    handleCategoriaClick = (categoriaId, tipo = 'categoria') => {
        if (this.props.onCategoriaChange) {
            this.props.onCategoriaChange(categoriaId, tipo);
        }
    }

    render() {
        const { categorias, loading, error } = this.state;
        // Recibir estas props y usarlas
        const { onCategoriaChange, categoriaActiva } = this.props;

        // Mostrar loading
        if (loading) {
            return (
                <div className="col-3">
                    <p className="h5 text-secondary">Categorías</p>
                    <div className="card">
                        <div className="p-3 text-center">
                            <div className="spinner-border text-secondary" role="status">
                                <span className="sr-only">Cargando...</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // Mostrar error
        if (error) {
            return (
                <div className="col-3">
                    <p className="h5 text-secondary">Categorías</p>
                    <div className="card">
                        <div className="alert alert-danger m-2" role="alert">
                            {error}
                            <button 
                                className="btn btn-sm btn-outline-secondary mt-2"
                                onClick={this.obtenerCategorias}
                            >
                                Reintentar
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="col-3">
                <p className="h5 text-secondary">Categorías ({categorias.length + 1})</p>
                <div className="card">
                    <ul className="list-group list-group-flush">
                        {/* Opción DESTACADOS */}
                        <li className="list-group-item">
                            <button 
                                className={`btn btn-link text-secondary p-0 ${categoriaActiva === 'destacados' ? 'font-weight-bold' : ''}`}
                                onClick={() => this.handleCategoriaClick(null, 'destacados')}
                                style={{ textDecoration: 'none' }}
                            >
                                DESTACADOS
                            </button>
                        </li>
                        
                        {/* Categorías dinámicas */}
                        {categorias.map((categoria) => {
                            const esActiva = categoriaActiva === categoria.idCategoria;
                            
                            return (
                                <li className="list-group-item" key={categoria.idCategoria}>
                                    <button 
                                        className={`btn btn-link text-secondary p-0 ${esActiva ? 'font-weight-bold' : ''}`}
                                        onClick={() => this.handleCategoriaClick(categoria.idCategoria)}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        {categoria.nombreCategoria}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}

export default CompListaCategorias;