import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import Table from 'react-bootstrap/Table';

import '../styles/ModalVisualizarResul.css';



const ModalVisualizarResult = (props) => {
    console.log(props.titulo)
    console.log(props.data)
  return (
    <Modal
        {...props}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
    >
        <Modal.Header closeButton>
            <Modal.Title id="tituloModalVisRes">
                {props.titulo}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
  
            <Table striped bordered hover variant="dark" responsive>
                <tbody>
                    <tr>
                        <th className='titulosTabla'>#</th>
                        <th className='titulosTabla'>Nombre</th>
                        <th className='titulosTabla'>Cantidad de votos</th>
                    </tr>
                    {<>{props.data.length}</>}
                    {props.data.map((e, key) => (
                        <tr>
                            <td className='textosTabla'>{key + 1}</td>
                            <td className='textosTabla'>{e.respuesta}</td>
                            <td className='textosTabla'>{e.votos}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

        </Modal.Body>
        <Modal.Footer>
            <Button id='botonCerrarVisRes' onClick={props.onHide}>Cerrar visualizar resultados</Button>
        </Modal.Footer>
    </Modal>
  )
}

export default ModalVisualizarResult