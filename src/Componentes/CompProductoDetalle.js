import React, {Component} from 'react';
import axios from 'axios';

class CompProductoDetalle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      producto: null,
      loading: true,
      error: null,
      agregandoCarrito: false
    };
  }

  // URL del backend
  API_BASE_URL = process.env.REACT_APP_API_URL;

  // Método para obtener detalles del producto
  obtenerProductoDetalle = async (productoId) => {
    try {
      this.setState({ loading: true, error: null });
      
      const response = await axios.get(`${this.API_BASE_URL}/Productos/${productoId}`);
      
      this.setState({ 
        producto: response.data,
        loading: false 
      });

    } catch (error) {
      console.error('Error al obtener producto:', error);
      this.setState({ 
        producto: null,
        loading: false,
        error: 'Error al cargar el producto'
      });
    }
  }

  // Método para agregar al carrito
  agregarAlCarrito = async () => {
    try {
      this.setState({ agregandoCarrito: true });

      const { producto } = this.state;
      
      // Datos para DetalleCompras (carrito temporal con idCompra null)
      const detalleCompra = {
        idCompra: null, // null indica que está en carrito
        idProducto: producto.idProducto,
        cantidad: 1,
        precioUnitario: producto.precio
      };

      // Llamada al DetalleComprasController
      await axios.post(`${this.API_BASE_URL}/DetalleCompras`, detalleCompra);
      
      alert('Producto agregado al carrito exitosamente');
      
      this.setState({ agregandoCarrito: false });

    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('Error al agregar producto al carrito');
      this.setState({ agregandoCarrito: false });
    }
  }

  // Se ejecuta cuando el componente se monta
  componentDidMount() {
    // Obtener ID del producto desde props o URL
    const productoId = this.props.productoId || this.props.match?.params?.id;
    
    if (productoId) {
      this.obtenerProductoDetalle(productoId);
    } else {
      this.setState({ 
        loading: false, 
        error: 'ID de producto no encontrado' 
      });
    }
  }

  // Se ejecuta cuando las props cambian
  componentDidUpdate(prevProps) {
    const productoId = this.props.productoId || this.props.match?.params?.id;
    const prevProductoId = prevProps.productoId || prevProps.match?.params?.id;
    
    if (productoId !== prevProductoId) {
      this.obtenerProductoDetalle(productoId);
    }
  }

  render() {
    const { producto, loading, error, agregandoCarrito } = this.state;

    // Mostrar loading
    if (loading) {
      return (
        <div className="col-9">
          <p className="h5 text-secondary">Producto</p>
          <div className="d-flex justify-content-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Cargando producto...</span>
            </div>
          </div>
        </div>
      );
    }

    // Mostrar error
    if (error || !producto) {
      return (
        <div className="col-9">
          <p className="h5 text-secondary">Producto</p>
          <div className="alert alert-danger" role="alert">
            {error || 'Producto no encontrado'}
            <button 
              className="btn btn-outline-primary btn-sm ml-2"
              onClick={() => {
                const productoId = this.props.productoId || this.props.match?.params?.id;
                if (productoId) this.obtenerProductoDetalle(productoId);
              }}
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="col-9">
        <p className="h5 text-secondary">Producto</p>
        <div className="card mb-3">
          <div className="row no-gutters">
            <div className="col-md-4">
              <img 
                src={producto.imagen || "imagenes/producto-default.png"} 
                className="card-img" 
                alt={producto.nombre}
                onError={(e) => {
                  e.target.src = "imagenes/producto-default.png";
                }}
              />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title text-primary">
                  {producto.nombreProducto}
                </h5>
                <p className="card-text">
                  {producto.descripcion}
                </p>
                <p className="h4 text-primary">
                  S/ {producto.precio ? producto.precio.toFixed(2) : '0.00'}
                </p>
                
                {/* Información adicional del producto */}
                {producto.sexo && (
                  <p className="text-muted">
                    <small>Sexo: {producto.sexo}</small>
                  </p>
                )}
                
                {producto.idCategoria && (
                  <p className="text-muted">
                    <small>Categoría ID: {producto.idCategoria}</small>
                  </p>
                )}

                <p className="text-right">
                  <button 
                    className={`btn btn-lg btn-primary ${agregandoCarrito ? 'disabled' : ''}`}
                    onClick={this.agregarAlCarrito}
                    disabled={agregandoCarrito}
                  >
                    {agregandoCarrito ? (
                      <>
                        <span className="spinner-border spinner-border-sm mr-2" />
                        Agregando...
                      </>
                    ) : (
                      'Agregar al carrito'
                    )}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default CompProductoDetalle;