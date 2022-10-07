import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';

import Form from 'react-bootstrap/Form';

import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Swal from 'sweetalert2';


import Row from 'react-bootstrap/Row';

import '../styles/Votar.css'

const serverUrl = process.env.REACT_APP_SERVER;




const Votar = () => {
    const {id} = useParams();
    const {estadoVotacion} = useParams();
    //console.log(estadoVotacion)
    
    const [votacion, setVotacion] = useState('');
    const [preguntas, setPreguntas] = useState([]);


    //console.log(votacion)

    useEffect(() => {
        const votacionesGetById = async () =>{
            //console.log('hola')
            await axios.get(serverUrl + "/votacionById", {params:{idVotacion: id}})
                .then(response=>{
                    setVotacion(response.data[0].TITULO);
                //setLoading(true);
                console.log("trae esto getVotaciones ojo:");
                console.log(response.data[0].TITULO);
            })
            .catch (error=> {
                setVotacion([]);
                Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.message,
                })
            })
        };
        const preguntasConRespuestasGet = async () =>{
            await axios.get(serverUrl + "/preguntasConRespuestas", {params:{idVotacion: id}})
                .then(response=>{
                //setPreguntas(response.data);
                var kk = response.data;
    
                console.log("kk ")
                console.log(kk)
                const newKk = [];
                kk.forEach( (k) => {
                    console.log(k)
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
    
                
                console.log("newkk ")
                console.log(newKk)
    
                
    
                newKk.forEach ( (k) => {
                    console.log(k)
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
                            console.log('newResp')
                            console.log(newResp)
                        }
                    }
                    console.log(newKk.length)
                    for (let j = 0; j < newKk.length; j++) {
                        console.log(newKk[j].idPregunta +' === '+ newResp[0].idPreg )
                        if(newKk[j].idPregunta === newResp[0].idPreg) {
                            newKk[j].respuesta = newResp
                            console.log("newkk2 ")
                            console.log(newKk)
                        }   
                    }
                    
                    
                    console.log("newkk3 ")
                    console.log(newKk)
    
                })
    
                
    
    
                //setLoading(true);
                setPreguntas(newKk);
            })
            .catch (error=> {
                setPreguntas([]);
                Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.message,
                })/* 
                alert(error.response.data.message);
                console.log(error); */
            })
        };
        votacionesGetById();
        preguntasConRespuestasGet();
    },[]);

    

    

    

    


    const setIsCheck = (idPreg, idResp) => {

        // setiamos todas las respuestas a false
        for (let i = 0; i <preguntas.length; i++) {
            if(preguntas[i].idPregunta === idPreg){
                for (let j = 0; j < preguntas[i].respuesta.length; j++) {
                    if(preguntas[i].respuesta[j].isCheck === true){
                        preguntas[i].respuesta[j].isCheck = false;
                    }
                }
            }
        }


        //setiamos la respuesta correcta a true

        for (let i = 0; i <preguntas.length; i++) {
            if(preguntas[i].idPregunta === idPreg){
                for (let j = 0; j < preguntas[i].respuesta.length; j++) {
                    if(preguntas[i].respuesta[j].idResp === idResp){
                        preguntas[i].respuesta[j].isCheck = true;
                    }
                }
            }
        }
        console.log('preguntas')
        console.log(preguntas)
    }

    const finalizarVotacion = () => {

        // validar que los parametros estan bien
        var parametrosOk = 0;
        //console.log(preguntas)

        //console.log(preguntas.length)
        for (let i = 0; i <preguntas.length; i++) {
            //console.log(preguntas[i].respuesta.length)
            for (let j = 0; j < preguntas[i].respuesta.length; j++) {
                if(preguntas[i].respuesta[j].isCheck === true){
                    //console.log('IMPORTANTE')
                    //console.log(preguntas[i].respuesta[j].isCheck);
                    parametrosOk++;
                }
                
            }
        }

        console.log(parametrosOk, preguntas.length)
        if(parametrosOk === preguntas.length){

            // setiar los votos de las preguntas
            for(let i = 0; i < preguntas.length; i++) {
                for(let j = 0; j < preguntas[i].respuesta.length; j++) {
                    if(preguntas[i].respuesta[j].isCheck === true){
                        setVoto(preguntas[i].idPregunta, preguntas[i].respuesta[j].idResp, preguntas[i].respuesta[j].votos + 1)
                    }
                    
                }
            }

            alert("su votacion fue realizada con exito")
            window.location.replace(`/resultadosVotacion/${estadoVotacion}`)
        }

        else{
            alert("Debe asegurarse que todas las preguntas tienen asociado su respectivo voto")
        }
    }

    

    const setVoto = async (idPregu, idRespu, CantVotos) =>{
    
        console.log(idPregu, idRespu, CantVotos);
    
        await axios({
          method: 'put',
          url:serverUrl + "/votoUpdate", 
          headers: {'Content-Type': 'application/json'},
          params:
          {
            idPregunta: idPregu,
            idRespuesta: idRespu,
            voto: CantVotos,
          }
        }).then(response=>{
          console.log("Funciona update voto");
        })
        .catch(error=>{
                alert(error.response.data.message);
                console.log(error);
              })
      };

    
    

    

    return (
        <div id='contenedorPadreVotar'>
            <div id='contenedorSecundarioVotar'>
                {votacion !== '' ? 
                <>
                    <Row className='filasVotar' id='filaTituloVotar'>
                        <h1 id='tituloVotar'>{votacion}</h1>
                    </Row>

                    <Row className='filasVotar' id='filaCuerpoVotar'>
                        
                        {preguntas.length > 0 ?
                            
                            preguntas.map((e) => (
                                <div id='contenedorVotacionVotar'>
                                    <h1 id='tituloPregVotacion'>{e.tituloPreg}</h1>
                                    
                                    <div id='contenedorRespVotar'>
                                        {e.respuesta.map( (r) => (
                                            <div id='contenedorCheck'>
                                                <Form.Check 
                                                    type={'radio'}
                                                    name= {`grupo${r.idPreg}`}
                                                    label={r.respuesta}
                                                    onChange={() => setIsCheck(r.idPreg, r.idResp)}
                                                />
                                            </div>
                                           
                                            /* <h6>{r.respuesta}</h6> */
                                        ))}
                                    </div>
                                </div>
                                
                            ))
                            
                        : <div>chao</div>
                        }
                    </Row>
                </>

                :<div>cargando...</div>
                }
                <div id='contenedorFinalizarVotacion'>

                    <Button id='finalizarVotacion' onClick={() => finalizarVotacion()}>Finalizar Votación</Button>
                </div>
                
            </div>
            
            
            
        
        
        </div>
    )
        
    };

    


export default Votar


