import React, { useEffect, useState} from 'react'



import ModalCompartir from '../componts/ModalCompartir';
import ModalResultados from '../componts/ModalResultados';


import MyNavbar from '../componts/MyNavbar';

import Table from 'react-bootstrap/Table';



import '../styles/MisVotaciones.css';

import axios from 'axios';
import Cookies from 'universal-cookie';
import Swal from 'sweetalert2';


import { MdAutorenew,MdOutlineContentCopy, MdDeleteForever,MdRemoveRedEye, MdShare, MdPieChart, MdCheckCircleOutline, MdHighlightOff, MdRule, MdWorkspacesFilled } from "react-icons/md";
import ModalVotEspecial from '../componts/ModalVotEspecial';


const serverUrl = process.env.REACT_APP_SERVER;
const puertoUrl = process.env.RUTA_PUERTO || 'https://votacionesfast.netlify.app';
const conectado = new Cookies();

var controldadorUseEfect = 0;


var idUsuario = conectado.get('id'); 

console.log(conectado);


const MisVotaciones = () => {

    const [misVotaciones, setMisVotaciones] = useState([]);

    const [preguntas, setPreguntas] = useState([]);

    const [respuestas, setRespuestas] = useState([]);

    const [modalShow, setModalShow] = useState(false);
    const [modalResultShow, setModalResultShow] = useState(false);
   
    const [modalEspecial, setModalEspecial] = useState(false);

    const [enlace, setEnlace] = useState('');
    const [estadoVotacion, setEstadoVotacion] = useState(0);

    const [tituloVotacionResult, setTituloVotacionResult] = useState('');
    const [pregYresp, serPregYresp] = useState([]);
    const [dataModalEspecial, setDataModalEspecial] = useState([]);
    const [porcentajeModal, setPorcentajeModal ] = useState(0);
    const [tituloPregEspecial, setTituloPregEspecial] = useState('');
    const [idVotacionEspecial, setIdVotacionEspecial] = useState(0);

    // data usuarios votantes
    const [dataUsuarioVotantes, setDataUsuariosVotantes] = useState([]);
    const [usuarioVotantesVotEsp, setUsuarioVotantesVotEsp] = useState([]);
    

    //data para la nueva votacion
    const [idVotacion, setIdVotacion] = useState(1);
    
    const [idPregInsert, setIdPregInsert] = useState(0)

    
    var idPreguntaInsert = idPregInsert;

    // id preg para estado 2

    const [idPregEstado2, setIdPregEstado2] = useState(0)

    const [segura, setSegura] = useState(0);


    useEffect(() => {
        if(controldadorUseEfect === 0){
            fetchData();
            /* votacionesGet();
            respuestasGet();
            preguntasGet();
            getUsuarioVotantesGlobal(); */
            controldadorUseEfect = 1;
        }
        
      });

      const fetchData = async () => {
        try {
          const [votacionesResponse, respuestasResponse, preguntasResponse] = await Promise.all([
            axios.get(serverUrl + "/votaciones", { params: { idUsuario: idUsuario } }),
            axios.get(serverUrl + "/respuestasGetGlobal"),
            axios.get(serverUrl + "/preguntasGetGlobal")
          ]);
      
          setMisVotaciones(votacionesResponse.data);
          setIdVotacion(votacionesResponse.data[votacionesResponse.data.length - 1].id_votacion);
          setRespuestas(respuestasResponse.data);
          setPreguntas(preguntasResponse.data);
          setIdPregInsert(preguntasResponse.data[preguntasResponse.data.length - 1].ID_PREGUNTA);
      
          getUsuarioVotantesGlobal();
        } catch (error) {
          setMisVotaciones([]);
          setRespuestas([]);
          setPreguntas([]);
          console.log(error);
          /* Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
          }) */
          alert(error.response.data.message);
          console.log(error);
        }
      };

    /* const votacionesGet = async () =>{
    await axios.get(serverUrl + "/votaciones", {params:{idUsuario: idUsuario}})
        .then(response=>{
        setMisVotaciones(response.data);

        setIdVotacion(response.data[response.data.length - 1].id_votacion)
        
    })
    .catch (error=> {
        setMisVotaciones([]);
        console.log(error);
        /* Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
        }) *//* 
        alert(error.response.data.message);
        console.log(error); 
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
            console.log(error);
            /* Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            }) *//* 
            alert(error.response.data.message);
            console.log(error); 
        })
        };

        const respuestasGet = async () =>{
            await axios.get(serverUrl + "/respuestasGetGlobal")
                .then(response=>{
                setRespuestas(response.data);
                
            })
            .catch (error=> {
                setRespuestas([]);
                console.log(error); 
                /* Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.message,
                }) *//* 
                alert(error.response.data.message);
                console.log(error); 
            })
        }; */


    const confirmacionEliminarVotacion = (idVotacion) => {
    
        Swal.fire({
            title: '¿Esta seguro de eliminar la votación?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar votación!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {

                Swal.fire(
                    'Votación eliminada!',
                    'Su votación ha sido eliminada con éxito',
                    'success'
                )
                setTimeout(function () {   
                    eliminarVotacion(idVotacion) 
                }, 1500);
              
                
            }})
    }   

    const eliminarVotacion = async (idVotacion) => {
        //console.log(dataUsuarioVotantes)
        const usuariosVotantesAborrar = dataUsuarioVotantes.filter(e => e.ID_VOTACION === idVotacion)
        //console.log(usuariosVotantesAborrar)
        let usuariosVotantesDelete = [];
        for (var i = 0; i < usuariosVotantesAborrar.length; i++) {
            usuariosVotantesDelete.push({idVotacion: usuariosVotantesAborrar[i].ID_VOTACION, RUT: usuariosVotantesAborrar[i].RUT})
        }

        console.log(usuariosVotantesDelete)
        
        const pregAborrar = preguntas.filter((preg) => (preg.ID_VOTACION === idVotacion))
        let preguntasDelete = [];
        let respuestasDelete = [];



        // ahora se eliminan las preguntas asociadas y las respuestas asociadas a cada pregunta
       
        for (let i = 0; i < pregAborrar.length; i++) {
            preguntasDelete.push({idVotacion: idVotacion, idPregunta: pregAborrar[i].ID_PREGUNTA})
            //eliminarPreguntaId(idVotacion, pregAborrar[i].ID_PREGUNTA)
            
            const respAborrar = respuestas.filter((respu) => (respu.ID_PREGUNTA === pregAborrar[i].ID_PREGUNTA))
            
            
            for (let j = 0; j < respAborrar.length; j++) {
                respuestasDelete.push({idPregunta: pregAborrar[i].ID_PREGUNTA, idRespuesta: respAborrar[j].ID_RESPUESTA})
                //eliminarRespuestaId(pregAborrar[i].ID_PREGUNTA, respAborrar[j].ID_RESPUESTA)
            }
            
        } 

        console.log(preguntasDelete)
        console.log(respuestasDelete)

        /* if(usuariosVotantesAborrar.length > 0){
            for(let k = 0; k < usuariosVotantesAborrar.length; k++) {
                eliminarUsuarioVotanteId(idVotacion, parseInt(usuariosVotantesAborrar[k].RUT));
            }
        } */

        if(respuestasDelete.length > 0 && usuariosVotantesDelete.length > 0){
            try {
                await Promise.all([
                    eliminarPreguntaLote(preguntasDelete),
                    eliminarRespuestaLote(respuestasDelete),
                    eliminarUsuarioVotanteLote(usuariosVotantesDelete),
                    eliminarVotacionId(idVotacion, idUsuario)
                ]);
                console.log("Todas las eliminaciones se completaron correctamente");
            } catch (error) {
                console.log("Ocurrió un error al eliminar la votación: ", error);
            }
        }

        else if(respuestasDelete.length > 0) {
            try {
                await Promise.all([
                    eliminarPreguntaLote(preguntasDelete),
                    eliminarRespuestaLote(respuestasDelete),
                    eliminarVotacionId(idVotacion, idUsuario)
                ]);
                console.log("Todas las eliminaciones se completaron correctamente");
            } catch (error) {
                console.log("Ocurrió un error al eliminar la votación: ", error);
            }    
        }

        else{
            try {
                await Promise.all([
                    eliminarPreguntaLote(preguntasDelete),
                    eliminarUsuarioVotanteLote(usuariosVotantesDelete),
                    eliminarVotacionId(idVotacion, idUsuario)
                ]);
                console.log("Todas las eliminaciones se completaron correctamente");
            } catch (error) {
                console.log("Ocurrió un error al eliminar la votación: ", error);
            } 
        }

        

        /* eliminarPreguntaLote(preguntasDelete)

        eliminarRespuestaLote(respuestasDelete)

        eliminarUsuarioVotanteLote(usuariosVotantesDelete)
        
        
        eliminarVotacionId(idVotacion, idUsuario) */
    
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

    const eliminarPreguntaLote = async (preguntasDelete) => {
        await axios.delete(serverUrl+"/preguntaDeleteLote",
            {
                data: preguntasDelete
            }
        ).then(response =>{
            window.location.reload(false);
        }).catch(error =>{
            alert(error.response.data.message);
            console.log(error);
        });
    };

    

    const eliminarRespuestaLote = async (respuestasDelete) => {
        await axios.delete(serverUrl+"/respuestaDeleteLote",
            {
                data: respuestasDelete
            }
        ).then(response =>{
            window.location.reload(false);
        }).catch(error =>{
            alert(error.response.data.message);
        });
    };
    

    const eliminarUsuarioVotanteLote = async (usuariosVotantesEliminar) => {
        console.log(typeof(rut))
        await axios.delete(serverUrl+"/usuarioVotanteDeleteLote",
            {
                data: usuariosVotantesEliminar
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

    const handleModal = (idVot, estado, tipo) => {

        //validar que se obtengo el id de preg cuando el estado es = 2
        console.log(tipo)

        if(estado === 2){

            if(tipo === 'normal'){
                Swal.fire({
                    icon: 'info',
                    title: 'Error',
                    text: 'Para compartir una votación normal, debe estar en estado "en curso"',
                })
            }
            else{
                setEnlace(`${puertoUrl}/votar/${idVot}/${estado}/${idPregEstado2}`);
                setModalShow(true);
            }
            // obtener el id de la pregunta
            getPreguntaId(idVot, estado)
            
            
        }

        else{
            setEnlace(`${puertoUrl}/votar/${idVot}/${estado}/${idPregEstado2}`);
            setModalShow(true);
        }

        
    }

    const getPreguntaId = async (idVot, estado) =>{
        await axios.get(serverUrl + "/preguntasGet", {params:{idVotacion: idVot}})
          .then(response=>{
            setIdPregEstado2(response.data[0].id_pregunta)
            setEnlace(`${puertoUrl}/votar/${idVot}/${estado}/${response.data[0].id_pregunta}`);
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



    const handleModalResult = (idVot, tituloVotacion, estado) => {
        //console.log(estado)
        
        setTituloVotacionResult(tituloVotacion)
        preguntasConRespuestasGet(idVot)
        setEstadoVotacion(estado)

        if(estado === 0){
            getUsuarioVotantes(idVot);
        }

    }


    // funcion para traer la data sobre los usuarios que participan de las votaciones

    const getUsuarioVotantes = async (idVot) =>{
        await axios.get(serverUrl + "/usuariosVotante")
          .then(response=>{
            let usuarioVotantes = response.data.filter((e) => e.ID_VOTACION === idVot);
            console.log(response.data)
            console.log(usuarioVotantes)

            console.log(usuarioVotantes.length)
            for(let i = 0; i < usuarioVotantes.length; i++){
                let nuevoRut = '';
                let rutAux = String(usuarioVotantes[i].RUT);
                
                console.log(rutAux);
                console.log(typeof(rutAux));
                for(let j = 0; j < 9; j++){
                    if(j === 2 || j === 5 ){
                        nuevoRut = nuevoRut + '.' + rutAux[j];
                    }
                    else if(j === 8){
                        nuevoRut = nuevoRut + '-' + rutAux[j];
                    }
                    else{
                        nuevoRut = nuevoRut + rutAux[j];
                    }
                    
                }
                console.log(nuevoRut);
                usuarioVotantes[i].RUT = nuevoRut;
                
            }
            console.log(usuarioVotantes)

            setDataUsuariosVotantes(usuarioVotantes)
        })
        .catch (error=> {
          //setIdVotacion(0)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
          })
        })
    };


    const getUsuarioVotantesGlobal = async () =>{
        await axios.get(serverUrl + "/usuariosVotante")
          .then(response=>{
            setDataUsuariosVotantes(response.data)
        })
        .catch (error=> {
          //setIdVotacion(0)
          console.log(error)
          /* Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
          }) */
        })
    };


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
            title: '¿Esta seguro de cerrar la votación?',
            text: "Una vez cerrada la votación nadie más podra votar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, cerrar votación!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                let estado = 0;
                updateEstadoVotacion(idVot, idUsuario, estado)

                Swal.fire(
                    'Votación cerrada!',
                    'Su votación ha sido finalizada',
                    'success'
                )
              
            }
            

            else{
                window.location.reload(true);
            }
          })

        
          
    }

    const segundoSwal = async(idVot, estado, porcentaje, seguraX) => {
        var dataUserVotantes = dataUsuarioVotantes.filter((e) => e.ID_VOTACION === idVot);

        console.log(estado, porcentaje, seguraX)

        // creamos la funcion del estado especial
        if(estado === 1){
            //alert('Estado 1')
            // necesito el total de votos
            let totalVotos = 0;
            let usuarios = [];
            let calculoPorcentaje = 0;

            await axios.get(serverUrl + "/preguntasConRespuestas", {params:{idVotacion: idVot}})
            .then(response=>{
            //setPreguntas(response.data);
            var data = response.data;

            console.log(data);

            data.forEach((e) => {
                totalVotos += e.VOTOS;
            })
            console.log(totalVotos)

            // necesito ordenar las respuestas por votos y ver si el primero le gana al segundo por el porcentaje ingresado
            data.forEach((e) => {
                usuarios.push({nombre: e.RESPUESTA, cantidadVotos: e.VOTOS, isCheck: true})
            })

            console.log(usuarios)

            //necesitamos ordenar el arreglo por votos
            usuarios.sort(((a, b) => b.cantidadVotos - a.cantidadVotos));

            console.log(usuarios)

            // necesito verificar si el primer usuario le gana al segundo por el porcentaje ingresado

            calculoPorcentaje = totalVotos*(porcentaje/100);

            console.log(calculoPorcentaje)

            if( usuarios[0].cantidadVotos >= calculoPorcentaje ){
                Swal.fire(
                    'Votación cerrada!',
                    'La votación cumple con los requisitos estipulados!',
                    'success'
                )
                
                // si se cumple cerrar votacion
                cerrarVotacion(idVot, estado)

            }
            else{
                Swal.fire(
                    'Votación fallida!',
                    'La votación no cumple con los requisitos estipulados!',
                    'error'
                )

                setTimeout(function () {   
                    setDataModalEspecial(usuarios)
                    setPorcentajeModal(porcentaje)
                    setTituloPregEspecial(response.data[0].TITULO)
                    setIdVotacionEspecial(idVot)
                    setSegura(seguraX)
                    setUsuarioVotantesVotEsp(dataUserVotantes)
                    
                    setModalEspecial(true); 
                }, 2500);
                // si no se cumple crear la nueva votacion mostrandole al usuario los usuarios disponible.
                
            }


        })
        .catch (error=> {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.message,
            })
        })

        }

        else{

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
                    text: "¿Desea crear una nueva votación para desempatar las preguntas afectadas?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, crear la nueva votación!',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {


                        Swal.fire({
                            title: "Ingrese el titulo para su nueva votación!",
                            text: "Titulo de votación",
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
                                    'Votación creada!',
                                    'Su votación ha sido creada con éxito',
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
                            'Votación creada!',
                            'Su votación ha sido creada con éxito',
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
            obtenerTipoVotacion(tituloNuevo, id)
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

    const obtenerTipoVotacion = async(tituloNuevo, id) => {
        await axios.get(serverUrl + "/votacionById", {params:{idVotacion: idVotacion}})
            .then(response=>{
            var tipoVot = response.data[0].tipo;
            //setLoading(true);
            console.log("trae esto getVotaciones ojo:");
            console.log(response.data[0]);

            const usuariosAcopiar = dataUsuarioVotantes.filter(e => e.ID_VOTACION === id)
                
                if(usuariosAcopiar.length > 0){
                    createVotacion(tituloNuevo, tipoVot, 1)
                }

            //creo la nueva votacion con el titulo nuevo y el tipo
            createVotacion(tituloNuevo, tipoVot, 0)
        })
        .catch (error=> {
            Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            })
        })
    }


    const createVotacion = async (tituloVotacion, tipoVot, segura) =>{
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
            porcentaje: 0,
            segura: segura,
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

    const createPreguntaLote = async (preguntasAgregar) =>{
        console.log(preguntasAgregar)

    
        await axios({
          method: 'post',
          url:serverUrl + "/preguntaCreateLote",
          headers: {'Content-Type': 'application/json'},
          data: preguntasAgregar,
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
            title: '¿Esta seguro de empezar la votación?',
            text: "Una vez empezada la votación nadie más podra ser ingresado como respuesta",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, empezar votación!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                updateEstadoVotacion(idVot, idUsuario, estado)

                Swal.fire(
                    'Votación iniciada!',
                    'Su votación ha sido inicializada con éxito!',
                    'success'
                )
              
            }

            
          })
    }

    const copiarVotacio = (idVotacionCop, estado, tipo )=> {
        //console.log( e)
        /* if(estado === 1){
            alert(' copiar normal')
        }

        if(estado === 0){
            alert(' copiar y preguntar la cantidad de personas para la siguiente ronda')
        } */
        Swal.fire({
            title: '¿Esta seguro de copiar la votación?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, copiar votación!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            var idVot = idVotacion + 1;
            if (result.isConfirmed && (estado === 1 || estado === 2)) {

                console.log('estamos aqui?')
                console.log(idVot)

                const usuariosAcopiar = dataUsuarioVotantes.filter(e => e.ID_VOTACION === idVotacionCop)


                let promesas = [];

                if(usuariosAcopiar.length > 0){
                    promesas.push(getTituloCopia(idVotacionCop, 1));
                    //getTituloCopia(idVotacionCop, 1)
                }
                else {
                    promesas.push(getTituloCopia(idVotacionCop, 0));
                    //getTituloCopia(idVotacionCop, 0)
                }

                promesas.push(copiarPregYresp(idVotacionCop, 0));
                //copiarPregYresp(idVotacionCop, 0)

                var dataUserVotantesPorLote = [];

                                
                if(usuariosAcopiar.length > 0){
                    for(let i = 0; i < usuariosAcopiar.length; i++){
                        dataUserVotantesPorLote.push({NOMBRE: usuariosAcopiar[i].NOMBRE, RUT: usuariosAcopiar[i].RUT, idVotacion: idVot, validacion: 1})
                        //crearUsuarioVotante(listaParticipantes[i].nombre, listaParticipantes[i].rut, idVot)
                    }
                    promesas.push(crearUsuarioVotante(dataUserVotantesPorLote));
                    //crearUsuarioVotante(dataUserVotantesPorLote)     
                }

                Promise.all(promesas)
                .then(() => {
                    Swal.fire(
                        'Votación copiada!',
                        'Su votación ha sido copiada con éxito!',
                        'success'
                    )
                    setTimeout(function () {
                        //window.location.reload()
                        window.location.reload(true);
                    }, 2000);
                })
                .catch((error) => {
                    console.log(error);
                });
              
            }
            if(result.isConfirmed && estado === 0 && tipo !== 'normal'){
                

                Swal.fire({
                    title: "Ingrese el numero de respuesta para la siguiente ronda!",
                    text: "Numero de usuarios para la siguiente ronda!",
                    input: 'text',
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Continuar',
                    
                    showCancelButton: true,  
                    inputValidator: (value) => {
                        if (!value) {
                        return 'El campo de la cantidad de usuarios es obligatorio!'
                        }    
                    }  
                }).then((result) => {
                    if (result.value !== "" && result.value !== undefined && Number.isInteger( parseInt(result.value)) === true) {
                        
                        // se llama la funcion de crear la votacion 
                        
                        const usuariosAcopiar = dataUsuarioVotantes.filter(e => e.ID_VOTACION === idVotacionCop)

                        let promesas = [];
                
                        if(usuariosAcopiar.length > 0){
                            promesas.push(getTituloCopia(idVotacionCop, 1));
                            //getTituloCopia(idVotacionCop, 1)
                        }
                        else {
                            promesas.push(getTituloCopia(idVotacionCop, 0));
                            //getTituloCopia(idVotacionCop, 0)
                        }

                        promesas.push(copiarPregYresp(idVotacionCop, result.value));

                        var dataUserVotantesPorLote = [];

                                
                        if(usuariosAcopiar.length > 0){
                            for(let i = 0; i < usuariosAcopiar.length; i++){
                                dataUserVotantesPorLote.push({NOMBRE: usuariosAcopiar[i].NOMBRE, RUT: usuariosAcopiar[i].RUT, idVotacion: idVot, validacion: 1})
                                //crearUsuarioVotante(listaParticipantes[i].nombre, listaParticipantes[i].rut, idVot)
                            }
                            promesas.push(crearUsuarioVotante(dataUserVotantesPorLote));
                            //crearUsuarioVotante(dataUserVotantesPorLote)     
                        }


                        Promise.all(promesas)
                        .then(() => {
                            Swal.fire(
                                'Votación copiada!',
                                'Su votación ha sido copiada con éxito!',
                                'success'
                            )
                            setTimeout(function () {
                                //window.location.reload()
                                window.location.reload(true);
                            }, 2000);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                        
                        
                        
                    }
                })
                
                

                
            }})
    }

    const getTituloCopia = async (idVotacionCopia, segura) =>{
        await axios.get(serverUrl + "/votacionById", {params:{idVotacion: idVotacionCopia}})
            .then(response=>{
    
            console.log(response.data[0])
            var tituloCopia = response.data[0].TITULO + ' (copia)';
            let tipoVot = response.data[0].tipo;
            createVotacionCopia(tituloCopia, tipoVot, segura)
            
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

    const createVotacionCopia = async (tituloVotacion, tipoVot, segura) =>{
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
            porcentaje: 0,
            segura: segura,
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

    const copiarPregYresp = async(idVot, cantidadRespuestas) => {
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

            /* console.log(newPregYresp)
            console.log(newPregYresp[0].respuesta) */

            newPregYresp[0].respuesta.sort((a,b) => {
                if(a.votos > b.votos) {
                    return -1;
                }
        
                if(a.votos < b.votos) {
                    return 1;
                }
        
                return 0;
            })

            console.log(newPregYresp)
            let preguntasAgregar = [];
            let respuestasAgregar = [];
            let idVotCorrecto = idVot + 1;
            let idPreguntaGlobal = idPreguntaInsert;

            if(cantidadRespuestas === 0){
                newPregYresp.forEach((k) =>{
                    idPreguntaGlobal++
                    preguntasAgregar.push({idVotacion: idVotCorrecto, titulo: k.tituloPreg, idPregunta: idPreguntaGlobal})
                    //createPregunta(k.tituloPreg)
                    k.respuesta.forEach((r) => {
                        //createResp(r.respuesta)
                        respuestasAgregar.push({idPregunta: idPreguntaGlobal, respuestas: r.respuesta})
                    })
                })

                createPreguntaLote(preguntasAgregar)
                if(respuestasAgregar.length >0){
                    createRespLote(respuestasAgregar)
                }

            }
            else{
                newPregYresp.forEach((k) =>{
                    //createPregunta(k.tituloPreg)
                    idPreguntaGlobal++
                    preguntasAgregar.push({idVotacion: idVotCorrecto, titulo: k.tituloPreg, idPregunta: idPreguntaGlobal})
                    if(cantidadRespuestas > k.respuesta.length){
                        k.respuesta.forEach((r) => {
                            //createResp(r.respuesta)
                            respuestasAgregar.push({idPregunta: idPreguntaGlobal, respuestas: r.respuesta})
                        })   
                        if(respuestasAgregar.length > 0){
                            createRespLote(respuestasAgregar)

                        }
                    }
                    else{
                        for(let i = 0; i < cantidadRespuestas; i++) {
                            respuestasAgregar.push({idPregunta: idPreguntaGlobal, respuestas: k.respuesta[i].respuesta})
                        }
                        if(respuestasAgregar.length > 0){
                            createRespLote(respuestasAgregar)
                        }
                    }
                    
                })

                createPreguntaLote(preguntasAgregar)

            }
            console.log(preguntasAgregar)
            console.log(respuestasAgregar)

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
            title: '¿Esta seguro de editar la votación?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, editar votación!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                getTipoVotEditar(idVotacion)
                
                /* Swal.fire(
                    'Votación copiada!',
                    'Su votación ha sido copiada con éxito!',
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

    //funcion para crear al usuario votante por lote
    const crearUsuarioVotante =  async (usuarioVotantes) =>{  
        console.log(usuarioVotantes) 
        await axios({
            method: 'post',
            url:serverUrl + "/usuarioVotanteCreateLote", 
            headers: {'Content-Type': 'application/json'},
            data: usuarioVotantes, 
        }).then(response=>{
            
        })
        
        .catch(error=>{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El usuario ya existe',
            })
        })
    }

    //funcion para crear respuestas por lote
    const createRespLote =  async (respuestasAdd) =>{  
        console.log(respuestasAdd) 
        await axios({
            method: 'post',
            url:serverUrl + "/respuestaCreateLote", 
            headers: {'Content-Type': 'application/json'},
            data: respuestasAdd, 
        }).then(response=>{
            
        })
        
        .catch(error=>{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El usuario ya existe',
            })
        })
    }

    
    const verVotacion = (idVota, idPregu )=> {
        
        console.log(idVota, idPregu)
        window.location.replace(`/verVotacion/${idVota}/${idPregu}`)

    }

    
    
  return (
    <div id='contenedorMisVotaciones'>
        <MyNavbar activeKey='/misVotaciones'/>{/* 
        <Button onClick={() => window.location.replace('https://www.instagram.com/aquaglup/?hl=es{AQUI}')}>IR A INSTA</Button> */}
        <div id='contenedorMisVotacionesSecundario'>
            <h1 id='tituloMisVotaciones'>              
                Seleccione una opción de las votaciones disponibles
            </h1>
            <div id='contenedorMisVotacionesData'>
                <Table striped bordered hover variant="dark" id='tabla'>
                    <thead>
                        <tr>
                            <th className='columnaTablaTitulo' id='centrarTitulosColumnas'>Nombre Votación</th>
                            <th className='columnaTablaFunciones' id='centrarTitulosColumnas'>Editar/Copiar Votación</th>
                            <th className='columnaTablaFunciones' id='centrarTitulosColumnas'>Eliminar Votación</th>
                            <th className='columnaTablaFunciones' id='centrarTitulosColumnas'>Compartir Votación</th>
                            <th className='columnaTablaVisualizarResult' id='centrarTitulosColumnas'>Resultados Votación</th>
                            <th className='botonesTablaCerrarVotacion' id='centrarTitulosColumnas'>Opciones Votación</th>
                            <th className='columnaTablaEstado' id='centrarTitulosColumnas'>Estado Votación</th>
                        </tr>
                    </thead>
                </Table>
                
                {
                    
                    misVotaciones.map((e) => (
                        <Table striped bordered hover variant="dark" id='tabla'>

                            
                            <tbody>
                            <tr>
                                <td className='columnaTablaTitulo'>{e.titulo}</td>
                                
                                {e.estado === 2 ?(
                                <td className='columnaTablaFunciones'> 
                                    <MdAutorenew id='iconoEditar' onClick= {() => editarVotacion(e.id_votacion)}/>
                                    <button className='botonesTabla' onClick= {() => editarVotacion(e.id_votacion)}>
                                        Editar
                                    </button> 
                                </td>): e.estado === 1 ?(
                                    <td className='columnaTablaFunciones'> 
                                        <MdRemoveRedEye id='iconoEditar' onClick= {() => copiarVotacio(e.id_votacion, e.estado, e.tipo)}/>
                                        <button className='botonesTabla' onClick= {() => verVotacion(e.id_votacion, e.estado, e.tipo)}>
                                            Ver
                                        </button> 
                                    </td>
                                ) : (

                                    <td className='columnaTablaFunciones'> 
                                        <MdOutlineContentCopy id='iconoEditar' onClick= {() => copiarVotacio(e.id_votacion, e.estado, e.tipo)}/>
                                        <button className='botonesTabla' onClick= {() => copiarVotacio(e.id_votacion, e.estado, e.tipo)}>
                                            Copiar
                                        </button> 
                                    </td>
                                    )}

                                
                                <td className='columnaTablaFunciones'>
                                    <MdDeleteForever id='iconoEliminar' onClick= {() => confirmacionEliminarVotacion(e.id_votacion)}/>
                                    <button className='botonesTabla' onClick= {() => confirmacionEliminarVotacion(e.id_votacion)}>
                                        Eliminar
                                    </button> 
                                </td>
                                <td className='columnaTablaFunciones'>
                                    <MdShare id='iconoCompartir' onClick= {() => handleModal(e.id_votacion, e.estado, e.tipo)}/>
                                    <button className='botonesTabla' onClick={() => handleModal(e.id_votacion, e.estado, e.tipo)}>
                                        Compartir
                                    </button> 
                                </td>
                                <td className='columnaTablaVisualizarResult'>
                                    <div id='divVisualizarResult'>
                                        <MdPieChart id='iconoVisualizarResultado' onClick= {() => handleModalResult(e.id_votacion, e.titulo, e.estado)}/>
                                        <button className='botonesTabla' onClick= {() => handleModalResult(e.id_votacion, e.titulo, e.estado)}>
                                            Visualizar resultados
                                        </button> 
                                    </div>
                                    
                                </td>

                                {e.estado === 1 ?
                                    <>
                                        <td className='botonesTablaCerrarVotacion'>
                                            <div id='divCerrarVot'>
                                                <MdRule id='iconoCerrarVotacion' onClick= {() => segundoSwal(e.id_votacion, e.estado, e.porcentaje, e.segura)}/>
                                                <button className='botonesTabla' onClick= {() => segundoSwal(e.id_votacion, e.estado, e.porcentaje, e.segura)}>
                                                    Cerrar votación
                                                </button> 
                                            </div>
                                            
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
                                                <div id='divEmpezarVot'>
                                                    <MdRule id='iconoCerrarVotacion' onClick= {() => empezarVotacion(e.id_votacion, e.estado)}/>
                                                    <button className='botonesTabla' onClick= {() => empezarVotacion(e.id_votacion, e.estado)}>
                                                        Empezar Votación
                                                    </button> 
                                                </div>
                                                
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
                                            <div id= 'divCerrarVot'>
                                                <MdRule id='iconoCerrarVotacion' onClick= {() => segundoSwal(e.id_votacion, e.estado, e.porcentaje, e.segura)}/>
                                                <button className='botonesTabla' onClick= {() => segundoSwal(e.id_votacion, e.estado, e.porcentaje, e.segura)}>
                                                    Cerrar votación
                                                </button> 
                                            </div>  
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
            estado= {estadoVotacion}
            dataUsuariosVot={dataUsuarioVotantes}
        />

        <ModalVotEspecial
            show={modalEspecial}
            onHide={() => setModalEspecial(false)}
            data ={dataModalEspecial}
            porcentaje={porcentajeModal}
            tituloPregEspecial={tituloPregEspecial}
            idVotacion = {idVotacionEspecial}
            segura = {segura}
            dataUsuariosVotantes = {usuarioVotantesVotEsp}
        />
    
    </div>
  )
}

export default MisVotaciones