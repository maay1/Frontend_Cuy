import React, { Component } from "react";

class CompProductoResumen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cantidad: 1
    };
  }

  handleCantidadChange = (e) => {
    const nuevaCantidad = parseInt(e.target.value) || 1;
    this.setState({ cantidad: nuevaCantidad });
  }

  handleAgregarAlPedido = () => {
    console.log(`Agregando ${this.state.cantidad} unidades del producto:`, this.props.pDatosDelProducto);
    
    // Si tienes la función del componente padre
    if (this.props.onAgregarAlCarrito) {
      this.props.onAgregarAlCarrito(this.props.pDatosDelProducto, this.state.cantidad);
    }
    
    // También puedes usar requireAuth si está disponible
    if (this.props.requireAuth) {
      this.props.requireAuth(() => {
        console.log('Usuario autenticado, agregando al carrito');
      });
    }
  }

  render() {
    const producto = this.props.pDatosDelProducto;
    
    // Verificar que el producto existe
    if (!producto) {
      console.error('❌ No se recibieron datos del producto');
      return <div className="col mb-4">Error: No hay datos del producto</div>;
    }

    // Log para debug
    console.log('🎨 Renderizando producto:', producto);

    // Usar los nombres correctos según tu modelo .NET
    const productoId = producto.idProducto || producto.IdProducto || 'unknown';
    
    // URLs con validación - tu modelo usa 'Imagen', no 'url'
    const urlImagen = producto.imagen || producto.Imagen
      ? `imagenes/${producto.imagen || producto.Imagen}` 
      : `imagenes/default-product.jpg`; // Imagen por defecto
    
    const urlProducto = `producto/${productoId}`;

    // Validar datos según tu modelo .NET
    const nombre = producto.nombreProducto || producto.NombreProducto || 'Producto sin nombre';
    const descripcion = producto.descripcion || producto.Descripcion || 'Sin descripción';
    const precio = producto.precio || producto.Precio || 0;

    return (
      <div className="col mb-4">
        <div className="card h-100">
          <a href={urlProducto}>
            <img 
              src={urlImagen} 
              className="card-img-top" 
              alt={nombre}
              onError={(e) => {
                console.log('❌ Error cargando imagen:', urlImagen);
                e.target.src = 'imagenes/default-product.jpg'; // Imagen por defecto
              }}
            />
          </a>
          <div className="card-body d-flex flex-column">
            <a className="text-primary" href={urlProducto}>
              <h5 className="card-title">{nombre}</h5>
            </a>
            <p className="card-text">{descripcion}</p>
            <p className="text-primary fw-bold">S/ {precio}</p>
            
            {/* Control de cantidad */}
            <div className="mt-auto">
              <div className="row align-items-center mb-3">
                <div className="col-6">
                  <label htmlFor={`cantidad-${productoId}`} className="form-label mb-1">
                    <small>Cantidad:</small>
                  </label>
                  <input 
                    type="number" 
                    className="form-control form-control-sm" 
                    id={`cantidad-${productoId}`}
                    value={this.state.cantidad} 
                    onChange={this.handleCantidadChange}
                    min="1" 
                    max="20" 
                  />
                </div>
                <div className="col-6">
                  <button 
                    className="btn btn-primary btn-sm w-100" 
                    onClick={this.handleAgregarAlPedido}
                  >
                    <i className="fas fa-cart-plus me-1"></i>
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Debug info (remover en producción) */}
        <div style={{fontSize: '10px', color: '#999', padding: '5px'}}>
          <small>Debug: ID={productoId}</small>
        </div>
      </div>
    );
  }
}

export default CompProductoResumen;