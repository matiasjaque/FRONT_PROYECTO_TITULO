import React, {useEffect, useState} from 'react'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Pie from './Grafico'

import '../styles/ModalResultados.css'

const ModalResultados = (props) => {

  const[mostrarGrafico, setMostrarGrafico] = useState(false);
  console.log(props.data)
  

  useEffect( () => {

    var getVotos = [];
    setMostrarGrafico(false)

    
    var totalVotos = 0;
    

    for (var j in props.data) {
      for(let i in props.data[j].respuesta) {
        getVotos.push(props.data[j].respuesta[i].votos)
        console.log(props.data[j].respuesta[i].votos)
      }
        
    }

    

    for (let k in getVotos){
        totalVotos += getVotos[k];
    }

    if(totalVotos > 0){
      setMostrarGrafico(true);
    }
    


}, [props.data])
  
    
        
    
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
        {mostrarGrafico ?
          <>
          {props.data.map( (e) => (
            <div id='contenedorModalResult'>
                <h3 key={e.idPregunta} id='tituloPregModalResult'>{e.tituloPreg}</h3>
                <div id='contenedorPie'>
                    <Pie   
                        width = {1000}
                        height = {400}
                        respuestas = {e.respuesta}
                    />
                </div>
            </div>
        ))} </>:
        <h2 id='contenedorSinResp'>Aun no hay respuestas</h2>
        
        }

      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Cerrar Visualizar Resultados</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalResultados