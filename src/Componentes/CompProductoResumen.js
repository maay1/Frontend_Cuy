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
    // Podrías llamar a una función del componente padre para manejar esto
    // this.props.onAgregarAlPedido(this.props.pDatosDelProducto, this.state.cantidad);
  }

  render() {
    var urlImagen = "imagenes/" + this.props.pDatosDelProducto.url;
    var urlProducto = "producto/" + this.props.pDatosDelProducto.id;
    
    return (
      <div className="col mb-4">
        <div className="card h-100">
          <a href="producto/1">
            <img src={urlImagen} className="card-img-top" alt="..." />
          </a>
          <div className="card-body d-flex flex-column">
            <a className="text-primary" href={urlProducto}>
              <h5 className="card-title">{this.props.pDatosDelProducto.nombre}</h5>
            </a>
            <p className="card-text">{this.props.pDatosDelProducto.descripcion}</p>
            <p className="text-primary fw-bold">S/ {this.props.pDatosDelProducto.precio}</p>
            
            {/* Control de cantidad */}
            <div className="mt-auto">
              <div className="row align-items-center mb-3">
                <div className="col-6">
                  <label htmlFor={`cantidad-${this.props.pDatosDelProducto.id}`} className="form-label mb-1">
                    <small>Cantidad:</small>
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    id={`cantidad-${this.props.pDatosDelProducto.id}`}
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
      </div>
    );
  }
}

export default CompProductoResumen;