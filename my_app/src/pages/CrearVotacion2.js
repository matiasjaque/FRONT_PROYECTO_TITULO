import React, { useEffect, useState} from 'react'

import { useParams } from 'react-router-dom';

import MyNavbar from '../componts/MyNavbar';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import '../styles/CrearVotacion2.css';

import axios from 'axios';
import Cookies from 'universal-cookie';
import Swal from 'sweetalert2';
const serverUrl = process.env.REACT_APP_SERVER;

const conectado = new Cookies();


var idUsuario = conectado.get('id'); 
var controlador = 1;


const CrearVotacion2 = () => {

const {tipo} = useParams();
const {idVotacion} = useParams();

console.log(tipo, idVotacion);

const [idVotacionLocal, setIdVotacionLocal] = useState(0);
const [idPregInsert, setIdPregInsert] = useState(0)
const [tituloVotacion, setTituloVotacion] = useState('');
const [preguntaVotacion, setPreguntaVotacion] = useState('');
const [idPregEditar, setIdPregEditar] = useState(0);

// funciones que necesito cargar en cada render
useEffect(() => {
    actualizarIdVotacion();
    actualizarIdPreguntas();
    if(tipo === 'especial' && controlador === 1){
        obtenerTituloVot();
        obtenerTituloPreg();	
        controlador = 0;
    }
});

const obtenerTituloVot = async() => {
	await axios.get(serverUrl + "/votacionById", {params:{idVotacion: idVotacion}})
            .then(response=>{
    
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

const obtenerTituloPreg = async() => {
	await axios.get(serverUrl + "/preguntasGet", {params:{idVotacion: idVotacion}})
            .then(response=>{
    
            console.log(response.data[0])
            let tituloGet = response.data[0].titulo;
			      setIdPregEditar(response.data[0].id_pregunta)
            setPreguntaVotacion(tituloGet);
            
        })
        .catch (error=> {
            Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            })
        })
}


const actualizarIdVotacion = async () =>{
    await axios.get(serverUrl + "/votaciones", {params:{idUsuario: idUsuario}})
      .then(response=>{
        setIdVotacionLocal(response.data[response.data.length - 1].id_votacion)
        //setLoading(true);
        //console.log("trae esto getVotaciones:");
        //console.log(response.data[response.data.length - 1].id_votacion);
    })
    .catch (error=> {
      setIdVotacionLocal(0)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
      })
    })
};

const actualizarIdPreguntas = async () =>{
    await axios.get(serverUrl + "/preguntasGetGlobal")
      .then(response=>{
        
        setIdPregInsert(response.data[response.data.length - 1].ID_PREGUNTA)
        //setLoading(true);
        //console.log("trae esto getPreguntas:");
        //console.log(response.data[response.data.length - 1].ID_PREGUNTA);
    })
    .catch (error=> {
      setIdVotacionLocal(0)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
      })
    })
};


const volverHome = () =>{
    window.location.replace('/misVotaciones')
}

const crearVotacion2 = () => {
    
    if(tituloVotacion !== '' && preguntaVotacion !== '') {
        console.log(tituloVotacion, preguntaVotacion);
        createVotacion()
        createPregunta()
        Swal.fire({title: 'Votaci??n creada con ??xito',
        icon: "success", timer: "2000"})
        setTimeout(function () {   
            //window.location.reload()
            window.location.replace('/misVotaciones');          
        }, 2000);
    }
    else{
        alert('Debe asegurarse de ingresar un titulo y pregunta para la nueva votaci??n')
    }
}

const GuardarCambios = () =>{
	if(tituloVotacion !== '' && preguntaVotacion !== '') {
        updateTituloVotacion();
        updateTituloPreg()
        Swal.fire({title: 'Votaci??n editada con ??xito',
        icon: "success", timer: "2000"})
        setTimeout(function () {   
            window.location.replace('/misVotaciones');          
        }, 2000);
    }
    else{
        alert('Debe asegurarse de ingresar un titulo y pregunta para la nueva votaci??n')
    }
}

const updateTituloVotacion = async () => {
	
	await axios({
		method: 'put',
		url:serverUrl + "/votacionUpdate", 
		headers: {'Content-Type': 'application/json'},
		params:{idVotacion: idVotacion, idUsuario: idUsuario, titulo: tituloVotacion}
	}).catch(error =>{
		alert(error.response.data.message);
		console.log(error);
	});
};

const updateTituloPreg = async () => {
	
	await axios({
		method: 'put',
		url:serverUrl + "/preguntaUpdate", 
		headers: {'Content-Type': 'application/json'},
		params:{idVotacion: idVotacion, idPregunta: idPregEditar, titulo: preguntaVotacion}
	}).catch(error =>{
		alert(error.response.data.message);
		console.log(error);
	});
};

const createVotacion = async () =>{
    var idVot = idVotacionLocal + 1;
    var estado = 2;
    console.log(idUsuario, tituloVotacion, idVot)
    await axios({
      method: 'post',
      url:serverUrl + "/votacionCreate", 
      headers: {'Content-Type': 'application/json'},
      params:
      {
        idUsuario: idUsuario,
        titulo: tituloVotacion,
        idVotacion: idVot,
        estado: estado,
        tipo: 'especial',
      }
    }).then(response=>{
      console.log("Funciona create votacion con id de votacion: ");
      console.log(response);
      //setIdVotacion(response.data.insertId);
    })
    .catch(error=>{
            alert(error.response.data.message);
            console.log(error);
        })
};

const createPregunta = async () =>{
    let idVot = idVotacionLocal + 1;

    let idPreguntaInsert = idPregInsert

    idPreguntaInsert++;

    console.log('idPregunta: ' )
    console.log(idPreguntaInsert);

    console.log('idVot: ' )
    console.log(idVot);
    await axios({
      method: 'post',
      url:serverUrl + "/preguntaCreate",
      headers: {'Content-Type': 'application/json'},
      params:
      {
        idVotacion: idVot,
        titulo: preguntaVotacion,
        idPregunta: idPreguntaInsert,
      }
    }).then(response=>{
      console.log("Funciona create pregunta ");
    })
    .catch(error=>{
            alert(error.response.data.message);
            console.log(error);
        })
};

  return (

    <>{tipo === 'null'?
    
    <div id='contenedorPrincipalMisVotaciones2'>
        <MyNavbar activeKey='/crearVotacion'/>
        <div id='contenedorSecundarioMisVotaciones2'>
          <div id='contenedorCrearVotacion2'>
            <Row className='filasCrearVot2' id='filaTitulo'>
              <Col lg={12} md={12} sm={12} className='columnasVot2'>
                <h1 id='tituloVotacion2'>              
                  Para crear una nueva votaci??n especial ingrese los siguientes datos por favor
                </h1>
              </Col>
            </Row>

            <Row className='filasCrearVot2' id='filaTituloVot'>
              <Col lg={12} md={12} sm={12} className='columnasVot2'>
                <Form.Label className="titulosForm2">T??TULO DE LA NUEVA VOTACI??N</Form.Label>
                <Form.Control className="textosForm2"
                    type="text"
                    placeholder="Ingrese el t??tulo de la votaci??n"
                    value={tituloVotacion}
                    onChange={(e) => setTituloVotacion(e.target.value)}
                /> 
              </Col>
            </Row>

            <Row className='filasCrearVot2' id='filaTituloPreg'>
                <Col lg={12} md={12} sm={12} className='columnasVot2'>
                    <Form.Label className="titulosForm2">T??TULO DE LA PREGUNTA</Form.Label>
                    <Form.Control className="textosForm2"
                        type="text"
                        placeholder="Ingrese la pregunta de la votaci??n"
                        value={preguntaVotacion}
                        onChange={(e) => setPreguntaVotacion(e.target.value)}
                    /> 
                </Col>
            </Row>

            <Row className='filasCrearVot2' id='filavot2Botones'>
              <Col lg={12} md={12} sm={12} className='columnasVot2'>
                <div id='contenedorBotonesVot2'>
                    <Button  className='boton2' onClick={volverHome}>Cancelar</Button>
                    <Button className='boton2' onClick={crearVotacion2}>Crear Votaci??n</Button>
                </div>
              </Col>
            </Row>
            
            
                
          </div>
          
        </div>
          
      </div>:
      <div id='contenedorPrincipalMisVotaciones2'>
      <MyNavbar activeKey='/crearVotacion'/>
      <div id='contenedorSecundarioMisVotaciones2'>
        <div id='contenedorCrearVotacion2'>
          <Row className='filasCrearVot2' id='filaTitulo'>
            <Col lg={12} md={12} sm={12} className='columnasVot2'>
              <h1 id='tituloVotacion2'>              
                Editar Votaci??n
              </h1>
            </Col>
          </Row>

          <Row className='filasCrearVot2' id='filaTituloVot'>
            <Col lg={12} md={12} sm={12} className='columnasVot2'>
              <Form.Label className="titulosForm2">T??TULO DE LA VOTACI??N</Form.Label>
              <Form.Control className="textosForm2"
                  type="text"
                  placeholder="Ingrese el t??tulo de la votaci??n"
                  value={tituloVotacion}
                  onChange={(e) => setTituloVotacion(e.target.value)}
              /> 
            </Col>
          </Row>

          <Row className='filasCrearVot2' id='filaTituloPreg'>
              <Col lg={12} md={12} sm={12} className='columnasVot2'>
                  <Form.Label className="titulosForm2">T??TULO DE LA PREGUNTA</Form.Label>
                  <Form.Control className="textosForm2"
                      type="text"
                      placeholder="Ingrese la pregunta de la votaci??n"
                      value={preguntaVotacion}
                      onChange={(e) => setPreguntaVotacion(e.target.value)}
                  /> 
              </Col>
          </Row>

          <Row className='filasCrearVot2' id='filavot2Botones'>
            <Col lg={12} md={12} sm={12} className='columnasVot2'>
              <div id='contenedorBotonesVot2'>
                  <Button  className='boton2' onClick={volverHome}>Cancelar</Button>
                  <Button className='boton2' onClick={GuardarCambios}>Guardar Cambios</Button>
              </div>
            </Col>
          </Row>
          
          
              
        </div>
        
      </div>
        
    </div>}</>
  )
}
  

export default CrearVotacion2