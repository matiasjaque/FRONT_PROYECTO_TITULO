import React from 'react'

import { useParams } from 'react-router-dom';

import Container from 'react-bootstrap/Container';

import '../styles/ResultadosVotacion.css'

const ResultadosVotacion = () => {
  
  const {estado} = useParams();

  return (
    <div id='contenedorResultVotacion'>
      { estado === '1' ?

        <Container fluid id='contenedorEsperarCerrarVotacion'>
          <h1 id='mensajeTituloEsperarCerrar'>Felicidades su votación se ha realizado con éxito!</h1>
          <h3 id='mensajeSecundarioEsperarCerrar'>Para visualizar los resultados debe esperar a que el propietario finalice la votación</h3>
        </Container>:
        
        <div>mostrar resultados obtenidos</div>
      }
    </div>
    
  )
}

export default ResultadosVotacion