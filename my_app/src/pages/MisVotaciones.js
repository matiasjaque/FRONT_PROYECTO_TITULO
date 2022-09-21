import React, { useEffect, useState} from 'react'
import Button from 'react-bootstrap/Button';
//import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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

    useEffect(() => {
        votacionesGet();
        respuestasGet();
        preguntasGet();
      },[]);


    console.log("id: " + conectado.get('id'));
    console.log("nombre: " + conectado.get('nombre'));
    console.log("apellido: " + conectado.get('apellido'));


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
                                    <MdShare id='iconoCompartir' onClick= {() => alert('click compartir')}/>
                                    <button className='botonesTabla' onClick= {() => alert('click compartir')}>
                                        Compartir
                                    </button> 
                                </th>
                                <th className='botonesTablaVisualizarResult'>
                                    <MdPieChart id='iconoVisualizarResultado' onClick= {() => alert('click visualizar resultados')}/>
                                    <button className='botonesTabla' onClick= {() => alert('click visualizar resultados')}>
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
    
    </div>
  )
}

export default MisVotaciones