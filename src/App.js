import React, {Component} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import PageListaProducto from './Componentes/PageListaProducto';

class App extends Component {

  render(){
    return (
      <BrowserRouter>
        <PageListaProducto />
      </BrowserRouter>
    );
  }
}

export default App;
