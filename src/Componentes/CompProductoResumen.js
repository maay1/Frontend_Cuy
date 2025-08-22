import React, {Component} from "react";

class CompProductoResumen extends Component{
    render(){
    return  <div class="col mb-4">
                <div class="card h-100">
                    <a href="#">
                        <img src="imagen/producto1.webp" class="card-img-top" alt="..."/>
                    </a>
                    <div class="card-body">
                        <a class="text-primary" href="#">
                            <h5 class="card-title">Cuy Peruano</h5>
                        </a>
                        <p class="card-text">Color narajan y pesa 500gr</p>
                        <p class="text-primary">S/ 36.00</p>
                    </div>
                </div>
            </div>
  }
}

export default CompProductoResumen;
