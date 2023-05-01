import React, {useEffect, useState} from 'react'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Pie from './Grafico'
import Table from 'react-bootstrap/Table';

import '../styles/ModalResultados.css'

const ModalResultados = (props) => {

  //const[mostrarGrafico, setMostrarGrafico] = useState(false);
  const[cantidadPersonas, setCantidadPersonas] = useState(0);

  
  

  useEffect( () => {

    var getVotos = [];
    //setMostrarGrafico(false)

    
    var totalVotos = 0;
    var cantPersonas = 0;

    //calcular la cant de personas
    //console.log(props.data.length)
    if(props.data.length > 0){
      for(let i in props.data[0].respuesta) {
        cantPersonas += props.data[0].respuesta[i].votos;
        //console.log("kk " + props.data[0].respuesta[i].votos)
      }
        
    }
    

    setCantidadPersonas(cantPersonas)
    

    for (var j in props.data) {
      for(let i in props.data[j].respuesta) {
        getVotos.push(props.data[j].respuesta[i].votos)
        //console.log(props.data[j].respuesta[i].votos)
      }
        
    }



    

    for (let k in getVotos){
        totalVotos += getVotos[k];
    }

    if(totalVotos > 0){
      //setMostrarGrafico(true);
    }
    


}, [props.data])


  console.log(props.data, props.estado, cantidadPersonas, props.dataUsuariosVot)
        
    
return (
    <><Modal
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
      {props.estado === 0 ?
        <>
          {props.data.map((e) => (
            <div id='contenedorModalResult'>
              <h3 key={e.idPregunta} id='tituloPregModalResult'>{e.tituloPreg}</h3>
              <div id='contenedorPie'>
                <Pie
                  width={1000}
                  height={400}
                  respuestas={e.respuesta} />
              </div>
            </div>
          ))} 
          <h3  id='tituloListaParticipantesModalResult'>Lista de participantes</h3>
          <Table striped bordered hover variant="dark" responsive>
            <tbody>
                <tr>
                    <th className='titulosTabla'>#</th>
                    <th className='titulosTabla'>Nombre Participante</th>
                    <th className='titulosTabla'>Rut</th>
                </tr>
                {<>{props.dataUsuariosVot.length}</>}
                {props.dataUsuariosVot.map((e, key) => (
                     <tr>
                        <td className='textosTabla'>{key + 1}</td>
                        <td className='textosTabla'>{e.NOMBRE}</td>
                        <td className='textosTabla'>{e.RUT}</td>
                    </tr> 
                ))}
            </tbody>
          </Table></> :
        <>
          {props.estado === 1 ?
            <>
              <h2 id='contenedorSinResp'>La cantidad de personas que han votado son: {cantidadPersonas}</h2>
            </> : <h2 id='contenedorSinResp'>Aun no ha empezado la votación</h2>}
        </>}

    </Modal.Body>
    <Modal.Footer>
      <Button onClick={props.onHide}>Cerrar Visualizar Resultados</Button>
    </Modal.Footer>
    </Modal>
    
      
    </>
  );
}

export default ModalResultados