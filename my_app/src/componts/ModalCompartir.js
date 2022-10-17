import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import '../styles/ModalCrearVotacion.css'



const ModalCrearVotacion = (props) => {

  const copiarEnlace = () => {
    var aux = document.getElementById('inputEnlace').value;

    navigator.clipboard.writeText(aux);
    console.log(aux);
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
              Compartir Votación
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h3>Enlace</h3>
            <Form.Control id='inputEnlace' type='text' value={props.enlace}/> 

          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide}>Cancelar</Button>
            <Button onClick={() => copiarEnlace()}>Copiar Enlace</Button>
          </Modal.Footer>
        </Modal>
      );
}

export default ModalCrearVotacion





