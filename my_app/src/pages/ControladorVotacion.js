import React from 'react'
import { Row, Col, Button } from 'react-bootstrap';
import MyNavbar from '../componts/MyNavbar';

import '../styles/ControladorVotacion.css'


const ControladorVotacion = () => {
    const volverHome = () =>{
        window.location.replace('/misVotaciones')
    }
    return (
        <div id='contenedorPadre'>
            <MyNavbar activeKey='/crearVotacion'/>
            <div id='contenedorSecundarioControlador'> 
                <Row>
                    <Col>
                    <h1 id='tituloControladorVotacion'>Seleccione el tipo de votación electrónica a crear </h1>
                    </Col>
                </Row>
                <div id='cuerpoControladorVotacion'>
                    <Row id='primeraFilaControladorVotacion'>
                        <Col className='primeraColumnaCuerpoControladorVotacion'>
                            <h2 className='titulosControladorVotacion'>Nombre Votación</h2>
                        </Col>
                        <Col className='segundaColumnaCuerpoControladorVotacion'>
                            <h2 className='titulosControladorVotacion'>Descripción</h2>
                        </Col>
                        <Col className='terceraColumnaCuerpoControladorVotacion'>
                            <h2 className='titulosControladorVotacion'>Modo de uso</h2>
                        </Col>
                    </Row>
                    <Row className='filasComunesControladorVotacion'>
                        <Col className='primeraColumnaCuerpoControladorVotacion'>
                            <Button className='titulosCuerpoControladorVotacion' onClick={() => window.location.replace(`/crearVotacion/${'null'}/${'null'}`)}>Votación normal</Button>
                        </Col>
                        <Col className='segundaColumnaCuerpoControladorVotacion'> 
                            <p className='parrafosDescritivosControladorVot'>
                                <strong>Votación normal</strong> permite a los usuarios personalizar la cantidad de preguntas y respuestas.
                                Esto agiliza la configuración al generar una plantilla vacía que se puede modificar y completar
                                según las necesidades. Además, brinda la opción de incluir una lista de participantes para aumentar
                                la seguridad del proceso de votación.
                            </p>
                        </Col>
                        <Col className='terceraColumnaCuerpoControladorVotacion'>
                            <p className='parrafosDescritivosControladorVot'>
                                <strong>Paso 1:</strong> Indicar la cantidad de preguntas y la cantidad de respuestas por pregunta, completar
                                la plantilla generada y crear la votación.
                                <strong> Paso 2:</strong> Empezar la votación.
                                <strong> Paso 3:</strong> Compartir la votación.
                                <strong> Paso 4:</strong> Luego de que todos hayan votado, finalizar la votación.
                                <strong> Paso 5:</strong> Visualizar los resultados obtenidos.
                            </p>
                        </Col>
                    </Row>
                    <Row className='filasComunesControladorVotacion'>
                        <Col className='primeraColumnaCuerpoControladorVotacion'>
                            <Button className='titulosCuerpoControladorVotacion' onClick={() => window.location.replace(`/crearVotacionUnGanador/${'null'}/${'null'}`)}>Votación selección única</Button>
                        </Col>
                        <Col className='segundaColumnaCuerpoControladorVotacion'>
                            <p className='parrafosDescritivosControladorVot'>
                                <strong>Votación de selección única</strong> implica elegir una respuesta ganadora entre varias opciones.
                                Un aspecto destacado es el uso de un porcentaje para determinar la validez de la respuesta más votada.
                                Si no se cumple el porcentaje requerido, se genera una nueva ronda hasta que se alcance. 
                                Esta votación también permite incluir una lista de usuarios participantes para garantizar la seguridad
                                del proceso de votación.
                            </p>
                        </Col>
                        <Col className='terceraColumnaCuerpoControladorVotacion'>
                            <p className='parrafosDescritivosControladorVot'>
                                <strong>Paso 1:</strong> Crea la votación y selecciona si requiere una lista de participantes.
                                <strong> Paso 2:</strong> Compartir la votación.
                                <strong> Paso 3:</strong> Esperar que los usuarios ingresen opciones de respuesta a la pregunta de la votación.
                                <strong> Paso 4:</strong> Empezar la votación.
                                <strong> Paso 5:</strong> Esperar que los usuarios voten y finalizar la votación.
                                <strong> Paso 6:</strong> Visualizar los resultados obtenidos.
                            </p>
                        </Col>
                    </Row>
                    <Row className='filasComunesControladorVotacion'>
                        <Col className='primeraColumnaCuerpoControladorVotacion'>  
                            <Button className='titulosCuerpoControladorVotacion' onClick={() => window.location.replace(`/crearVotacionDirectorio/${'null'}/${'null'}`)}>Votación estrategica</Button>
                        </Col>
                        <Col className='segundaColumnaCuerpoControladorVotacion'>
                            <p className='parrafosDescritivosControladorVot'>
                                <strong>Votación estratégica</strong> tiene como objetivo visualizar los resultados de manera clara y
                                eficiente en diversos temas. Utiliza una tabla ordenada para mostrar los votos de mayor a menor,
                                permitiendo a los usuarios tomar decisiones informadas. Además, votación también permite incluir una lista de usuarios
                                participantes para garantizar la seguridad del proceso de votación.
                            </p>
                        </Col>
                        <Col className='terceraColumnaCuerpoControladorVotacion'>
                            <p className='parrafosDescritivosControladorVot'>
                                <strong>Paso 1:</strong> Crea la votación y selecciona si requiere una lista de participantes.
                                <strong> Paso 2:</strong> Compartir la votación.
                                <strong> Paso 3:</strong> Esperar que los usuarios participante ingresen opciones de respuesta a la pregunta de la votación.
                                <strong> Paso 4:</strong> Empezar la votación.
                                <strong> Paso 5:</strong> Esperar que los usuarios voten y finalizar la votación.
                                <strong> Paso 6:</strong> Visualizar los resultados obtenidos.
                            </p>
                        </Col>
                    </Row>  
                </div>
                
                <Row id='filaBotonControladorVot'>
                    <Col id='columnaBotonControladorVot'>
                        <Button id='botonVolverControladorVot' onClick={volverHome}>Volver</Button>
                    </Col>
                </Row>
            </div>
        </div>
        
      );
}

export default ControladorVotacion