import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';

//import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Swal from 'sweetalert2';


import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import '../styles/Votar.css'

const serverUrl = process.env.REACT_APP_SERVER;




const Votar = () => {
    const {id} = useParams();
    //console.log(id)
    
    const [votacion, setVotacion] = useState('');
    const [preguntas, setPreguntas] = useState([]);
    const [respuestas, setRespuestas] = useState([]);

    const [prueba, setPrueba] = useState([]);

    var kk = [];

    //console.log(votacion)

    useEffect(() => {
        console.log('useEffect')
        votacionesGetById();
        /* preguntasGet();
        respuestasGet(); */
        preguntasConRespuestasGet();
    },[]);

    

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
    

    console.log(votacion)

    const preguntasGet = async () =>{
        await axios.get(serverUrl + "/preguntasGet", {params:{idVotacion: id}})
            .then(response=>{
            setPreguntas(response.data);
            //setLoading(true);
            console.log("trae esto getPreguntas:");
            console.log(response.data);
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

    const preguntasConRespuestasGet = async () =>{
        await axios.get(serverUrl + "/preguntasConRespuestas", {params:{idVotacion: id}})
            .then(response=>{
            //setPreguntas(response.data);
            kk = response.data;

            console.log("kk ")
            console.log(kk)
            const newKk = [];
            kk.map( (k) => {
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
                            respuesta: []
                        }
                        newKk.push(newK);
                    }
                }
            })

            
            console.log("newkk ")
            console.log(newKk)

            

            newKk.map ( (k) => {
                console.log(k)
                const newResp = [];
                for (let i = 0; i < kk.length; i++) {
                    if (k.idPregunta === kk[i].ID_PREGUNTA){
                        let resp = {
                                        idPreg: kk[i].ID_PREGUNTA,
                                        idResp: kk[i].ID_RESPUESTA,
                                        respuesta: kk[i].RESPUESTA,
                                        votos: kk[i].VOTOS,
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

        const respuestasGet = async () =>{
            await axios.get(serverUrl + "/respuestasGetGlobal")
                .then(response=>{
                setRespuestas(response.data);
                console.log("trae esto getResp:");
                console.log(response.data);
            })
            .catch (error=> {
                setRespuestas([]);
                Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.message,
                })/* 
                alert(error.response.data.message);
                console.log(error); */
            })
            };

       
  
    console.log(preguntas)
    console.log('respuestas')
    console.log(respuestas)
    

    

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
                                    
                                    <div>
                                        {e.respuesta.map( (r) => (
                                            <h6>{r.respuesta}</h6>
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
                
            </div>
            
            
            
        
        
        </div>
    )
        
    };

    


export default Votar


