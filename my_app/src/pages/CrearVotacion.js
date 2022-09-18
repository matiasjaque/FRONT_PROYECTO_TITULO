import React, { useEffect, useState} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import MyNavbar from '../componts/MyNavbar';

import '../styles/CrearVotacion.css'

import { AiFillCloseCircle } from "react-icons/ai";

import axios from 'axios';
import Cookies from 'universal-cookie';


import Swal from 'sweetalert2';

const serverUrl = process.env.REACT_APP_SERVER;
const conectado = new Cookies();


var idUsuario = conectado.get('id');


const CrearVotaciones = (props) => {
  

  const [tituloVotacion, setTituloVotacion] = useState('');
  const [idVotacion, setIdVotacion] = useState(0);

  
  const [cantidadPreg, setCantidadPreg] = useState(0);
  const [cantidadResp, setCantidadResp] = useState(0);

  const [respuestas, setRespuestas] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  var preguntasDemo = [];
  var respuestasDemo = [];
  
  var idRespuesta = 0;

  const [idResp, setIdResp] = useState(0)
  const [idPreg, setIdPreg] = useState(0)

  //var prueba = ['a', 'b'];

  //const [kk, setKk] = useState(['uno', 'dos', 'tres']);

  const [datosVotacion, setDatosVotacion] = useState(false);

  // funciones que necesito cargar en cada render
  useEffect(() => {
    actualizarIdVotacion();
    actualizarIdPreguntas();
  },[]);


  const actualizarIdVotacion = async () =>{
    await axios.get(serverUrl + "/votaciones", {params:{idUsuario: idUsuario}})
      .then(response=>{
        setIdVotacion(response.data[response.data.length - 1].id_votacion)
        //setLoading(true);
        //console.log("trae esto getVotaciones:");
        //console.log(response.data[response.data.length - 1].id_votacion);
    })
    .catch (error=> {
      setIdVotacion(0)
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
        setIdPreg(response.data[response.data.length - 1].ID_PREGUNTA)
        //setLoading(true);
        //console.log("trae esto getPreguntas:");
        //console.log(response.data[response.data.length - 1].ID_PREGUNTA);
    })
    .catch (error=> {
      setIdVotacion(0)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
      })
    })
  };


  const volverHome = () =>{
    window.location.replace('/paginaPrincipal')
  }

  //funcion que inicializa la votacion con los datos ingresados por el usuario
  const continuarVotacion = () =>{
    setDatosVotacion(false);
    var idPregunta = idPreg;
    //setPreguntas()
    // validos todos los parametros y que preguntas no tenga datos
    if(tituloVotacion !== null && cantidadPreg > 0  && cantidadResp > 0 && preguntasDemo.length === 0 && respuestasDemo.length === 0) {
      //console.log('cantidadPreg ' + cantidadPreg); 
      //console.log('preguntasDemo length ' + preguntasDemo.length);
      //var cantPreg = preguntasDemo.length;
      
      for(let i = 0; i < cantidadPreg; i++){
        //preguntasDemo.push(i+1);
        //console.log('hola')
          preguntasDemo.push(
          {
            id: idPregunta + 1,
            tituloPregunta: '',
            respuestas : [],
          })
          for (let j = 0; j < cantidadResp; j++){
            respuestasDemo.push({
              idPregunta: idPregunta + 1,
              idRespuesta: idRespuesta,
              tituloRespuesta: '',
            })
            idRespuesta ++;
          }
        //console.log('id de pregunta: ' + idPregunta);
        
        idPregunta ++;
      }
      setIdResp(idRespuesta)
      setIdPreg(idPregunta)

      for (let i = 0; i <cantidadPreg; i++){
        
        for (let j = 0; j <respuestasDemo.length; j++){

          //console.log(preguntasDemo[i].id + ' === ' + respuestasDemo[j].idPregunta)
          if (preguntasDemo[i].id === respuestasDemo[j].idPregunta){
            preguntasDemo[i].respuestas.push({
              idRespuesta: respuestasDemo[j].idRespuesta,
              tituloRespuesta: respuestasDemo[j].tituloRespuesta,
              idPregunta: respuestasDemo[j].idPregunta,
            })
          }
        }
      }
      /* console.log('preguntasDemo ');
      console.log(preguntasDemo);
      console.log('respuestasDemo ');
      console.log(respuestasDemo); */
      
      setPreguntas(preguntasDemo);
      setRespuestas(respuestasDemo);

      setDatosVotacion(true);/* 
      console.log(datosVotacion);
      console.log('preguntas de abajo ');
      console.log(preguntasDemo);
      console.log('largo preguntasDemo ' + preguntasDemo.length);
      prueba.push('2') */
      
  
      //console.log('largo de prueba 1 ' + prueba.length);
    }

    else{
        alert("todos los parametros son obligatorios");
    }
  }


  // funcion para eliminar una pregunta de la votacion

  const eliminarPregunta = (idPregu) => {
    setDatosVotacion(false);
    /* console.log("id preg: " );
    console.log(idPreg)

    console.log('cantidad de preg antes: ')
    console.log(cantidadPreg); */

    const newPreguntas = preguntas.filter((preg) => preg.id !== idPregu);


    const newResp = respuestas.filter((resp) => resp.idPregunta !== idPregu);


    console.log('newResp');
    console.log(newResp);

    setPreguntas(newPreguntas);
    setRespuestas(newResp);

    setCantidadPreg(cantidadPreg - 1);

    document.getElementById('cantPreg').value = cantidadPreg;

    /* console.log('cantidad de preg desp: ')
    console.log(cantidadPreg); */

    setDatosVotacion(true);

  }

  const eliminarRespuesta = (idResp, idPreg) => {
    setDatosVotacion(false);

    /* console.log("id Resp: " );
    console.log(idResp)
    console.log("resp: " );
    console.log(resp)

    console.log("Respuestas : " );
    console.log(respuestas) */


    const newPreguntas = preguntas.map((pregunta) => {
    const newRespuestas = respuestas.filter((respu) => (respu.idRespuesta !== idResp && respu.idPregunta === pregunta.id ));
    console.log(newRespuestas);
       if (pregunta.id === idPreg) {

        return {
          ...pregunta,
          respuestas: newRespuestas,
        }
       }
       return pregunta

    })

    
    const newRespuestas2 = respuestas.filter((respu) => respu.idRespuesta !== idResp);

    setRespuestas(newRespuestas2);
    setPreguntas(newPreguntas);
    console.log(preguntas)

    setDatosVotacion(true);
  }



  const agregarRespuesta = (idPregunta) => {
    setDatosVotacion(false);

    const newResp = {
      idPregunta: idPregunta,
      idRespuesta: idResp,
      tituloRespuesta: '',
    }

    setRespuestas([...respuestas, newResp])

    console.log('resp IMPORTANT NO ESTA SET')
    console.log(respuestas)
      
    setIdResp(idResp + 1)

      const newRespuestas = respuestas.filter((respu) => (respu.idPregunta === idPregunta));
      newRespuestas.push(newResp)
      console.log('newRespuestas');

      console.log(newRespuestas);

      const newPreguntas = preguntas.map((preg) => {
      if(preg.id === idPregunta){
        return {
          ...preg,
          respuestas: newRespuestas,
        }
      }
      return preg
    })
    console.log('newPreguntas')
    console.log(newPreguntas)
    setPreguntas(newPreguntas)
    setDatosVotacion(true);

  }

  // funcion para agregar preguntas a la votacion
  const agregarPregunta = (idPregu) =>{

    setDatosVotacion(false);

    console.log(idPreg);
    console.log(idResp);

    const newResp = {
      idPregunta: idPreg + 1,
      idRespuesta: idResp,
      tituloRespuesta: '',
    }

    setRespuestas([...respuestas, newResp]);

    const newPreg = {
        id: idPreg + 1,
        tituloPregunta: '',
        respuestas : [
          newResp
        ]
    };
    console.log(newPreg)
    var newPreguntas = [];

    preguntas.map((preg) => {
      console.log( preg.id + ' === ' + idPregu) 
      if(preg.id === idPregu){
        return(
          newPreguntas.push(preg),
          newPreguntas.push(newPreg)
        )
      }
      return newPreguntas.push(preg);
    })
    console.log(newPreguntas)
 
    setIdResp(idResp + 1)
    setIdPreg(idPreg + 1)

    setPreguntas(newPreguntas)

    //setCantidadPreg(cantidadPreg + 1);
    setCantidadPreg( (cantidadPreg + 1) );
    console.log(cantidadPreg)

    document.getElementById('cantPreg').value = cantidadPreg + 1;

    setDatosVotacion(true);
    console.log('termino')
  }

  // funcion para actualizar los titulos

  const updateTitulos = (idPregu, newTitle) => {
    setDatosVotacion(false);
    console.log('updateTitulos')

    const newPreguntas = preguntas.map((preg) => {
      if(preg.id === idPregu){
        return {
          ...preg,
          tituloPregunta: newTitle,
        }
      }
      return preg
    })

    setPreguntas(newPreguntas)
    setDatosVotacion(true);

  }

  //funcion para actualizar los titulos de respuestas
  
  const updateTitulosResp = (idRespu, idPregu, newTitleResp) => {
    setDatosVotacion(false);
    console.log('datos de la funcion: ')
    console.log(idRespu);
    console.log(idPregu);
    console.log(newTitleResp);


    // actualizar las respuestas generales
    const newRespuestas = respuestas.map((resp) => {
      console.log(resp.idRespuesta + ' === ' + idRespu);
      if(resp.idRespuesta === idRespu){
        return {
          ...resp,
          tituloRespuesta: newTitleResp,
        }
      }
      return resp;
    })
    console.log('newRespuestas')
    console.log(newRespuestas)
    setRespuestas(newRespuestas);


    // juntar las nuevas respuestas

    const newResp = newRespuestas.filter((resp) => (resp.idPregunta === idPregu));

    console.log('newResp')
    console.log(newResp)

    //actualizar el titulo de respuesta de las preguntas

    const newPreguntas = preguntas.map((preg) => {

      if(preg.id === idPregu){
        return {
          ...preg,
          respuestas: newResp
          }
            
      }

      return preg
    })

    console.log('newPreguntas')
    console.log(newPreguntas)
    setPreguntas(newPreguntas);
    setDatosVotacion(true);


  }

  const createVotacion = async () =>{
    console.log(idUsuario, tituloVotacion)
    await axios({
      method: 'post',
      url:serverUrl + "/votacionCreate", 
      headers: {'Content-Type': 'application/json'},
      params:
      {
        idUsuario: idUsuario,
        titulo: tituloVotacion,
      }
    }).then(response=>{
      console.log("Funciona create votacion con id de votacion: ");
      console.log(response.data.insertId);
      setIdVotacion(response.data.insertId);
    })
    .catch(error=>{
            alert(error.response.data.message);
            console.log(error);
          })
  };

  const createPreguntasYrespuestas = () => {
    console.log(preguntas.length)

    var titulosPregVacios = 0;

    var titulosRespVacios = 0;
  
    for (let i = 0; i < preguntas.length; i++) {
      if (preguntas[i].tituloPregunta === '' || preguntas[i].tituloPregunta === undefined){
        titulosPregVacios++;
      }
    }

    for (let i = 0; i < respuestas.length; i++) {
      if (respuestas[i].tituloRespuesta === '' || respuestas[i].tituloRespuesta === undefined){
        titulosRespVacios++;
      }
    }

    if(titulosPregVacios === 0){
      if(titulosRespVacios === 0){
        preguntas.map( (preg) => {
          console.log(preg.tituloPregunta);
          createPregunta(preg.tituloPregunta);
          preg.respuestas.map( (resp) =>{
            createResp(resp.idPregunta, resp.tituloRespuesta)
          })
        })
      }
      else{
        alert('Debe asegurarse de que todas las preguntas tengan sus respuestas asociadas.');
      }
      

    }

    else{
      alert('Debe asegurarse de que todas las preguntas tengan un titulo asociado.');
    }

  }


      

  
  const createPregunta = async (tituloVota) =>{
    console.log('idVotacion: ' )
    console.log(idVotacion);
    let idVot = idVotacion;

    console.log('idVot: ' )
    console.log(idVot);
    await axios({
      method: 'post',
      url:serverUrl + "/preguntaCreate", 
      headers: {'Content-Type': 'application/json'},
      params:
      {
        idVotacion: idVot + 1,
        titulo: tituloVota,
      }
    }).then(response=>{
      console.log("Funciona create pregunta ");
    })
    .catch(error=>{
            alert(error.response.data.message);
            console.log(error);
          })
  };

  const createResp = async (idPregu, tituloResp) =>{
    
    console.log(idPregu, tituloResp);

    await axios({
      method: 'post',
      url:serverUrl + "/respuestaCreate", 
      headers: {'Content-Type': 'application/json'},
      params:
      {
        idPregunta: idPregu,
        respuestas: tituloResp,
      }
    }).then(response=>{
      console.log("Funciona create respuesta ");
    })
    .catch(error=>{
            alert(error.response.data.message);
            console.log(error);
          })
  };


  //funcion que crea la votacion

  const crearVotacion = () => {
    console.log('crearVotacion')

    setDatosVotacion(false)

    // crear la votacion
    createVotacion()

    // crear preguntas y respuestas de la votacion
    createPreguntasYrespuestas()

    setDatosVotacion(true)

  }

   console.log('preg')
  console.log(preguntas)
  console.log('resp')
  console.log(respuestas)
/*
  
  console.log('idResp')
  console.log(idResp)

  console.log('idPreg')
  console.log(idPreg)

  console.log('tituloVotacion')
  console.log(tituloVotacion)

  console.log('cantidadPreg')
  console.log(cantidadPreg)

  console.log('cantidadResp')
  console.log(cantidadResp) */


  return (
    <div id='contenedorPrincipalMisVotaciones'>
        <MyNavbar activeKey='/crearVotacion'/>
        <div id='contenedorSecundarioMisVotaciones'>
          <div id='contenedorSuperiorCrearVotacion'>
            <Row className='filas'>
              <Col lg={12} md={12} sm={12} className='columnas'>
                <h1 id='tituloVotacion'>              
                  Para crear una nueva votacion ingrese los siguientes datos por favor
                </h1>
              </Col>
            </Row>
            
            <Row className='filas'>
              <Col className='columnas'>
                <Form.Label className="titulosForm">TÍTULO DE LA VOTACIÓN</Form.Label>
                  <Form.Control className="textosForm"
                      type="text"
                      placeholder="Ingrese el título de la votación"
                      value={tituloVotacion}
                      onChange={(e) => setTituloVotacion(e.target.value)}
                  />
              </Col>

              <Col className='columnas'>
                <Form.Label className="titulosForm">CANTIDAD DE PREGUNTAS DE LA VOTACIÓN</Form.Label>
                  <Form.Control className="textosForm"
                      id="cantPreg"
                      type="text"
                      placeholder="Ingrese la cantidad de preguntas que tendra la votación"
                      value={cantidadPreg}
                      onChange={(e) => setCantidadPreg(e.target.value)}
                  />
              </Col>

              <Col className='columnas'>
                <Form.Label className="titulosForm">CANTIDAD DE RESPUESTAS POR PREGUNTA DE LA VOTACIÓN</Form.Label>
                  <Form.Control className="textosForm"
                      type="text"
                      placeholder="Ingrese la cantidad de respuestas por pregunta que tendra la votación"
                      value={cantidadResp}
                      onChange={(e) => setCantidadResp(e.target.value)}
                  />  
              </Col>
            </Row>
            <div id='contenedorBotones'>
              <Button  className='boton' onClick={volverHome}>Cancelar</Button>
              <Button className='boton' onClick={continuarVotacion}>Continuar</Button>

            </div>
                
          </div>
          
          {
            datosVotacion === true  ? 
            <div id='contenedorVotacion'>
              {/* hola
              {preguntas.map(e => <h1>{e.id}</h1>)} */}
              
                {preguntas.map((element) => (
                  <div id='contenedorForm'>
                  <Form id='form'>
                    <Row className='filas'>
                      <Col sm md lg ={11} className='columnas'>
                        <h1>{element.id}</h1>
                        
                        <Form.Control id='inputPreg' value = {element.tituloPregunta} type="text" placeholder="Ingresa el titulo de la pregunta" onChange={(e) =>{
                          let nuevoTituloPreg = e.target.value;
                          updateTitulos(element.id, nuevoTituloPreg)
                          
                        }}/> 
                        
                        
                      </Col>

                      <Col>
                        <AiFillCloseCircle id='iconoCerrar' onClick={() => eliminarPregunta(element.id)}/>
                      </Col>
                      
                    </Row>
                    
                    <div id="contenedorRespuestas">
                      {element.respuestas.map((elem) =>(
                        
                        <Row className='filas2'>
                          <Col sm md lg ={11} className='columnas'>
                            <Form.Control id='inputResp' value={elem.tituloRespuesta} type="text" placeholder="Ingrese una respuesta" onChange={(e) =>{
                              let nuevoTituloResp = e.target.value;
                              updateTitulosResp(elem.idRespuesta, elem.idPregunta, nuevoTituloResp);
                            }}/>
                          </Col>
                          <Col>
                            <AiFillCloseCircle id='iconoCerrar' onClick={() => eliminarRespuesta(elem.idRespuesta, elem.idPregunta)}/>
                          </Col>
                        </Row>
                        
                        ))}
                    </div>

                    <Button variant="primary" onClick={() => agregarRespuesta(element.id)}>
                      Agregar Respuesta
                    </Button>

                    <Button variant="primary" onClick={() => agregarPregunta(element.id)}>
                      Agregar Pregunta
                    </Button>
                    
                </Form>
                  <Button variant="primary" onClick={() => crearVotacion(element.id)}>
                    Finalizar Votacion
                  </Button>
                
            </div>
                ))}
              
              
          </div>
            :
            <div id='contenedorVotacion'>
              no
            </div>
          } 
          {/* <div id='contenedorVotacion'>
            <div id='contenedorForm'>
              
              
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  
                  <Form.Control type="text" placeholder="Ingresa el titulo de la votación" onChange={(e) =>{
                    setTituloVotacion(e.target.value);
                  }}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  
                  <Form.Control type="text" placeholder="Ingresa el titulo de la pregunta" onChange={(e) =>{
                    let nuevaPregunta = e.target.value;
                    setPreguntaVotacion([...preguntaVotacion, nuevaPregunta]);
                  }}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  
                  <Form.Control type="text" placeholder="Ingresa la cantidad de respuestas que desea para esta pregunta" onChange={(e) =>{
                    let cantidadRespuestas = e.target.value;
                    setCantidadDeRespuestas([...cantidadDeRespuestas, cantidadRespuestas]);
                  }}/>
                </Form.Group>
                
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
              
            </div>
          </div> */}
        </div>
          
      </div>
  )
}

export default CrearVotaciones