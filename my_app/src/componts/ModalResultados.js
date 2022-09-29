import React from 'react'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Pie from './Grafico'

import '../styles/ModalResultados.css'

const ModalResultados = (props) => {
  
    
        
    
        return (
            <Modal
              {...props}
              size="xl"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title id="tituloModalResult">
                {`Resultados de ${props.tituloVotacion}`}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body id='contenedorBodyModalResult'>
                {props.data.map( (e) => (
                    <div id='contenedorModalResult'>
                        <h3 key={e.idPregunta} id='tituloPregModalResult'>{e.tituloPreg}</h3>
                        <div id='contenedorPie'>
                            <Pie   
                                respuestas = {e.respuesta}
                            />
                        </div>
                    </div>
                ))} 
    
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={props.onHide}>Cerrar Visualizar Resultados</Button>
              </Modal.Footer>
            </Modal>
          );
}

export default ModalResultados