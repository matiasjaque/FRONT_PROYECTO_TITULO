import React, { useEffect, useState} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';

import { useParams } from 'react-router-dom';
import axios from 'axios';
//import Cookies from 'universal-cookie';


import Swal from 'sweetalert2';
//const conectado = new Cookies();

import MyNavbar from '../componts/MyNavbar';

import '../styles/VerVotacion.css';

const serverUrl = process.env.REACT_APP_SERVER;


const VerVotacion = () => {

const {idPreg} = useParams();
const {idVotacion} = useParams();

//titulo votacion
const [tituloVotacion, setTituloVotacion] = useState('');

const [porcentajeVotacion, setPorcentajeVotacion] = useState('');

//data preg y resp
const [respuestas, setRespuestas] = useState([]);
const [preguntas, setPreguntas] = useState([]);

//data participantes
const [listaParticipantes, setListaParticipantes] = useState([]);

var controlador = 0;

// funciones que necesito cargar en cada render
useEffect(() => {
    if(controlador === 0){
        obtenerTituloVot();
        preguntasConRespuestasGet()
        // eslint-disable-next-line react-hooks/exhaustive-deps
        controlador = 1;
    }

    
  },[controlador]);

const obtenerTituloVot = async() => {
	await axios.get(serverUrl + "/votacionById", {params:{idVotacion: idVotacion}})
            .then(response=>{
            let segura = response.data[0].segura;
            setPorcentajeVotacion(response.data[0].porcentaje)
            if(segura === 1){
                getUsuarioVotantes(idVotacion)
            }
            console.log(response.data[0])
            let tituloGet = response.data[0].TITULO;
            setTituloVotacion(tituloGet);
            
        })
        .catch (error=> {
            Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            })
        })
}

const preguntasConRespuestasGet = async () =>{
    await axios.get(serverUrl + "/preguntasConRespuestas", {params:{idVotacion: idVotacion}})
        .then(response=>{
        //setPreguntas(response.data);
        var dataPregYresp = response.data;

        
        const newPregYresp = [];
        dataPregYresp.forEach( (k) => {
            if (newPregYresp.length === 0) {
                let newK = {
                    idPregunta: k.ID_PREGUNTA,
                    tituloPreg: k.TITULO,
                }
                newPregYresp.push(newK);
            }
            else{
                let estaLaPreg = 0;
                for (let i = 0; i < newPregYresp.length; i++) {
                    if (newPregYresp[i].idPregunta === k.ID_PREGUNTA){
                        estaLaPreg++;
                    }
                }
                if (estaLaPreg === 0) {
                    
                    let newK = {
                        idPregunta: k.ID_PREGUNTA,
                        tituloPreg: k.TITULO,
                        respuesta: [],
                    }
                    newPregYresp.push(newK);
                }
            }
        })

        newPregYresp.forEach ( (k) => {
            const newResp = [];
            for (let i = 0; i < dataPregYresp.length; i++) {
                if (k.idPregunta === dataPregYresp[i].ID_PREGUNTA){
                    let resp = {
                                    idPreg: dataPregYresp[i].ID_PREGUNTA,
                                    idResp: dataPregYresp[i].ID_RESPUESTA,
                                    respuesta: dataPregYresp[i].RESPUESTA,
                                    votos: dataPregYresp[i].VOTOS,
                                    isCheck: false,
                                }
                    newResp.push(resp)
                }
            }
            for (let j = 0; j < newPregYresp.length; j++) {
                if(newPregYresp[j].idPregunta === newResp[0].idPreg) {
                    newPregYresp[j].respuesta = newResp
                }   
            }

        })

        // obtener las respuestas antes de que se editen
        var newRespGen = []
        newPregYresp.forEach((p) => {
            console.log(p)
            
            p.respuesta.forEach((r) => {
                newRespGen.push(r)    
            })
        })


        //setLoading(true);
        //setRespuestasGen(newRespGen)
        setRespuestas(newRespGen)
        setPreguntas(newPregYresp);
    })
    .catch (error=> {
        Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
        })
    })
};

const getUsuarioVotantes = async (idVot) =>{
    console.log(idVot)
    console.log(typeof(idVot));
    await axios.get(serverUrl + "/usuariosVotante")
      .then(response=>{
        let usuarioVotantes = response.data.filter((e) => e.ID_VOTACION === parseInt(idVot));
        console.log(typeof(response.data[0].ID_VOTACION));
        console.log(response.data)
        console.log(usuarioVotantes)
  
        setListaParticipantes(usuarioVotantes)
    })
    .catch (error=> {
      //setIdVotacion(0)
      /* Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
      }) */
    })
  };

  const volverHome = () =>{
    window.location.replace('/misVotaciones')
}

console.log(idPreg, idVotacion);
console.log(preguntas)
console.log(respuestas)
console.log(listaParticipantes);


return (
      <div id='contenedorPrincipalVerVot'>
      <MyNavbar activeKey='/crearVotacion'/>
      <div id='contenedorSecundarioVerVot'>

        <Row id='primeraFilaVerVot'>
            <Col lg={12} md={12} sm={12} >
                <h1 id='tituloVerVot'>              
                    {tituloVotacion}
                </h1>
            </Col>
        </Row>
        
        {
          preguntas.length > 0  ? 
          <div id='contenedorVerVotacion'>
            
            {porcentajeVotacion > 0 ?
                <Row id='filasFormCrear'>
                    <Col sm md lg ={11} id='columnaPorcentajePreg'>
                      
                    <h1 id='porcentajeVerVot'>              
                        Porcentaje de votación {porcentajeVotacion} %
                    </h1>   
                    </Col>

                    
                </Row>:<></>}

              {preguntas.map((element) => (
                <div id='contenedorForm'>
                <Form id='form'>
                  <Row id='filasFormCrear'>
                    <Col sm md lg ={11} id='columnaTituloPreg'>
                      
                    <Form.Control id='inputPreg'  type="text" placeholder={element.tituloPreg} readOnly/> 
                      
                      
                    </Col>

                    
                  </Row>
                  
                <div id="contenedorRespuestas">
                  <> {
                    element.respuesta.length > 0 ?
                    element.respuesta.map((elem) =>(
                      
                      <Row id='filasFormCrear2'>
                        <Col sm md lg ={11} className='columnas' id='columnaTituloPreg'>
                          <Form.Control id='inputResp' type="text" placeholder={elem.respuesta} readOnly/>
                        </Col>
                      </Row>
                      
                      )):
                      <></>
                  }
                  </>
                </div>
                    
                        
                </Form>
              
                </div>))} 
            
            
        </div>
          :
          <div id='contenedorVotacion'>
            no
          </div>
        } 

            <>{listaParticipantes.length > 0?
                <div id='contenedorTablaVerVot'>
                <h1 id='tituloVerVot'>              
                    Lista de participantes
                </h1>
                <Table striped bordered hover variant="dark" responsive>
                <tbody>
                    <tr>
                        <th className='titulosTabla'>#</th>
                        <th className='titulosTabla'>Nombre Participante</th>
                        <th className='titulosTabla'>Rut</th>
                    </tr>
                    
                    {listaParticipantes.map((e, key) => (
                         <tr>
                            <td className='textosTabla'>{key + 1}</td>
                            <td className='textosTabla'>{e.NOMBRE}</td>
                            <td className='textosTabla'>{e.RUT}</td>
                        </tr> 
                    ))}
                </tbody>
              </Table>
              </div>:
              <div></div>

            }</>
            <div id='filaBotonVerVot'>
                <Button id='botonVolverVerVot' onClick={volverHome}>Volver</Button>
            </div>
            
      </div>
        
    </div>
  )
}

export default VerVotacion