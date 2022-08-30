import React from 'react'
import Cookies from 'universal-cookie';

const serverUrl = process.env.REACT_APP_SERVER;
const conectado = new Cookies();

const PaginaPrincipal = () => {
    console.log("id: " + conectado.get('id'));
    console.log("nombre: " + conectado.get('nombre'));
    console.log("apellido: " + conectado.get('apellido'));
    return (
    <div>PaginaPrincipal</div>
  )
}

export default PaginaPrincipal