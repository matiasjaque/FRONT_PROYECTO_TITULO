import React, { useState} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import MyNavbar from '../componts/MyNavbar';

import '../styles/CrearVotacion.css'




const CrearVotaciones = (props) => {

  const [tituloVotacion, setTituloVotacion] = useState('');
  const [preguntaVotacion, setPreguntaVotacion] = useState([]);
  const [cantidadDeRespuestas, setCantidadDeRespuestas] = useState([]);

  
  const [cantidadPreg, setCantidadPreg] = useState(0);
  const [cantidadResp, setCantidadResp] = useState(0);

  const [respuestas, setRespuestas] = useState([]);
  const [preguntas, setPreguntas] = useState([]);

  const [kk, setKk] = useState(['uno', 'dos', 'tres']);

  const [datosVotacion, setDatosVotacion] = useState(false);
  console.log(preguntas)

  const volverHome = () =>{
    window.location.replace('/paginaPrincipal')
  }

  const continuarVotacion = () =>{
    setPreguntas()
    setDatosVotacion(false);
    if(tituloVotacion !== null && cantidadPreg > 0  && cantidadResp > 0){
      console.log('cantidadPreg ' + cantidadPreg); 
      console.log('preguntas length ' + preguntas.length);
      //var cantPreg = preguntas.length;
      
      for(let i = 0; i < cantidadPreg; i++){
        //preguntas.push(i+1);
        console.log('hola')
        setPreguntas([...preguntas, (i+1)])
        console.log('chao')
      }
      setDatosVotacion(true);
      /* if(preguntas.length === 0){
        for(let i = 0; i < cantidadPreg; i++){
          preguntas.push(i+1);
        }
        setDatosVotacion(true);
      } */
      /* else{
        for(let i = 0; i < cantPreg; i++){
          preguntas.pop();
          console.log('preguntas length del for ' + preguntas.length);

        }
        for(let i = 0; i < cantidadPreg; i++){
          preguntas.push(i+1);
          console.log('for del else ' + preguntas.length);
        }
      } */
      
    }
    else{
        alert("todos los parametros son obligatorios");
    }
  }

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
                      type="text"
                      placeholder="Ingrese la cantidad de preguntas que tendra la votación"
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
            datosVotacion? 
            <div id='contenedorVotacion'>
                {preguntas.map(() => (
                  <div id='contenedorForm'>
                  <Form>
                      <Form.Control type="text" placeholder="Ingresa el titulo de la votación" onChange={(e) =>{
                        setTituloVotacion(e.target.value);
                      }}/>


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