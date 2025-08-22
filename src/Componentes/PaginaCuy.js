import React, {Component} from 'react';
import CompCabecera from './CompCabecera';
import CompPiePagina from './CompPiePagina';
import CompListaCategoria from './CompListaCategoria';
import CompProductoDetalle from './CompProductoDetalle';

class PageProducto extends Component {

  render(){
    return  <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
                <CompCabecera />
                <main role="main" className="container flex-grow-1" style={{paddingTop: '90px'}}>      
                    <div className="row">
                        <CompListaCategoria />
                        <CompProductoDetalle />
                    </div>
                </main>
                <CompPiePagina />
            </div>
  }
}

export default PageProducto;