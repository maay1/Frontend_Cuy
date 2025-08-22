import React, {Component} from 'react';

class CompProductoDetalle extends Component {

  render(){
    return  <div className="col-9">
                <p className="h5 text-secondary">Producto</p>
                <div className="card mb-3">
                    <div className="row no-gutters">
                        <div className="col-md-4">
                            <img src="imagenes/producto1.png" className="card-img" alt="..." />
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                <h5 className="card-title text-primary">CASACA VARILITE</h5>
                                <p className="card-text">Cuando cae la temperatura, está casaca ofrece abrigo ligero y plegable contra el frio. Incorpora cámaras tejidas con aislamiento para un óptimo abrigo y una mayor resistencia al viento y el mal tiempo. Presenta un diseño suave al tacto con salidas para el cable de los audífonos en los bolsillos.</p>
                                <p className="h4 text-primary">S/ 379.00</p>
                                <p className="text-right">
                                    <a className="btn btn-lg btn-primary" href="#" role="button">Agregar al carrito</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
}

export default CompProductoDetalle;
