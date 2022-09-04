import React from 'react'
import {Row, Col, Card, Button} from 'react-bootstrap'
import Moment from 'moment';

import '../styles/Votacion.css'

const Votacion = (props) => {
  return (
    <Row id="rowDiv">
        {
            props.votaciones.map((item, index) => (
                <Col key={index} id='columnasDiv' lg={4} sm={6}>
                    <Card id='card'>
                        <Card.Body id='cardBody'>
                            <Button variant="primary" id="botonVotacion">IR A LA VOTACIÓN</Button>
                            <Card.Title id='cardTitulo'>{item.titulo.toUpperCase()}</Card.Title>
                            <Card.Text id='cardTexto'>{'Última modificación ' + Moment(item.fecha_modificacion).format("DD/MM/YYYY") + ' a las' + Moment(item.fecha_modificacion).format(" kk:mm:ss") + " hrs"}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            ))
        }
        
    </Row>
  )
}

export default Votacion