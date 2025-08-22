import React, {Component} from 'react';
import CompCabecera from './CompCabecera';
import CompListaCategoria from './CompListaCategoria';
import CompPiePagina from './CompPiePagina';
import CompListaProducto from './CompListaProducto';

class PageListaProductos extends Component {

  render(){
    return  <div >
                <CompCabecera />
                <main role="main" className="container">      
                    <div className="row">
                        <CompListaCategorias />
                        <CompListaProductos pListaDeProductos={dataJsonListaProductos}/>
                    </div>
                </main>
                <CompPiePagina />
            </div>
  }
}

export default PageListaProductos;