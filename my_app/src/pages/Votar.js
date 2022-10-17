import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';

import Spinner from 'react-bootstrap/Spinner';

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
    const {idPreg} = useParams();
    //console.log(estadoVotacion)
    
    const [votacion, setVotacion] = useState('');
    const [preguntas, setPreguntas] = useState([]);


    const [nombreVotante, setNombreVotante] = useState('');
    const [respuestas, setRespuestas] = useState([]);

    const [isRegister, setIsRegister] = useState(false);



    


    //console.log(votacion)

    useEffect(() => {
        
        votacionesGetById();
        if( (estadoVotacion === '1' || estadoVotacion === '0') && preguntas.length === 0){
            preguntasConRespuestasGet();
        }

        else if(estadoVotacion === '2' && respuestas.length === 0){
            respuestasGet();
        }
    });

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

    const respuestasGet = async () =>{
        await axios.get(serverUrl + "/respuestasGet", {params:{idPregunta: idPreg}})
            .then(response=>{
            setRespuestas(response.data);
            console.log("trae esto getResp:");
            console.log(response.data);
        })
        .catch (error=> {
            setRespuestas([1]);
            
        })
    };

    

    

    


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
            window.location.replace(`/resultadosVotacion/${estadoVotacion}/${id}`)
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

    const ingresarUsuario = () => {
        alert('ingresar usuario');
        console.log(nombreVotante);
        console.log(typeof(nombreVotante));
        if(nombreVotante === undefined || nombreVotante === '') {
            alert('Debe asegurarse de ingresar su nombre');
        }
        else{

            // vamos a verificar si el usuario ya esta registrado 

            let nombreAux = nombreVotante.toUpperCase();

            let disponible = 0;

            console.log('respuestas');
            console.log(respuestas);

            if(respuestas.length > 1) {
                console.log(nombreAux); 
                respuestas.forEach( (resp) => {
                    console.log(resp.respuesta.toUpperCase() + '===' + nombreAux);
                    if(resp.respuesta.toUpperCase() === nombreAux){
                        disponible++;
                    }
                })
            }

            /* console.log(nombreAux); 
            respuestas.forEach( (resp) => {
                console.log(resp.respuesta.toUpperCase() + '===' + nombreAux);
                if(resp.respuesta.toUpperCase() === nombreAux){
                    disponible++;
                }
            }) */

            // quiere decir que el nombre esta disponible
            if(disponible === 0){
                createResp(idPreg, nombreVotante);
                //necesito un swal alert que diga que el mensaje de exito y se recarge la pagina
                Swal.fire(
                    'Usuario registrado',
                    'Su nombre ha sido ingresado con éxito',
                    'success'
                )

                setIsRegister(true) 
                /* setTimeout(function () {   
                    window.location.reload(true); 
                }, 2000); */
            }

            // el usuario ya esta ingresado
            else{
                Swal.fire({
                    icon: 'error',
                    title: 'Usuario ya ingresado',
                    text: 'El usuario ya fue registrado',
                  })
            }
            

            
        }

    }

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

    const visualizarResultEstado0 = () => {
        alert('visualizarResultEstado0');
        
        window.location.replace(`/resultadosVotacion/${estadoVotacion}/${id}`)
    }
    



    console.log(estadoVotacion)
    console.log(isRegister)
    

    

    return (
        <div id='contenedorPadreVotar'>
            <div id='contenedorSecundarioVotar'>
                {votacion !== '' && estadoVotacion === '1'? 
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
                            
                            : <>ERROR NO CARGA LA DATA</>
                        }
                    </Row>
                    <div id='contenedorFinalizarVotacion'>

                        <Button id='finalizarVotacion' onClick={() => finalizarVotacion()}>Finalizar Votación</Button>
                    </div>
                </>

                : <>{estadoVotacion === '2'?

                    <>
                        {isRegister === false ?
                            <div id='contenedorIngresarElNombreVotante'>
                                <Row className='filasEstado2' id='filaTituloVOtarEstado2'>
                                    <h1 id='tituloEstado2'>
                                        Ingrese su nombre para continuar con el proceso de votación por favor!
                                    </h1>
                                </Row>
                                <Row className='filasEstado2' id='filaFormularioEstado2'>
                                    <Form.Control id="formularioEstado2"
                                        type="text"
                                        placeholder="Ingrese su nombre por favor!"
                                        value={nombreVotante}
                                        onChange={(e) => setNombreVotante(e.target.value)}
                                    /> 
                                </Row>
                                <Row className='filasEstado2' id='filaBotonEstado2'>
                                    <div id='contenedorBotonesEstado2'>
                                        <Button className='botonEstado2' onClick={() => ingresarUsuario()}>Continuar votación</Button>
                                    </div>
                                </Row>
                            
                            </div>:
                    
                            <div id='contenedorEsperandoVotacionEstado2'>
                                <Row className='filasEstado2' id='filaTextoEsperar'>
                                    <h3 id='tituloEsperarVotacion'>
                                        Espere un momento mientras el anfitrión da inicio a la votación
                                    </h3>
                                </Row>
                                <Row className='filasEstado2' id='filaCargando'>
                                    <Spinner animation="border" variant="secondary" id='spinnerCargando'/>
                                </Row>
                                
                            </div>
                        }

                    </>:
                    <div id='contenedorEstado0'> 
                        <h1 id='tituloEstado0'>La votación ha finalizado</h1> 
                        <h3 id='mensajeEstado0'>Para visualizar los resultados haga click en visualizar resultados</h3> 
                        <div id='contenedorBoton0'>
                            <Button onClick={() => visualizarResultEstado0()} id='botonEstado0'>Visualizar resultados</Button>
                        </div>
                    </div>

                    /* <></>  */
                }

                    
                </>
                
                }
                
            </div>
            
            
            
        
        
        </div>
    )
        
    };

    


export default Votar


