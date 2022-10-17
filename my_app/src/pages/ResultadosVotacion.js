import React, {useEffect, useState} from 'react'

import { useParams } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Pie from '../componts/Grafico'

import '../styles/ResultadosVotacion.css'
import axios from 'axios';
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';

import ModalVisualizarResult from '../componts/ModalVisualizarResult';

const serverUrl = process.env.REACT_APP_SERVER;

const ResultadosVotacion = () => {
  
  const {estado} = useParams();
  const {idVotacion} = useParams();

  const [data, setData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [tituloModal, setTituloModal] = useState('');
  const [dataModal, setDataModal] = useState([]);

  const [tipoVotacion, setTipoVotacion] = useState('');

  useEffect(() => {
    if( estado === '0'  && data.length === 0){
        preguntasConRespuestasGet();
        votacionesGetById();
    }

    /* else if(estadoVotacion === '2' && respuestas.length === 0){
        respuestasGet();
    } */
});



  console.log(idVotacion)
  console.log(tipoVotacion);

  const votacionesGetById = async () =>{
    //console.log('hola')
    await axios.get(serverUrl + "/votacionById", {params:{idVotacion: idVotacion}})
        .then(response=>{
            setTipoVotacion(response.data[0].tipo);
        //setLoading(true);
        console.log("trae esto getVotaciones ojo:");
        console.log(response.data[0].tipo);
    })
    .catch (error=> {
        setTipoVotacion('');
        Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
        })
    })
};

  const preguntasConRespuestasGet = async () =>{
    await axios.get(serverUrl + "/preguntasConRespuestas", {params:{idVotacion: idVotacion}})
        .then(response=>{
        var kk = response.data;
        const newKk = [];
        kk.forEach( (k) => {
            if (newKk.length === 0) {
                let newK = {
                    idPregunta: k.ID_PREGUNTA,
                    tituloPreg: k.TITULO,
                }
                newKk.push(newK);
            }
            else{
                let estaLaPreg = 0;
                for (let i = 0; i < newKk.length; i++) {
                    if (newKk[i].idPregunta === k.ID_PREGUNTA){
                        estaLaPreg++;
                    }
                }
                if (estaLaPreg === 0) {
                    
                    let newK = {
                        idPregunta: k.ID_PREGUNTA,
                        tituloPreg: k.TITULO,
                        respuesta: [],
                    }
                    newKk.push(newK);
                }
            }
        })

        

        newKk.forEach ( (k) => {
            const newResp = [];
            for (let i = 0; i < kk.length; i++) {
                if (k.idPregunta === kk[i].ID_PREGUNTA){
                    let resp = {
                                    idPreg: kk[i].ID_PREGUNTA,
                                    idResp: kk[i].ID_RESPUESTA,
                                    respuesta: kk[i].RESPUESTA,
                                    votos: kk[i].VOTOS,
                                    isCheck: false,
                                }
                    newResp.push(resp)
                }
            }
            for (let j = 0; j < newKk.length; j++) {
                if(newKk[j].idPregunta === newResp[0].idPreg) {
                    newKk[j].respuesta = newResp
                }   
            }

        })
        setData(newKk);
    })
    .catch (error=> {
        setData([]);
        Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
        })
    })
};



const verGanadores = () => {
    var votosAux = [];
    var ganadoresAux = [];
    data.forEach((e) =>{
        // agregar los votos para ordenarlos y elegir los 5 mas altos
        e.respuesta.forEach((r) => {
            votosAux.push(r.votos);
        }) 

        votosAux.sort((a, b) =>{
            return b - a;
        })


        let votosAux2 = votosAux.filter((item,index)=>{
            return votosAux.indexOf(item) === index;
          })

        let votos = [];
        for (let i = 0; i < 5; i++){
            votos.push(votosAux2[i]);
        }

        

        // recorremos los votos para ingresar los ganadores

        votos.forEach((v) => {
            e.respuesta.forEach((r) => {
                if(r.votos === v) {
                    if(ganadoresAux.length < 5){
                        ganadoresAux.push(r);
                    }
                    else{
                        if(ganadoresAux[ganadoresAux.length - 1] === v){
                            ganadoresAux.push(r);
                        }
                    }
                    
                }
            }) 
        })

    })
    console.log(ganadoresAux);
    setDataModal(ganadoresAux);
}

const verGanadoresEspecial = () => {
    var votosAux = [];
    var ganadoresAux = [];
    data.forEach((e) =>{
        // agregar los votos para ordenarlos y elegir los 5 mas altos
        e.respuesta.forEach((r) => {
            votosAux.push(r.votos);
        }) 

        votosAux.sort((a, b) =>{
            return b - a;
        })


        let votosAux2 = votosAux.filter((item,index)=>{
            return votosAux.indexOf(item) === index;
          })

        /* let votos = [];
        for (let i = 0; i < 5; i++){
            votos.push(votosAux2[i]);
        } */

        

        // recorremos los votos para ingresar los ganadores

        votosAux2.forEach((v) => {
            e.respuesta.forEach((r) => {
                if(r.votos === v) {
                    if(ganadoresAux.length < 1){
                        ganadoresAux.push(r);
                    }
                    else{
                        if(ganadoresAux[ganadoresAux.length - 1] === v){
                            ganadoresAux.push(r);
                        }
                    }
                    
                }
            }) 
        })

    })
    console.log(ganadoresAux);
    setDataModal(ganadoresAux);
}

const mostrarModalVisualizarResultado = () => {
    
    setTituloModal(data[0].tituloPreg); 

    verGanadores()


    setModalShow(true);
}

const mostrarModalVisualizarResultadoTipoEspecial = () => {
    
    setTituloModal(data[0].tituloPreg); 

    verGanadoresEspecial()


    setModalShow(true);
}

  console.log(data)


  return (
    <div id='contenedorResultVotacion'>
      { estado === '1' ?

        <Container fluid id='contenedorEsperarCerrarVotacion'>
          <h1 id='mensajeTituloEsperarCerrar'>Felicidades su votación se ha realizado con éxito!</h1>
          <h3 id='mensajeSecundarioEsperarCerrar'>Para visualizar los resultados debe esperar a que el propietario finalice la votación</h3>
        </Container>:
        <>
            {tipoVotacion === 'especial' ?
                <>
                    <div id='contenedorResultadosVotacion'>
                        {data.map( (e) => (
                        
                        <div id='contenedorResulVotElement'>
                            <h3 key={e.idPregunta} id='tituloPregResultVot'>{e.tituloPreg}</h3>
                            <div id='contenedorPieResultVot'>
                                <Pie   
                                    width = {900}
                                    height = {600}
                                    respuestas = {e.respuesta}
                                />
                            </div>
                                
                        </div>
                        ))}
                        <div id='contenedorBotonDirectorio'>
                            <Button id='BotonVerDirectorio' onClick={() => mostrarModalVisualizarResultadoTipoEspecial()}>
                                Ver resultados
                            </Button>
                        </div> 
                    </div>
                </>:
                    <>
                        {tipoVotacion === 'directorio'?
                            <div id='contenedorResultadosVotacion'>
                                {data.map( (e) => (
                                
                                <div id='contenedorResulVotElement'>
                                    <h3 key={e.idPregunta} id='tituloPregResultVot'>{e.tituloPreg}</h3>
                                    <div id='contenedorPieResultVot'>
                                        <Pie   
                                            width = {900}
                                            height = {600}
                                            respuestas = {e.respuesta}
                                        />
                                    </div>
                                        
                                </div>
                                ))}
                                <div id='contenedorBotonDirectorio'>
                                    <Button id='BotonVerDirectorio' onClick={() => mostrarModalVisualizarResultado()}>
                                        Ver al directorio
                                    </Button>
                                </div> 
                            </div>:
                            <div id='contenedorResultadosVotacion'>
                                {data.map( (e) => (
                                
                                <div id='contenedorResulVotElement'>
                                    <h3 key={e.idPregunta} id='tituloPregResultVot'>{e.tituloPreg}</h3>
                                    <div id='contenedorPieResultVot'>
                                        <Pie   
                                            width = {900}
                                            height = {600}
                                            respuestas = {e.respuesta}
                                        />
                                    </div>
                                        
                                </div>
                                ))}
                            </div>
                        }
                    </>
            }
        </>
        
        
      }
        <ModalVisualizarResult 
            show={modalShow}
            onHide={() => setModalShow(false)}
            titulo = {tituloModal}
            data = {dataModal}
        /> 
    </div>
    
  )
}

export default ResultadosVotacion