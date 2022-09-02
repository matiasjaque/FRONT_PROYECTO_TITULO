import React from 'react'
import Cookies from 'universal-cookie';
import Button from 'react-bootstrap/Button';

import MyNavbar from '../componts/MyNavbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const serverUrl = process.env.REACT_APP_SERVER;
const conectado = new Cookies();

const PaginaPrincipal = () => {
    console.log("id: " + conectado.get('id'));
    console.log("nombre: " + conectado.get('nombre'));
    console.log("apellido: " + conectado.get('apellido'));
    
    return (

      <div>
          <Row>
            <MyNavbar/>
          </Row>
          PaginaPrincipal
          <Button href="/">volver</Button>
        

      </div>
  )
}

export default PaginaPrincipal