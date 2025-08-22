import React, { Component } from "react";
import CompProductoResumen from "./CompProductoResumen";

class CompListaProductos extends Component {
  render() {
    return (
      <div class="col-9">
        <p class="h5 text-secondary">Cuy</p>
        <div class="row row-cols-1 row-cols-md-3">
          {this.props.pListaDeProductos.map((lp) => (
            <CompProductoResumen pDatosDelProducto={lp} key={lp.id} />
          ))}
        </div>
      </div>
    );
  }
}

export default CompListaProductos;
