import React, { useState} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import MyNavbar from '../componts/MyNavbar';

import '../styles/CrearVotacion.css'

import { AiFillCloseCircle } from "react-icons/ai";






const CrearVotaciones = (props) => {
  

  const [tituloVotacion, setTituloVotacion] = useState('');
  const [preguntaVotacion, setPreguntaVotacion] = useState([]);
  const [cantidadDeRespuestas, setCantidadDeRespuestas] = useState([]);

  
  const [cantidadPreg, setCantidadPreg] = useState(0);
  const [cantidadResp, setCantidadResp] = useState(0);

  const [respuestas, setRespuestas] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  var preguntasDemo = [];
  var respuestasDemo = [];
  var idPregunta = 0;
  var idRespuesta = 0;

  const [idResp, setIdResp] = useState(0)

  var prueba = ['a', 'b'];

  const [kk, setKk] = useState(['uno', 'dos', 'tres']);

  const [datosVotacion, setDatosVotacion] = useState(false);


  const volverHome = () =>{
    window.location.replace('/paginaPrincipal')
  }

  const continuarVotacion = () =>{
    setDatosVotacion(false);
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
            id: idPregunta,
            tituloPregunta: '',
            respuestas : [],
          })
          for (let j = 0; j < cantidadResp; j++){
            respuestasDemo.push({
              idPregunta: idPregunta,
              idRespuesta: idRespuesta,
              tituloRespuesta: '',
            })
            idRespuesta ++;
          }
        //console.log('id de pregunta: ' + idPregunta);
        
        idPregunta ++;
      }
      setIdResp(idRespuesta)

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

      setDatosVotacion(true);
      setPreguntas(preguntasDemo);
      setRespuestas(respuestasDemo);/* 
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

  const eliminarPregunta = (idPreg) => {
    setDatosVotacion(false);
    console.log("id preg: " );
    console.log(idPreg)

    console.log('cantidad de preg antes: ')
    console.log(cantidadPreg);

    const newPreguntas = preguntas.filter((preg) => preg.id !== idPreg);
    setPreguntas(newPreguntas);

    setCantidadPreg(cantidadPreg - 1);

    document.getElementById('cantPreg').value = cantidadPreg;

    console.log('cantidad de preg desp: ')
    console.log(cantidadPreg);

    setDatosVotacion(true);

  }

  const eliminarRespuesta = (idResp, resp, idPreg) => {
    setDatosVotacion(false);

    console.log("id Resp: " );
    console.log(idResp)
    console.log("resp: " );
    console.log(resp)

    console.log("Respuestas : " );
    console.log(respuestas)


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
    console.log(respuestas)
    console.log(idResp)
    console.log(idPregunta)

    const newResp = {
      idPregunta: idPregunta,
      idRespuesta: idResp,
      tituloRespuesta: '',
    }

    setRespuestas([...respuestas, newResp])

    console.log('resp')
    console.log(respuestas)
      
    setIdResp(idResp + 1)

      const newRespuestas = respuestas.filter((respu) => (respu.idPregunta === idPregunta));
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

    setPreguntas(newPreguntas)
    setDatosVotacion(true);

  }

  console.log('preg')
  console.log(preguntas)
  console.log('resp')
  console.log(respuestas)

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
                      
                      onChange={(e) => setCantidadResp(e.target.value)}
                  />  
              </Col>
            </Row>
            <div id='contenedorBotones'>
              <Button className='boton' onClick={volverHome}>Cancelar</Button>
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
                        <Form.Control id='inputPreg' type="text" placeholder="Ingresa el titulo de la pregunta" onChange={(e) =>{
                          let nuevaPregunta = e.target.value;
                          setPreguntaVotacion([...preguntaVotacion, nuevaPregunta]);
                        }}/> 
                      </Col>

                      <Col>
                        <AiFillCloseCircle id='iconoCerrar' onClick={() => eliminarPregunta(element.id)}/>
                      </Col>
                      
                    </Row>
                    
                    
                    {element.respuestas.map((e) =>(
                      <Row className='filas2'>
                        <Col sm md lg ={11} className='columnas'>
                          <Form.Control id='inputResp' type="text" placeholder="Ingrese una respuesta" onChange={(e) =>{
                            let cantidadRespuestas = e.target.value;
                            setCantidadDeRespuestas([...cantidadDeRespuestas, cantidadRespuestas]);
                          }}/>
                        </Col>
                        <Col>
                          <AiFillCloseCircle id='iconoCerrar' onClick={() => eliminarRespuesta(e.idRespuesta, e, e.idPregunta)}/>
                        </Col>
                      </Row>
                      
                    ))}

                    <Button variant="primary" onClick={() => agregarRespuesta(element.id)}>
                      Agregar Respuesta
                    </Button>

                    <Button variant="primary" type="submit" onClick={agregarRespuesta}>
                      x
                    </Button>
                </Form>
                
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