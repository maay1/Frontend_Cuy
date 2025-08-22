import React, { Component } from "react";
import CompProductoResumen from "./CompProductoResumen";
import axios from 'axios';

class CompListaProducto extends Component {

  constructor(props) {
    super(props);
    this.state = {
      productos: [],
      loading: true,
      error: null,
      categoria: 'Productos' // Por defecto
    };
  }

  // URL del backend
  API_BASE_URL = process.env.REACT_APP_API_URL;

  // Método para obtener productos del backend con filtros
  obtenerProductos = async (categoriaId = null, tipoFiltro = 'categoria') => {
    try {
      console.log('🔍 Iniciando obtenerProductos...');
      console.log('📂 categoriaId:', categoriaId);
      console.log('🏷️ tipoFiltro:', tipoFiltro);

      this.setState({ loading: true, error: null });

      // Verificar que la URL esté definida
      if (!this.API_BASE_URL) {
        throw new Error('REACT_APP_API_URL no está definida en las variables de entorno');
      }

      let url = `${this.API_BASE_URL}/Productos`;
      let categoria = 'Productos';

      // Construir URL según el tipo de filtro
      if (tipoFiltro === 'destacados') {
        url = `${this.API_BASE_URL}/Productos/destacados`;
        categoria = 'Destacados';
      } else if (categoriaId) {
        url = `${this.API_BASE_URL}/Productos/categoria/${categoriaId}`;
        // Obtener nombre de categoría
        categoria = await this.obtenerNombreCategoriaSync(categoriaId);
      }

      console.log('🔗 URL completa:', url);

      // Llamada al controlador ProductosController
      const response = await axios.get(url);

      console.log('✅ Respuesta del servidor:', response.data);
      console.log('📊 Cantidad de productos:', response.data?.length || 0);

      this.setState({
        productos: response.data,
        categoria: categoria,
        loading: false
      });

      console.log('✅ Estado actualizado con productos filtrados');

    } catch (error) {
      console.error('❌ Error al obtener productos:', error);
      console.error('📄 Detalles del error:', error.response?.data);
      console.error('🔢 Status del error:', error.response?.status);

      this.setState({
        productos: [],
        loading: false,
        error: `Error al cargar los productos: ${error.message}`
      });
    }
  }

  // Método auxiliar para obtener nombre de categoría sincrónicamente
  obtenerNombreCategoriaSync = async (categoriaId) => {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/CategoriaCuys/${categoriaId}`);
      return response.data.nombreCategoria;
    } catch (error) {
      console.error('❌ Error al obtener nombre de categoría:', error);
      return `Categoría ${categoriaId}`;
    }
  }

  // Método para agregar al carrito con autenticación
  agregarAlCarrito = (producto) => {
    const { requireAuth } = this.props;
    if (requireAuth) {
      requireAuth(() => {
        console.log('Agregando al carrito:', producto);
        if (this.props.onAgregarAlCarrito) {
          this.props.onAgregarAlCarrito(producto);
        }
      });
    }
  }

  // Se ejecuta cuando el componente se monta
  componentDidMount() {
    console.log('🚀 ComponentDidMount ejecutado');
    console.log('📦 Props recibidas:', this.props);

    // Si hay pListaDeProductos en props Y no está vacío, los usa (compatibilidad hacia atrás)
    if (this.props.pListaDeProductos && this.props.pListaDeProductos.length > 0) {
      console.log('📋 Usando productos de props:', this.props.pListaDeProductos);
      this.setState({
        productos: this.props.pListaDeProductos,
        loading: false
      });
    } else {
      // Obtener productos del backend con filtros iniciales
      console.log('🌐 Obteniendo productos del backend');
      this.obtenerProductos(this.props.categoriaId, this.props.tipoFiltro);
    }
  }

  // Se ejecuta cuando las props cambian
  componentDidUpdate(prevProps) {
    console.log('🔄 ComponentDidUpdate ejecutado');
    console.log('📦 Props anteriores:', {
      categoriaId: prevProps.categoriaId,
      tipoFiltro: prevProps.tipoFiltro
    });
    console.log('📦 Props actuales:', {
      categoriaId: this.props.categoriaId,
      tipoFiltro: this.props.tipoFiltro
    });

    // Si cambia la categoría o el tipo de filtro, obtener nuevos productos
    if (prevProps.categoriaId !== this.props.categoriaId ||
        prevProps.tipoFiltro !== this.props.tipoFiltro) {
      console.log('🔄 Filtro cambió, obteniendo nuevos productos');
      this.obtenerProductos(this.props.categoriaId, this.props.tipoFiltro);
    }
  }

  render() {
    const { productos, loading, error, categoria } = this.state;
    const { usuario, isAuthenticated, requireAuth } = this.props;

    console.log('🎨 Renderizando componente...');
    console.log('📊 Estado actual:', { productos: productos.length, loading, error, categoria });

    // Mostrar loading
    if (loading) {
      return (
        <div className="col-9">
          <p className="h5 text-secondary">{categoria}</p>
          <div className="d-flex justify-content-center p-5">
            <div className="spinner-border text-secondary" role="status">
              <span className="sr-only">Cargando productos...</span>
            </div>
          </div>
        </div>
      );
    }

    // Mostrar error
    if (error) {
      return (
        <div className="col-9">
          <p className="h5 text-secondary">{categoria}</p>
          <div className="alert alert-danger" role="alert">
            {error}
            <button
              className="btn btn-outline-secondary btn-sm ml-2"
              onClick={() => this.obtenerProductos()}
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    // Si no hay productos
    if (productos.length === 0) {
      return (
        <div className="col-9">
          <p className="h5 text-secondary">{categoria}</p>
          <div className="alert alert-info" role="alert">
            No hay productos disponibles en esta categoría.
            <br />
            <small className="text-muted">
              Revisa la consola del navegador para más detalles.
            </small>
          </div>
        </div>
      );
    }

    return (
      <div className="col-9">
        <p className="h5 text-secondary">{categoria} ({productos.length})</p>
        <div className="row row-cols-1 row-cols-md-3">
          {productos.map((producto) => (
            <CompProductoResumen
              pDatosDelProducto={producto}
              key={producto.idProducto}
              usuario={usuario}
              isAuthenticated={isAuthenticated}
              onAgregarAlCarrito={() => this.agregarAlCarrito(producto)}
              requireAuth={requireAuth}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default CompListaProducto;