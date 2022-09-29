import React, { useEffect, useState} from 'react'



import ModalCompartir from '../componts/ModalCompartir';
import ModalResultados from '../componts/ModalResultados';

import MyNavbar from '../componts/MyNavbar';

import Table from 'react-bootstrap/Table';



import '../styles/MisVotaciones.css';

import axios from 'axios';
import Cookies from 'universal-cookie';
import Swal from 'sweetalert2';


import { MdAutorenew, MdDeleteForever, MdShare, MdPieChart } from "react-icons/md";


const serverUrl = process.env.REACT_APP_SERVER;
const conectado = new Cookies();


var idUsuario = conectado.get('id'); 

console.log(conectado);


const MisVotaciones = () => {

    const [misVotaciones, setMisVotaciones] = useState([]);

    const [preguntas, setPreguntas] = useState([]);

    const [respuestas, setRespuestas] = useState([]);

    const [modalShow, setModalShow] = useState(false);
    const [modalResultShow, setModalResultShow] = useState(false);

    const [enlace, setEnlace] = useState('');

    const [tituloVotacionResult, setTituloVotacionResult] = useState('');
    const [pregYresp, serPregYresp] = useState([]);



    useEffect(() => {
        votacionesGet();
        respuestasGet();
        preguntasGet();
      },[]);

    const votacionesGet = async () =>{
    await axios.get(serverUrl + "/votaciones", {params:{idUsuario: idUsuario}})
        .then(response=>{
        setMisVotaciones(response.data);
        //setLoading(true);
        console.log("trae esto getVotaciones:");
        console.log(response.data);
    })
    .catch (error=> {
        setMisVotaciones([]);
        Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
        })/* 
        alert(error.response.data.message);
        console.log(error); */
    })
    };

    const preguntasGet = async () =>{
        await axios.get(serverUrl + "/preguntasGetGlobal")
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


    const eliminarVotacion = (idVotacion) => {

        // eliminar votacion
        console.log('idVotacion');
        console.log(idVotacion)

        //eliminar todas las preguntas asociadas

        // primero traemos las preguntas asociadas
 
        
        const pregAborrar = preguntas.filter((preg) => (preg.ID_VOTACION === idVotacion))


        
        
        console.log('respuestas estan ')
        console.log(respuestas)

        // ahora se eliminan las preguntas asociadas y las respuestas asociadas a cada pregunta
        console.log('pregAborrar.length')
        console.log(pregAborrar.length)
        console.log(pregAborrar)

        for (let i = 0; i < pregAborrar.length; i++) {
            console.log('adentro del for del largo de preguntas')
            eliminarPreguntaId(idVotacion, pregAborrar[i].ID_PREGUNTA)
            console.log(pregAborrar[i].ID_PREGUNTA)
            const respAborrar = respuestas.filter((respu) => (respu.ID_PREGUNTA === pregAborrar[i].ID_PREGUNTA))
            console.log('respAborrar.length');
            console.log(respAborrar.length);
            
            for (let j = 0; j < respAborrar.length; j++) {
                console.log('entre al for de respuestas')
                eliminarRespuestaId(pregAborrar[i].ID_PREGUNTA, respAborrar[j].ID_RESPUESTA)
            }
            console.log('resp a borrar')
            console.log(respAborrar)

            
        } 
        
        eliminarVotacionId(idVotacion, idUsuario)
    
      }

      const eliminarVotacionId = async (idVotacion, idUser) => {
        await axios.delete(serverUrl+"/votacionDelete",
            {
                params:{idVotacion: idVotacion, idUsuario: idUser}
            }
        ).then(response =>{
            window.location.reload(false);
            console.log('response');
            console.log(response);
        }).catch(error =>{
            alert(error.response.data.message);
            console.log(error);
        });
    };

    const eliminarPreguntaId = async (idVotacion, idPreg) => {
        await axios.delete(serverUrl+"/preguntaDelete",
            {
                params:{idVotacion: idVotacion, idPregunta: idPreg}
            }
        ).then(response =>{
            window.location.reload(false);
            console.log('response');
            console.log(response);
        }).catch(error =>{
            alert(error.response.data.message);
            console.log(error);
        });
    };

    const eliminarRespuestaId = async (idPreg, idResp) => {
        await axios.delete(serverUrl+"/respuestaDelete",
            {
                params:{idPregunta: idPreg, idRespuesta: idResp}
            }
        ).then(response =>{
            window.location.reload(false);
            console.log('response');
            console.log(response);
        }).catch(error =>{
            alert(error.response.data.message);
            console.log(error);
        });
    };

    const handleModal = (idVot) => {
        setEnlace(`http://localhost:3000/votar/${idVot}`);
        setModalShow(true);
    }

    const handleModalResult = (idVot, tituloVotacion) => {
        setEnlace(`http://localhost:3000/votar/${idVot}`);
        setTituloVotacionResult(tituloVotacion)
        preguntasConRespuestasGet(idVot)
        setModalResultShow(true);
    }

    const preguntasConRespuestasGet = async (id) =>{
        await axios.get(serverUrl + "/preguntasConRespuestas", {params:{idVotacion: id}})
            .then(response=>{
            //setPreguntas(response.data);
            var dataPregYresp = response.data;

            
            const newPregYresp = [];
            dataPregYresp.forEach( (k) => {
                if (newPregYresp.length === 0) {
                    let newK = {
                        idPregunta: k.ID_PREGUNTA,
                        tituloPreg: k.TITULO,
                    }
                    newPregYresp.push(newK);
                }
                else{
                    let estaLaPreg = 0;
                    for (let i = 0; i < newPregYresp.length; i++) {
                        if (newPregYresp[i].idPregunta === k.ID_PREGUNTA){
                            estaLaPreg++;
                        }
                    }
                    if (estaLaPreg === 0) {
                        
                        let newK = {
                            idPregunta: k.ID_PREGUNTA,
                            tituloPreg: k.TITULO,
                            respuesta: [],
                        }
                        newPregYresp.push(newK);
                    }
                }
            })

            newPregYresp.forEach ( (k) => {
                const newResp = [];
                for (let i = 0; i < dataPregYresp.length; i++) {
                    if (k.idPregunta === dataPregYresp[i].ID_PREGUNTA){
                        let resp = {
                                        idPreg: dataPregYresp[i].ID_PREGUNTA,
                                        idResp: dataPregYresp[i].ID_RESPUESTA,
                                        respuesta: dataPregYresp[i].RESPUESTA,
                                        votos: dataPregYresp[i].VOTOS,
                                        isCheck: false,
                                    }
                        newResp.push(resp)
                    }
                }
                for (let j = 0; j < newPregYresp.length; j++) {
                    if(newPregYresp[j].idPregunta === newResp[0].idPreg) {
                        newPregYresp[j].respuesta = newResp
                    }   
                }
                
                console.log("newPregYresp3 ")
                console.log(newPregYresp)

            })

            


            //setLoading(true);
            serPregYresp(newPregYresp);
        })
        .catch (error=> {
            serPregYresp([]);
            Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            })
        })
    };

    

      



  return (
    <div id='contenedorMisVotaciones'>
        <MyNavbar activeKey='/misVotaciones'/>{/* 
        <Button onClick={() => window.location.replace('https://www.instagram.com/aquaglup/?hl=es{AQUI}')}>IR A INSTA</Button> */}
        <div id='contenedorMisVotacionesSecundario'>
            <h1 id='tituloMisVotaciones'>              
                Seleccione una opción de las votaciones disponibles
            </h1>
            <div id='contenedorMisVotacionesData'>
                {
                    misVotaciones.map((e) => (
                        <Table striped bordered hover variant="dark" id='tabla'>
                            <thead>
                            <tr>
                                <th className='columnaTablaTitulo'>{e.titulo}</th>
                                <th className='columnaTablaFunciones'> 
                                    <MdAutorenew id='iconoEditar' onClick= {() => alert('click editar')}/>
                                    <button className='botonesTabla' onClick= {() => alert('click editar')}>
                                        Editar
                                    </button> 
                                </th>
                                <th className='columnaTablaFunciones'>
                                    <MdDeleteForever id='iconoEliminar' onClick= {() => eliminarVotacion(e.id_votacion)}/>
                                    <button className='botonesTabla' onClick= {() => eliminarVotacion(e.id_votacion)}>
                                        Eliminar
                                    </button> 
                                </th>
                                <th className='columnaTablaFunciones'>
                                    <MdShare id='iconoCompartir' onClick= {() => handleModal(e.id_votacion)}/>
                                    <button className='botonesTabla' onClick={() => handleModal(e.id_votacion)}>
                                        Compartir
                                    </button> 
                                </th>
                                <th className='botonesTablaVisualizarResult'>
                                    <MdPieChart id='iconoVisualizarResultado' onClick= {() => handleModalResult(e.id_votacion, e.titulo)}/>
                                    <button className='botonesTabla' onClick= {() => handleModalResult(e.id_votacion, e.titulo)}>
                                        Visualizar resultados
                                    </button> 
                                </th>
                                
                            </tr>
                            </thead>
                        </Table>
                        
                    ))
                }
                
            </div>
            
        </div>
        <ModalCompartir 
            show={modalShow}
            onHide={() => setModalShow(false)}
            enlace= {enlace}
        /> 

        <ModalResultados
            show={modalResultShow}
            onHide={() => setModalResultShow(false)}
            enlace= {enlace}
            tituloVotacion = {tituloVotacionResult}
            data={pregYresp}
        />
    
    </div>
  )
}

export default MisVotaciones