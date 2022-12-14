import React, { useEffect, useState} from 'react'



import ModalCompartir from '../componts/ModalCompartir';
import ModalResultados from '../componts/ModalResultados';

import MyNavbar from '../componts/MyNavbar';

import Table from 'react-bootstrap/Table';



import '../styles/MisVotaciones.css';

import axios from 'axios';
import Cookies from 'universal-cookie';
import Swal from 'sweetalert2';


import { MdAutorenew,MdOutlineContentCopy, MdDeleteForever, MdShare, MdPieChart, MdCheckCircleOutline, MdHighlightOff, MdRule, MdWorkspacesFilled } from "react-icons/md";


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

    //data para la nueva votacion
    const [idVotacion, setIdVotacion] = useState(1);
    
    const [idPregInsert, setIdPregInsert] = useState(0)

    
    var idPreguntaInsert = idPregInsert;

    // id preg para estado 2

    const [idPregEstado2, setIdPregEstado2] = useState(0)





    useEffect(() => {
        votacionesGet();
        respuestasGet();
        preguntasGet();
      },[]);

    const votacionesGet = async () =>{
    await axios.get(serverUrl + "/votaciones", {params:{idUsuario: idUsuario}})
        .then(response=>{
        setMisVotaciones(response.data);

        setIdVotacion(response.data[response.data.length - 1].id_votacion)
        
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
            
            setIdPregInsert(response.data[response.data.length - 1].ID_PREGUNTA)
            
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


    const confirmacionEliminarVotacion = (idVotacion) => {
        Swal.fire({
            title: '??Esta seguro de eliminar la votaci??n?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar votaci??n!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {

                Swal.fire(
                    'Votaci??n eliminada!',
                    'Su votaci??n ha sido eliminada con ??xito',
                    'success'
                )
                setTimeout(function () {   
                    eliminarVotacion(idVotacion) 
                }, 1500);
              
                
            }})
    }   

    const eliminarVotacion = (idVotacion) => {
        
        
        const pregAborrar = preguntas.filter((preg) => (preg.ID_VOTACION === idVotacion))


        // ahora se eliminan las preguntas asociadas y las respuestas asociadas a cada pregunta
       
        for (let i = 0; i < pregAborrar.length; i++) {
            eliminarPreguntaId(idVotacion, pregAborrar[i].ID_PREGUNTA)
            
            const respAborrar = respuestas.filter((respu) => (respu.ID_PREGUNTA === pregAborrar[i].ID_PREGUNTA))
            
            
            for (let j = 0; j < respAborrar.length; j++) {
                eliminarRespuestaId(pregAborrar[i].ID_PREGUNTA, respAborrar[j].ID_RESPUESTA)
            }
            
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
        }).catch(error =>{
            alert(error.response.data.message);
        });
    };

    const handleModal = (idVot, estado) => {

        //validar que se obtengo el id de preg cuando el estado es = a 2

        if(estado === 2){
            // obtener el id de la pregunta
            getPreguntaId(idVot, estado)
            
        }

        else{
            setEnlace(`http://localhost:3000/votar/${idVot}/${estado}/${idPregEstado2}`);
        }

        setModalShow(true);
    }

    const getPreguntaId = async (idVot, estado) =>{
        await axios.get(serverUrl + "/preguntasGet", {params:{idVotacion: idVot}})
          .then(response=>{
            setIdPregEstado2(response.data[0].id_pregunta)
            setEnlace(`http://localhost:3000/votar/${idVot}/${estado}/${response.data[0].id_pregunta}`);
            //setIdPregInsert(response.data[response.data.length - 1].ID_PREGUNTA)
            //setLoading(true);
            //console.log("trae esto getPreguntas:");
            //console.log(response.data[response.data.length - 1].ID_PREGUNTA);
        })
        .catch (error=> {
          setIdVotacion(0)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
          })
        })
    };



    const handleModalResult = (idVot, tituloVotacion) => {
        //setEnlace(`http://localhost:3000/votar/${idVot}`);
        setTituloVotacionResult(tituloVotacion)
        preguntasConRespuestasGet(idVot)
        /* setModalResultShow(true); */
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

            })

            


            //setLoading(true);
            serPregYresp(newPregYresp);
            setModalResultShow(true);
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

    const cerrarVotacion = (idVot, estado) => {

        Swal.fire({
            title: '??Esta seguro de cerrar la votaci??n?',
            text: "Una vez cerrada la votaci??n nadie m??s podra votar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, cerrar votaci??n!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                let estado = 0;
                updateEstadoVotacion(idVot, idUsuario, estado)

                Swal.fire(
                    'Votaci??n cerrada!',
                    'Su votaci??n ha sido finalizada',
                    'success'
                )
              
            }
            

            else{
                window.location.reload(true);
            }
          })

        
          
    }

    const segundoSwal = async(idVot, estado) => {

        //se requiere verificar si la votacion tiene votos repetidos
        let repetirVotacion = false;

        await axios.get(serverUrl + "/preguntasConRespuestas", {params:{idVotacion: idVot}})
        .then(response=>{
        //setPreguntas(response.data);
        var data = response.data;
        

        const newPregYresp = [];
            data.forEach( (k) => {
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
                for (let i = 0; i < data.length; i++) {
                    if (k.idPregunta === data[i].ID_PREGUNTA){
                        let resp = {
                                        idPreg: data[i].ID_PREGUNTA,
                                        idResp: data[i].ID_RESPUESTA,
                                        respuesta: data[i].RESPUESTA,
                                        votos: data[i].VOTOS,
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
            })

            var preguntasConVotosRepetidos = [];

            // recorrer las preguntas con respuestas para buscar preguntas con votos iguales

            for (let i = 0; i < newPregYresp.length; i++) {
                //console.log(newPregYresp[i].respuesta);

                // obtenemos las respuestas de cada pregunta
                let auxResp = newPregYresp[i].respuesta;
                let votos =[]

                // obtenemos los votos de cada pregunta
                for (let k = 0; k < auxResp.length; k++){
                    votos.push(auxResp[k].votos)
                }

                // ordenamos los votos para ver si hay preguntas con la misma cantidad de votos

                votos.sort(function(a,b){
                    return b - a;
                })

                // ver si los votos se repiten

                // datos necesarios para crear la nueva funcion
                let preguntaAgregada = 0;

                for (let j = 0; j < votos.length; j++) {

                    if (votos[j] === votos[j+1]){
                        //agregamos la pregunta que tiene respuestas con voto repetidos

                        // nos aseguramos de agregar solo una vez la pregunta
                        if(preguntaAgregada === 0 && votos[j] > 0){
                            preguntasConVotosRepetidos.push(newPregYresp[i]);
                            preguntaAgregada++;
                        }
                        
                        j = votos.length; 
                    }
                    else{
                        j = votos.length;
                    }

                }


                if(preguntasConVotosRepetidos.length > 0){
                    repetirVotacion = true;
                }
                else{
                    repetirVotacion = false;
                }

            }
        })
        .catch (error=> {
            Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            })
        })

        // vemos si la votacion a cerrar tiene preguntas con votos repetidos

        console.log(repetirVotacion)
        if(repetirVotacion){
            Swal.fire({
                title: 'Se han detectado preguntas con votos repetidos!',
                text: "??Desea crear una nueva votaci??n para desempatar las preguntas afectadas?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, crear la nueva votaci??n!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {


                    Swal.fire({
                        title: "Ingrese el titulo para su nueva votaci??n!",
                        text: "Titulo de votaci??n",
                        input: 'text',
                        inputValue: '',
                        showCancelButton: true,  
                        inputValidator: (value) => {
                            if (!value) {
                              return 'El campo del nuevo titulo es obligatorio!'
                            }    
                        }  
                    }).then((result) => {
                        if (result.value !== "" && result.value !== undefined) {
                            
                            // se llama la funcion de crear la votacion con el titulo obtenido en el input
                            logicaRepetirVotacionAuto(idVot, result.value)
                            Swal.fire(
                                'Votaci??n creada!',
                                'Su votaci??n ha sido creada con ??xito',
                                'success',
                            )
                            setTimeout(function () {   
                                cerrarVotacion(idVot, estado)  
                            }, 1500);
                            //console.log("Result: " + result.value);
                        }

                        else{
                            setTimeout(function () {   
                                cerrarVotacion(idVot, estado)  
                            }, 1500);
                        }

                    });


                    //logicaRepetirVotacionAuto(idVot)
                    
                    /* Swal.fire(
                        'Votaci??n creada!',
                        'Su votaci??n ha sido creada con ??xito',
                        'success',
                    ) */
                    /* setTimeout(function () {   
                        cerrarVotacion(idVot, estado)  
                    }, 1500); */
                }
                else{
                    cerrarVotacion(idVot, estado)
                }
            })
        }

        else{

            // aqui llamaria al primer swal
            cerrarVotacion(idVot, estado)
        }
        
    }

    

    const updateEstadoVotacion = async (idVotacion, idUser, estado) => {
        /* var estado = 0; */
        console.log(estado);
        await axios({
            method: 'put',
            url:serverUrl + "/votacionEstadoUpdate", 
            headers: {'Content-Type': 'application/json'},
            params:{idVotacion: idVotacion, idUsuario: idUser, estado: estado}
        }).then(response =>{
            window.location.reload(true);
        }).catch(error =>{
            alert(error.response.data.message);
            console.log(error);
        });
    };

    const logicaRepetirVotacionAuto = async(id, tituloNuevo) => {
        await axios.get(serverUrl + "/preguntasConRespuestas", {params:{idVotacion: id}})
        .then(response=>{
        //setPreguntas(response.data);
        var data = response.data;
        

        const newPregYresp = [];
            data.forEach( (k) => {
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
                for (let i = 0; i < data.length; i++) {
                    if (k.idPregunta === data[i].ID_PREGUNTA){
                        let resp = {
                                        idPreg: data[i].ID_PREGUNTA,
                                        idResp: data[i].ID_RESPUESTA,
                                        respuesta: data[i].RESPUESTA,
                                        votos: data[i].VOTOS,
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
            })

            var preguntasConVotosRepetidos = [];

            // recorrer las preguntas con respuestas para buscar preguntas con votos iguales

            for (let i = 0; i < newPregYresp.length; i++) {
                //console.log(newPregYresp[i].respuesta);

                // obtenemos las respuestas de cada pregunta
                let auxResp = newPregYresp[i].respuesta;
                let votos =[]

                // obtenemos los votos de cada pregunta
                for (let k = 0; k < auxResp.length; k++){
                    votos.push(auxResp[k].votos)
                }

                // ordenamos los votos para ver si hay preguntas con la misma cantidad de votos
                

                votos.sort(function(a,b){
                    return b - a;
                })

            

                // ver si los votos se repiten

                // datos necesarios para crear la nueva funcion
                let preguntaAgregada = 0;
                let respuestasAagregar = [];
                let tituloPreguntaAagregar = '';

                for (let j = 0; j < votos.length; j++) {

                    /* if(j > 0){
                        j--;
                    } */

                    if (votos[j] === votos[j+1]){
                        //agregamos la pregunta que tiene respuestas con voto repetidos

                        // nos aseguramos de agregar solo una vez la pregunta
                        if(preguntaAgregada === 0){
                            preguntasConVotosRepetidos.push(newPregYresp[i]);
                            preguntaAgregada++;
                        }

                        // agregamos los votos que se repiten solamente
                        let votoRepetido = votos[j];

                        // agregamos el titulo de la pregunta
                        tituloPreguntaAagregar = newPregYresp[i].tituloPreg;

                        // recorremos las preguntas comparandolo con el voto repetido

                        

                        for(let m = 0; m < newPregYresp[i].respuesta.length; m++){
                            /* console.log('hola')
                            console.log( newPregYresp[i].respuesta.length)
                            console.log(newPregYresp[i].respuesta[m].votos) */
                           
                            //console.log(newPregYresp[i].respuesta.votos[m])
                            // comparamos el voto repetido con los votos de la pregunta
                            console.log(votoRepetido +' === ' + newPregYresp[i].respuesta[m].votos)
                            if(votoRepetido === newPregYresp[i].respuesta[m].votos){
                                respuestasAagregar.push(newPregYresp[i].respuesta[m].respuesta)
                            }
                        }

                        console.log(respuestasAagregar)
                        console.log(tituloPreguntaAagregar)

                        // crear la funcion que cree la nueva votacion con los datos botenidos

                        // creo la nueva pregunta
                        createPregunta(tituloPreguntaAagregar)

                        //creo las nuevas respuestas
                        respuestasAagregar.forEach((n) => {
                            createResp(n)
                        })
                        

                        //j++;
                        
                        j = votos.length; 
                    }
                    else{
                        j = votos.length;
                    }

                }

                console.log('preguntasConVotosRepetidos')
                console.log(preguntasConVotosRepetidos)

                


            }
            // aqui creo el crear votacion para que se haga solo 1 vez
            obtenerTipoVotacion(tituloNuevo)
            //createVotacion(tituloNuevo)
        })
        .catch (error=> {
            serPregYresp([]);
            Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            })
        })
    }

    const obtenerTipoVotacion = async(tituloNuevo) => {
        await axios.get(serverUrl + "/votacionById", {params:{idVotacion: idVotacion}})
            .then(response=>{
            var tipoVot = response.data[0].tipo;
            //setLoading(true);
            console.log("trae esto getVotaciones ojo:");
            console.log(response.data[0]);

            //creo la nueva votacion con el titulo nuevo y el tipo
            createVotacion(tituloNuevo, tipoVot)
        })
        .catch (error=> {
            Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            })
        })
    }


    const createVotacion = async (tituloVotacion, tipoVot) =>{
        var idVot = idVotacion + 1;
        var estado = 1;
        console.log(idUsuario, tituloVotacion, idVot)
        await axios({
          method: 'post',
          url:serverUrl + "/votacionCreate", 
          headers: {'Content-Type': 'application/json'},
          params:
          {
            idUsuario: idUsuario,
            titulo: tituloVotacion,
            idVotacion: idVot,
            estado: estado,
            tipo: tipoVot,
          }
        }).then(response=>{
          console.log("Funciona create votacion con id de votacion: ");
          console.log(response);
          //setIdVotacion(response.data.insertId);
        })
        .catch(error=>{
                alert(error.response.data.message);
                console.log(error);
              })
      };

    const createPregunta = async (tituloVota) =>{
        console.log('idVotacion: ' )
        console.log(idVotacion);
        let idVot = idVotacion + 1;
    
        idPreguntaInsert++;
    
        console.log('idPregunta: ' )
        console.log(idPreguntaInsert);
    
        console.log('idVot: ' )
        console.log(idVot);
        await axios({
          method: 'post',
          url:serverUrl + "/preguntaCreate",
          headers: {'Content-Type': 'application/json'},
          params:
          {
            idVotacion: idVot,
            titulo: tituloVota,
            idPregunta: idPreguntaInsert,
          }
        }).then(response=>{
          console.log("Funciona create pregunta ");
        })
        .catch(error=>{
                alert(error.response.data.message);
                console.log(error);
            })
    };

    const createResp = async (tituloResp) =>{
    
        console.log( tituloResp);
    
        await axios({
          method: 'post',
          url:serverUrl + "/respuestaCreate", 
          headers: {'Content-Type': 'application/json'},
          params:
          {
            idPregunta: idPreguntaInsert,
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

    const empezarVotacion = (idVot) => {
        let estado = 1;
        Swal.fire({
            title: '??Esta seguro de empezar la votaci??n?',
            text: "Una vez empezada la votaci??n nadie m??s podra ser ingresado como respuesta",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, empezar votaci??n!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                updateEstadoVotacion(idVot, idUsuario, estado)

                Swal.fire(
                    'Votaci??n iniciada!',
                    'Su votaci??n ha sido inicializada con ??xito!',
                    'success'
                )
              
            }

            
          })
    }

    const copiarVotacio = (idVotacionCop) => {
        Swal.fire({
            title: '??Esta seguro de copiar la votaci??n?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, copiar votaci??n!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                getTituloCopia(idVotacionCop)

                copiarPregYresp(idVotacionCop)
                
                Swal.fire(
                    'Votaci??n copiada!',
                    'Su votaci??n ha sido copiada con ??xito!',
                    'success'
                )
                setTimeout(function () {   
                    //window.location.reload()
                    window.location.reload(true);          
                }, 2000);
              
            }})
    }

    const getTituloCopia = async (idVotacionCopia) =>{
        await axios.get(serverUrl + "/votacionById", {params:{idVotacion: idVotacionCopia}})
            .then(response=>{
    
            console.log(response.data[0])
            var tituloCopia = response.data[0].TITULO + ' (copia)';
            let tipoVot = response.data[0].tipo;
            createVotacionCopia(tituloCopia, tipoVot)
            
        })
        .catch (error=> {
            setMisVotaciones([]);
            Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            })
        })
    };

    const createVotacionCopia = async (tituloVotacion, tipoVot) =>{
        var idVot = idVotacion + 1;
        var estado = 2;
        console.log(idUsuario, tituloVotacion, idVot)
        await axios({
        method: 'post',
        url:serverUrl + "/votacionCreate", 
        headers: {'Content-Type': 'application/json'},
        params:
        {
            idUsuario: idUsuario,
            titulo: tituloVotacion,
            idVotacion: idVot,
            estado: estado,
            tipo: tipoVot,
        }
        }).then(response=>{
        console.log("Funciona create votacion con id de votacion: ");
        console.log(response);
        //setIdVotacion(response.data.insertId);
        })
        .catch(error=>{
                alert(error.response.data.message);
                console.log(error);
            })
    };

    const copiarPregYresp = async(idVot) => {
        await axios.get(serverUrl + "/preguntasConRespuestas", {params:{idVotacion: idVot}})
        .then(response=>{
        //setPreguntas(response.data);
        console.log(response.data);
        var data = response.data;
        const newPregYresp = [];
            data.forEach( (k) => {
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
                for (let i = 0; i < data.length; i++) {
                    if (k.idPregunta === data[i].ID_PREGUNTA){
                        let resp = {
                                        idPreg: data[i].ID_PREGUNTA,
                                        idResp: data[i].ID_RESPUESTA,
                                        respuesta: data[i].RESPUESTA,
                                        votos: data[i].VOTOS,
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
            })

            console.log(newPregYresp)

            newPregYresp.forEach((k) =>{
                createPregunta(k.tituloPreg)
                k.respuesta.forEach((r) => {
                    createResp(r.respuesta)
                })
            })




    })
    .catch (error=> {
        serPregYresp([]);
        Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
        })
    })
    }

    const editarVotacion = (idVotacion) => {
        Swal.fire({
            title: '??Esta seguro de editar la votaci??n?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, editar votaci??n!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                getTipoVotEditar(idVotacion)
                
                /* Swal.fire(
                    'Votaci??n copiada!',
                    'Su votaci??n ha sido copiada con ??xito!',
                    'success'
                )
                setTimeout(function () {   
                    //window.location.reload()
                    window.location.reload(true);          
                }, 2000); */
              
            }})
    }

    const getTipoVotEditar = async (idVotacionEdi) =>{
        await axios.get(serverUrl + "/votacionById", {params:{idVotacion: idVotacionEdi}})
            .then(response=>{
    
            console.log(response.data[0])
            let tipoVot = response.data[0].tipo;
            console.log(tipoVot);

            if(tipoVot === 'directorio'){
                window.location.replace(`/crearVotacionDirectorio/${tipoVot}/${idVotacionEdi}`)
            }

            else if(tipoVot === 'especial'){
                window.location.replace(`/crearVotacionUnGanador/${tipoVot}/${idVotacionEdi}`)
            }

            else{
                window.location.replace(`/crearVotacion/${tipoVot}/${idVotacionEdi}`)
            }
            
        })
        .catch (error=> {
            setMisVotaciones([]);
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
                Seleccione una opci??n de las votaciones disponibles
            </h1>
            <div id='contenedorMisVotacionesData'>
                <Table striped bordered hover variant="dark" id='tabla'>
                    <thead>
                        <tr>
                            <th className='columnaTablaTitulo' id='centrarTitulosColumnas'>Nombre Votaci??n</th>
                            <th className='columnaTablaFunciones' id='centrarTitulosColumnas'>Editar/Copiar Votaci??n</th>
                            <th className='columnaTablaFunciones' id='centrarTitulosColumnas'>Eliminar Votaci??n</th>
                            <th className='columnaTablaFunciones' id='centrarTitulosColumnas'>Compartir Votaci??n</th>
                            <th className='columnaTablaVisualizarResult' id='centrarTitulosColumnas'>Resultados Votaci??n</th>
                            <th className='botonesTablaCerrarVotacion' id='centrarTitulosColumnas'>Opciones Votaci??n</th>
                            <th className='columnaTablaEstado' id='centrarTitulosColumnas'>Estado Votaci??n</th>
                        </tr>
                    </thead>
                </Table>
                
                {
                    
                    misVotaciones.map((e) => (
                        <Table striped bordered hover variant="dark" id='tabla'>

                            
                            <tbody>
                            <tr>
                                <td className='columnaTablaTitulo'>{e.titulo}</td>
                                
                                {e.estado === 2 ?
                                <td className='columnaTablaFunciones'> 
                                    <MdAutorenew id='iconoEditar' onClick= {() => editarVotacion(e.id_votacion)}/>
                                    <button className='botonesTabla' onClick= {() => editarVotacion(e.id_votacion)}>
                                        Editar
                                    </button> 
                                </td>:
                                <td className='columnaTablaFunciones'> 
                                    <MdOutlineContentCopy id='iconoEditar' onClick= {() => copiarVotacio(e.id_votacion)}/>
                                    <button className='botonesTabla' onClick= {() => copiarVotacio(e.id_votacion)}>
                                        Copiar
                                    </button> 
                                </td>
                                }

                                
                                <td className='columnaTablaFunciones'>
                                    <MdDeleteForever id='iconoEliminar' onClick= {() => confirmacionEliminarVotacion(e.id_votacion)}/>
                                    <button className='botonesTabla' onClick= {() => confirmacionEliminarVotacion(e.id_votacion)}>
                                        Eliminar
                                    </button> 
                                </td>
                                <td className='columnaTablaFunciones'>
                                    <MdShare id='iconoCompartir' onClick= {() => handleModal(e.id_votacion, e.estado)}/>
                                    <button className='botonesTabla' onClick={() => handleModal(e.id_votacion, e.estado)}>
                                        Compartir
                                    </button> 
                                </td>
                                <td className='columnaTablaVisualizarResult'>
                                    <MdPieChart id='iconoVisualizarResultado' onClick= {() => handleModalResult(e.id_votacion, e.titulo)}/>
                                    <button className='botonesTabla' onClick= {() => handleModalResult(e.id_votacion, e.titulo)}>
                                        Visualizar resultados
                                    </button> 
                                </td>

                                {e.estado === 1 ?
                                    <>
                                        <td className='botonesTablaCerrarVotacion'>
                                            <MdRule id='iconoCerrarVotacion' onClick= {() => segundoSwal(e.id_votacion, e.estado)}/>
                                            <button className='botonesTabla' onClick= {() => segundoSwal(e.id_votacion, e.estado)}>
                                                Cerrar votaci??n
                                            </button> 
                                        </td>
                                        <td className='columnaTablaEstado'>
                                            <MdWorkspacesFilled id='iconoEnCurso' />
                                            <button className='botonesTabla'  disabled>
                                                En curso
                                            </button> 
                                        </td>
                                    </>
                                    :
                                    <>
                                        {e.estado === 2 ?
                                        <>
                                            <td className='botonesTablaCerrarVotacion'>
                                                <MdRule id='iconoCerrarVotacion' onClick= {() => empezarVotacion(e.id_votacion, e.estado)}/>
                                                <button className='botonesTabla' onClick= {() => empezarVotacion(e.id_votacion, e.estado)}>
                                                    Empezar Votaci??n
                                                </button> 
                                            </td>
                                            <td className='columnaTablaEstado'>
                                                <MdHighlightOff id='iconoNoDisponibleCerrarVotacion' />
                                                <button className='botonesTabla' disabled>
                                                    Inactiva
                                                </button> 
                                            </td>
                                        </>:

                                        <>
                                            <td className='botonesTablaCerrarVotacion'>
                                                <MdRule id='iconoCerrarVotacion'/>
                                                <button className='botonesTabla' onClick= {() => segundoSwal(e.id_votacion, e.estado)} disabled>
                                                    Cerrar votaci??n 
                                                </button> 
                                            </td>
                                            <td className='columnaTablaEstado'>
                                                
                                                <MdCheckCircleOutline id='iconoDisponibleCerrarVotacion' />
                                                <button className='botonesTabla' disabled >
                                                    Finalizada
                                                </button> 
                                            </td>
                                        </>

                                        }
                                        <>
                                            {/* <td className='botonesTablaCerrarVotacion'>
                                                <MdRule id='iconoCerrarVotacion' onClick= {() => segundoSwal(e.id_votacion, e.estado)}/>
                                                <button className='botonesTabla' onClick= {() => segundoSwal(e.id_votacion, e.estado)}>
                                                    Cerrar votaci??n
                                                </button> 
                                            </td>
                                            <td className='columnaTablaEstado'>
                                                <MdHighlightOff id='iconoNoDisponibleCerrarVotacion' />
                                                <button className='botonesTabla' disabled>
                                                    Finalizada
                                                </button> 
                                            </td> */}
                                        </>
                                    </>
                                }

                                
                                
                            </tr>
                            </tbody>
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
            tituloVotacion = {tituloVotacionResult}
            data={pregYresp}
        />
    
    </div>
  )
}

export default MisVotaciones