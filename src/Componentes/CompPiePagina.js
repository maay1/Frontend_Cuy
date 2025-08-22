import React, {Component} from 'react';

class CompPiePagina extends Component {

    render(){
    return (
      <footer 
        className="w-100 text-center py-3 mt-4" 
        style={{
          backgroundColor: '#343a40',
          position: 'relative',
          bottom: 0,
          left: 0,
          right: 0
        }}
      >
        <p style={{color: '#ffc107', margin: '0', fontSize: '1rem'}}>
          © 2025 Tienda Virtual
        </p>
      </footer>
    );
  }
}

export default CompPiePagina;