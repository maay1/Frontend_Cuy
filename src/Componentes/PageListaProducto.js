import React, {Component} from 'react';
import CompCabecera from './CompCabecera';
import CompListaCategoria from './CompListaCategoria';
import CompPiePagina from './CompPiePagina';
import CompListaProducto from './CompListaProducto';

class PageListaProducto extends Component{
    render(){
        return <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
                    <CompCabecera />
                    <main role="main" className="container flex-grow-1" style={{paddingTop: '90px'}}>      
                        <div className="row">
                            <CompListaCategoria />
                            <CompListaProducto />
                        </div>
                    </main>
                    <CompPiePagina />
                </div>

    }
}
export default PageListaProducto;