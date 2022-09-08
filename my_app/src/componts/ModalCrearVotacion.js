import React, { useState} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import '../styles/ModalCrearVotacion.css'

import CrearVotacion from '../pages/CrearVotacion'


const ModalCrearVotacion = (props) => {
    const [tituloVotacion, setTituloVotacion] = useState('');
    const [cantidadPreg, setCantidadPreg] = useState(0);
    const [cantidadResp, setCantidadResp] = useState(0);


    const crearVotacion = () =>{
        if(tituloVotacion !== null && cantidadPreg > 0 && cantidadResp > 0){
            window.location.replace('/crearVotacion')
        }
        else{
            alert("todos los parametros son obligatorios");
        }
    }

    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="tituloModal">
              Para crear una nueva votacion ingrese los siguientes datos por favor
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
                <Form.Label className="titulosForm">TÍTULO DE LA VOTACIÓN</Form.Label>
                <Form.Control className="textosForm"
                    type="text"
                    placeholder="Ingrese el título de la votación"
                    onChange={(e) => setTituloVotacion(e.target.value)}
                />
                <br />
                <Form.Label className="titulosForm">CANTIDAD DE PREGUNTAS DE LA VOTACIÓN</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Ingrese la cantidad de preguntas que tendra la votación"
                    onChange={(e) => setCantidadPreg(e.target.value)}
                />
                <br />
                <Form.Label className="titulosForm">CANTIDAD DE RESPUESTAS POR PREGUNTA DE LA VOTACIÓN</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Ingrese la cantidad de respuestas por pregunta que tendra la votación"
                    onChange={(e) => setCantidadResp(e.target.value)}
                />                
            </Form>
          
            
            
            
            
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide}>Cancelar</Button>
            <Button onClick={crearVotacion}>Continuar</Button>
          </Modal.Footer>
        </Modal>
      );
}

export default ModalCrearVotacion


