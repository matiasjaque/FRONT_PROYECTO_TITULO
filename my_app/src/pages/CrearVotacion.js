import React, { useEffect, useState} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';

import { useParams } from 'react-router-dom';


import MyNavbar from '../componts/MyNavbar';

import '../styles/CrearVotacion.css'

import { AiFillCloseCircle } from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";

import axios from 'axios';
import Cookies from 'universal-cookie';


import Swal from 'sweetalert2';

const onlyLettersPattern = /^[a-zA-Z0-9?¿!¡ ()áéíóúñÁÉÍÓÚÑ]+$/;

const serverUrl = process.env.REACT_APP_SERVER;
const conectado = new Cookies();


var idUsuario = conectado.get('id');
var controlador = 1;
var tieneVotaciones = false;
var tieneVotacionesFunc = 0;

//console.log(tieneVotaciones)

const CrearVotaciones = () => {
  const {tipo} = useParams();
  const {idVotacion} = useParams();
  

  const [tituloVotacion, setTituloVotacion] = useState('');
  const [idVotacionLocal, setIdVotacionLocal] = useState(1);

  
  const [cantidadPreg, setCantidadPreg] = useState(0);
  const [cantidadResp, setCantidadResp] = useState(0);

  const [respuestas, setRespuestas] = useState([]);
  const [preguntas, setPreguntas] = useState([]);

  const [respuestasEdit, setRespuestasEdit] = useState([]);
  const [preguntasEdit, setPreguntasEdit] = useState([]);

  const [respuestasAdd, setRespuestasAdd] = useState([]);
  const [preguntasAdd, setPreguntasAdd] = useState([]);

  const [respuestasDelete, setRespuestasDelete] = useState([]);
  const [preguntasDelete, setPreguntasDelete] = useState([]);
  var preguntasDemo = [];
  var respuestasDemo = [];

  
  var idRespuesta = 0;

  const [idResp, setIdResp] = useState(0)
  const [idPreg, setIdPreg] = useState(0)

  const [idPregInsert, setIdPregInsert] = useState(0)

  const [activarLista, setActivarLista] = useState(false);

  const [listaParticipantes, setListaParticipantes] = useState([]);


  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');

 



  var idPreguntaInsert = idPregInsert;
  


  const [datosVotacion, setDatosVotacion] = useState(false);
  

  var controladorFunc = 0;

  // funciones que necesito cargar en cada render
  useEffect(() => {

    if(tieneVotacionesFunc === 0){
      verificarSiTieneVotaciones();
    }
    

    if (tieneVotaciones === true && controladorFunc === 0){
      actualizarIdVotacion();
      actualizarIdPreguntas();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      controladorFunc = 1;
    }

    if(tipo === 'normal' && controlador === 1){
      obtenerTituloVot();
      obtenerTituloPreg();	
      preguntasConRespuestasGet()
      actualizarIdPreguntas();
      controlador = 0;
  }

    else{
      actualizarIdVotacionGeneral();
      actualizarIdPreguntas();
    }


    
  }, [controladorFunc]);


const verificarSiTieneVotaciones = async() => {
  tieneVotacionesFunc = 1;
  console.log("esto solo una vez")
	await axios.get(serverUrl + "/votaciones", {params:{idUsuario: idUsuario}})
    .then(response=>{
      setIdVotacionLocal(response.data[response.data.length - 1].id_votacion)
      //setLoading(true);
      console.log("trae esto getVotaciones:");
      console.log(response.data[response.data.length - 1].id_votacion);
      tieneVotaciones = true;
  }).catch (error=> {
            tieneVotaciones = false;
            setIdVotacionLocal(0);
            /* Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            }) */
        })

}

  
const obtenerTituloVot = async() => {
	await axios.get(serverUrl + "/votacionById", {params:{idVotacion: idVotacion}})
            .then(response=>{
    
            console.log(response.data[0])
            let tituloGet = response.data[0].TITULO;
            setTituloVotacion(tituloGet);
            
        })
        .catch (error=> {
            Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            })
        })
}

const obtenerTituloPreg = async() => {
	await axios.get(serverUrl + "/preguntasGet", {params:{idVotacion: idVotacion}})
            .then(response=>{
    
            console.log(response.data)
            setCantidadPreg(response.data.length);
            let idPregUsar = response.data[0].id_pregunta;
			//setIdPregEditar(response.data[0].id_pregunta)
            //setPreguntaVotacion(tituloGet);
            obtenerResp(idPregUsar)
            
        })
        .catch (error=> {
            Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            })
        })
}

const obtenerResp = async(idPregUsar) => {
	await axios.get(serverUrl + "/respuestasGet", {params:{idPregunta: idPregUsar}})
            .then(response=>{
    
            console.log(response.data)
            setCantidadResp(response.data.length);
            
            
        })
        .catch (error=> {
            Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            })
        })
}

const preguntasConRespuestasGet = async () =>{
    await axios.get(serverUrl + "/preguntasConRespuestas", {params:{idVotacion: idVotacion}})
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

        // obtener las respuestas antes de que se editen
        var newRespGen = []
        newPregYresp.forEach((p) => {
            console.log(p)
            
            p.respuesta.forEach((r) => {
                newRespGen.push(r)    
            })
        })


        //setLoading(true);
        //setRespuestasGen(newRespGen)
        setRespuestas(newRespGen)
        setPreguntas(newPregYresp);
        setDatosVotacion(true);
    })
    .catch (error=> {
        Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
        })
    })
};


const actualizarIdVotacion = async () =>{
    await axios.get(serverUrl + "/votaciones", {params:{idUsuario: idUsuario}})
      .then(response=>{
        setIdVotacionLocal(response.data[response.data.length - 1].id_votacion)
        //setLoading(true);
        console.log("trae esto getVotaciones:");
        console.log(response.data[response.data.length - 1].id_votacion);
    })
    .catch (error=> {
      setIdVotacionLocal(0)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
      })
    })
};

const actualizarIdVotacionGeneral = async () =>{
  await axios.get(serverUrl + "/votacionesGenerales")
    .then(response=>{
      setIdVotacionLocal(response.data[response.data.length - 1].ID_VOTACION)
      //setLoading(true);
      /* console.log("trae esto getVotacionesGlobal:");
      console.log(response.data)
      console.log(response.data[response.data.length - 1].ID_VOTACION); */
  })
  .catch (error=> {
    setIdVotacionLocal(0)
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.response.data.message,
    })
  })
};

const actualizarIdPreguntas = async () =>{
    await axios.get(serverUrl + "/preguntasGetGlobal")
      .then(response=>{
        setIdPreg(response.data[response.data.length - 1].ID_PREGUNTA)
        
        setIdPregInsert(response.data[response.data.length - 1].ID_PREGUNTA)
        //setLoading(true);
        //console.log("trae esto getPreguntas:");
        //console.log(response.data[response.data.length - 1].ID_PREGUNTA);
    })
    .catch (error=> {
      setIdPreg(0)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
      })
    })
};


const volverHome = () =>{
    window.location.replace('/misVotaciones')
}

  //funcion que inicializa la votacion con los datos ingresados por el usuario
  const continuarVotacion = () =>{
    setDatosVotacion(false);
    var idPregunta = idPreg;
    //setPreguntas()
    // validos todos los parametros y que preguntas no tenga datos
    if(tituloVotacion !== null && cantidadPreg > 0  && cantidadResp > 0 && preguntasDemo.length === 0 && respuestasDemo.length === 0) {
      //console.log('cantidadPreg ' + cantidadPreg); 
      //console.log('preguntasDemo length ' + preguntasDemo.length);
      //var cantPreg = preguntasDemo.length;
      
      for(let i = 0; i < cantidadPreg; i++){
        //preguntasDemo.push(i+1);
        //console.log('hola')
          preguntasDemo.push(
          {
            id: idPregunta + 1,
            tituloPregunta: '',
            respuestas : [],
          })
          for (let j = 0; j < cantidadResp; j++){
            respuestasDemo.push({
              idPregunta: idPregunta + 1,
              idRespuesta: idRespuesta,
              tituloRespuesta: '',
            })
            idRespuesta ++;
          }
        //console.log('id de pregunta: ' + idPregunta);
        
        idPregunta ++;
      }
      setIdResp(idRespuesta)
      setIdPreg(idPregunta)

      for (let i = 0; i <cantidadPreg; i++){
        
        for (let j = 0; j <respuestasDemo.length; j++){

          //console.log(preguntasDemo[i].id + ' === ' + respuestasDemo[j].idPregunta)
          if (preguntasDemo[i].id === respuestasDemo[j].idPregunta){
            preguntasDemo[i].respuestas.push({
              idRespuesta: respuestasDemo[j].idRespuesta,
              tituloRespuesta: respuestasDemo[j].tituloRespuesta,
              idPregunta: respuestasDemo[j].idPregunta,
            })
          }
        }
      }
      /* console.log('preguntasDemo ');
      console.log(preguntasDemo);
      console.log('respuestasDemo ');
      console.log(respuestasDemo); */
      
      setPreguntas(preguntasDemo);
      setRespuestas(respuestasDemo);

      //idPreguntaFinal = preguntas[preguntas.length-1].id;
      setDatosVotacion(true);/* 
      console.log(datosVotacion);
      console.log('preguntas de abajo ');
      console.log(preguntasDemo);
      console.log('largo preguntasDemo ' + preguntasDemo.length);
      prueba.push('2') */
      
  
      //console.log('largo de prueba 1 ' + prueba.length);
    }

    else{
        alert("todos los parametros son obligatorios");
    }
  }


  // funcion para eliminar una pregunta de la votacion

  const eliminarPregunta = (idPregu) => {
    setDatosVotacion(false);
    /* console.log("id preg: " );
    console.log(idPreg)

    console.log('cantidad de preg antes: ')
    console.log(cantidadPreg); */

    const newPreguntas = preguntas.filter((preg) => preg.id !== idPregu);


    const newResp = respuestas.filter((resp) => resp.idPregunta !== idPregu);


    /* console.log('newResp');
    console.log(newResp); */

    setPreguntas(newPreguntas);
    setRespuestas(newResp);

    setCantidadPreg(cantidadPreg - 1);

    document.getElementById('cantPreg').value = cantidadPreg;

    /* console.log('cantidad de preg desp: ')
    console.log(cantidadPreg); */

    setDatosVotacion(true);

  }

  const eliminarRespuesta = (idResp, idPreg) => {
    setDatosVotacion(false);
    


    const newPreguntas = preguntas.map((pregunta) => {
    const newRespuestas = respuestas.filter((respu) => (respu.idRespuesta !== idResp && respu.idPregunta === pregunta.id ));
    //console.log(newRespuestas);
       if (pregunta.id === idPreg) {

        return {
          ...pregunta,
          respuestas: newRespuestas,
        }
       }
       return pregunta

    })

    
    const newRespuestas2 = respuestas.filter((respu) => respu.idRespuesta !== idResp);

    setRespuestas(newRespuestas2);
    setPreguntas(newPreguntas);
    //console.log(preguntas)

    setDatosVotacion(true);
  }


  

  const agregarRespuesta = (idPregunta) => {
    setDatosVotacion(false);

    const newResp = {
      idPregunta: idPregunta,
      idRespuesta: idResp,
      tituloRespuesta: '',
    }

    setRespuestas([...respuestas, newResp])

    //console.log('resp IMPORTANT NO ESTA SET')
    //console.log(respuestas)
      
    setIdResp(idResp + 1)

      const newRespuestas = respuestas.filter((respu) => (respu.idPregunta === idPregunta));
      newRespuestas.push(newResp)
      //console.log('newRespuestas');

      //console.log(newRespuestas);

      const newPreguntas = preguntas.map((preg) => {
      if(preg.id === idPregunta){
        return {
          ...preg,
          respuestas: newRespuestas,
        }
      }
      return preg
    })
    /* console.log('newPreguntas')
    console.log(newPreguntas) */
    setPreguntas(newPreguntas)
    setDatosVotacion(true);

  }

  // funcion para agregar preguntas a la votacion
  const agregarPregunta = (idPregu) =>{

    setDatosVotacion(false);

    console.log(idPreg);
    console.log(idResp);

    const newResp = {
      idPregunta: idPreg + 1,
      idRespuesta: idResp,
      tituloRespuesta: '',
    }

    setRespuestas([...respuestas, newResp]);

    const newPreg = {
        id: idPreg + 1,
        tituloPregunta: '',
        respuestas : [
          newResp
        ]
    };
    console.log(newPreg)
    var newPreguntas = [];

    preguntas.map((preg) => {
      console.log( preg.id + ' === ' + idPregu) 
      if(preg.id === idPregu){
        return(
          newPreguntas.push(preg),
          newPreguntas.push(newPreg)
        )
      }
      return newPreguntas.push(preg);
    })
    console.log(newPreguntas)
 
    setIdResp(idResp + 1)
    setIdPreg(idPreg + 1)

    setPreguntas(newPreguntas)

    //setCantidadPreg(cantidadPreg + 1);
    var newCantPreg = Number(cantidadPreg) + 1;
    setCantidadPreg( newCantPreg );
    console.log(cantidadPreg)

    document.getElementById('cantPreg').value = newCantPreg;

    setDatosVotacion(true);
    console.log('termino')
  }

  // funcion para actualizar los titulos

  const updateTitulos = (idPregu, newTitle) => {
    setDatosVotacion(false);
    console.log('updateTitulos')
    console.log(idPregu, newTitle);

    const newPreguntas = preguntas.map((preg) => {
        /* console.log(preg.id);
        console.log(idPregu); */
        if(preg.id === idPregu){
            return {
            ...preg,
            tituloPregunta: newTitle,
            }
        }
        return preg
    })

    setPreguntas(newPreguntas)
    setDatosVotacion(true);

  }

  // funcion para actualizar los titulos de editar

  const updateTitulosEditar = (idPregu, newTitle) => {

    let tituloEdit = {idPregunta: idPregu, titulo: newTitle, idVotacion: idVotacion}

    setPreguntasEdit([...preguntasEdit, tituloEdit])

  }

  //funcion para actualizar los titulos de respuestas
  
  const updateTitulosResp = (idRespu, idPregu, newTitleResp) => {
    setDatosVotacion(false);
  /*   console.log('datos de la funcion: ')
    console.log(idRespu);
    console.log(idPregu);
    console.log(newTitleResp); */


    // actualizar las respuestas generales
    const newRespuestas = respuestas.map((resp) => {
      //console.log(resp.idRespuesta + ' === ' + idRespu);
      if(resp.idRespuesta === idRespu){
        return {
          ...resp,
          tituloRespuesta: newTitleResp,
        }
      }
      return resp;
    })
    /* console.log('newRespuestas')
    console.log(newRespuestas) */
    setRespuestas(newRespuestas);


    // juntar las nuevas respuestas

    const newResp = newRespuestas.filter((resp) => (resp.idPregunta === idPregu));

    /* console.log('newResp')
    console.log(newResp) */

    //actualizar el titulo de respuesta de las preguntas

    const newPreguntas = preguntas.map((preg) => {

      if(preg.id === idPregu){
        return {
          ...preg,
          respuestas: newResp
          }
            
      }

      return preg
    })

    /* console.log('newPreguntas')
    console.log(newPreguntas) */
    setPreguntas(newPreguntas);
    setDatosVotacion(true);


  }

  //funcion para actualizar los titulos de respuestas
  
  const updateTitulosRespEditar = (idRespu, idPregu, newTitleResp) => {
    let respEdit = {idPregunta: idPregu, respuestas: newTitleResp, idRespuesta: idRespu}

    setRespuestasEdit([...respuestasEdit, respEdit])

  }

  const createVotacion = async (segura) =>{
    var idVot = idVotacionLocal + 1;
    var estado = 2;
    var porcentaje = 0;
    console.log(idUsuario, tituloVotacion, idVot, porcentaje)
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
        tipo: 'normal',
        porcentaje: porcentaje,
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

  const createPreguntasYrespuestas = (idVot) => {
    console.log(preguntas.length)

    var titulosPregVacios = 0;

    var titulosRespVacios = 0;
  
    for (let i = 0; i < preguntas.length; i++) {
      if (preguntas[i].tituloPregunta === '' || preguntas[i].tituloPregunta === undefined){
        titulosPregVacios++;
      }
    }

    for (let i = 0; i < respuestas.length; i++) {
      if (respuestas[i].tituloRespuesta === '' || respuestas[i].tituloRespuesta === undefined){
        titulosRespVacios++;
      }
    }

    let preguntasAgregar = [];
    let idVotCorrecto = idVot;
    let idPreguntaGlobal = idPreguntaInsert;

    let respuestasAgregar = [];
    console.log(preguntas)

    if(titulosPregVacios === 0){
      if(titulosRespVacios === 0){

        preguntas.forEach((k) =>{
          idPreguntaGlobal++
          preguntasAgregar.push({idVotacion: idVotCorrecto, titulo: k.tituloPregunta, idPregunta: idPreguntaGlobal})
          //createPregunta(k.tituloPreg)
          k.respuestas.forEach((r) => {
              //createResp(r.respuesta)
              respuestasAgregar.push({idPregunta: idPreguntaGlobal, respuestas: r.tituloRespuesta})
          })
      })

        console.log(preguntasAgregar)
        console.log(respuestasAgregar)
        createPreguntaLote(preguntasAgregar)
        createRespLote(respuestasAgregar)
         
      }
      else{
        alert('Debe asegurarse de que todas las preguntas tengan sus respuestas asociadas.');
      }

    } 

    else{
      alert('Debe asegurarse de que todas las preguntas tengan un titulo asociado.');
    }

  }


      

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


//funcion para crear respuestas por lote
const createRespLote =  async (respuestasAddLote) =>{  
  console.log(respuestasAddLote) 
  await axios({
      method: 'post',
      url:serverUrl + "/respuestaCreateLote", 
      headers: {'Content-Type': 'application/json'},
      data: respuestasAddLote, 
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


  //funcion que crea la votacion

  const crearVotacion = () => {
    let auxSwitch = document.getElementById('switchListaParticipantesVot1').checked;
    var idVot = idVotacionLocal + 1;

    if(tituloVotacion !== '' && preguntas.length > 0) {

      if(auxSwitch === true && listaParticipantes.length > 0){

        var dataUserVotantesPorLote = [];

        for(let i = 0; i < listaParticipantes.length; i++){
          dataUserVotantesPorLote.push({NOMBRE: listaParticipantes[i].nombre, RUT: listaParticipantes[i].rut, idVotacion: idVot, validacion: 1})
          //crearUsuarioVotante(listaParticipantes[i].nombre, listaParticipantes[i].rut, idVot)
        }

        // Ejecutar las tres peticiones al servidor de manera asíncrona
        Promise.all([
          createVotacion(1),
          createPreguntasYrespuestas(idVot),
          crearUsuarioVotante(dataUserVotantesPorLote)
        ]).then(() => {
          // Cuando todas las peticiones hayan finalizado, ejecutar estas acciones
          Swal.fire({
              title: 'Votación creada con éxito',
              icon: "success",
              timer: "2000"
          });
          setTimeout(function () {   
              //window.location.reload()
              window.location.replace('/misVotaciones');          
          }, 2000);
      });
        
      }

      else{
        Promise.all([
          createVotacion(0),
          createPreguntasYrespuestas(idVot),
        ]).then(() => {
          // Cuando todas las peticiones hayan finalizado, ejecutar estas acciones
          Swal.fire({
              title: 'Votación creada con éxito',
              icon: "success",
              timer: "2000"
          });
          setTimeout(function () {   
              //window.location.reload()
              window.location.replace('/misVotaciones');          
          }, 2000);
        });
      }

        
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe asegurarse de ingresar un titulo y preguntas para la nueva votación',
      })  
    }

  }

  
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

  const GuardarCambios = () =>{
    if (tituloVotacion !== null && cantidadPreg > 0 && cantidadResp > 0) {
      updateTituloVotacion();
      updateTituloPregLote(preguntasEdit);
      updateTituloResp(respuestasEdit);
    
      crearNuevasRespuestas();

      crearNuevasPreguuntas()
      
      eliminarRespControlador()

      eliminarPregControlador()
      
    
      Swal.fire({
        title: 'Votación editada con éxito',
        icon: "success",
        timer: "2000"
      });
    
      setTimeout(function () {   
        window.location.replace('/misVotaciones');          
      }, 2000);
    }
    
    else{
        alert('Debe asegurarse de ingresar un titulo y pregunta para la nueva votación')
    }
}

const crearNuevasRespuestas = () =>{
  console.log(respuestasAdd)
  console.log(preguntas)
  if(respuestasAdd.length > 0){
    createRespLote(respuestasAdd)
  }
}

const crearNuevasPreguuntas = () =>{
  console.log(preguntasAdd)
  
  if (preguntasAdd.length > 0) {
    createPreguntaLote(preguntasAdd);
  }
}

const eliminarRespControlador = () =>{
  console.log(respuestasDelete)
  
  if (respuestasDelete.length > 0) {
    eliminarRespuestaLote(respuestasDelete);
  }
}

const eliminarPregControlador = () =>{
  console.log(preguntasDelete);
  
  if (preguntasDelete.length > 0) {
    eliminarPreguntaLote(preguntasDelete);
  }
}



const updateTituloVotacion = async () => {
	
	await axios({
		method: 'put',
		url:serverUrl + "/votacionUpdate", 
		headers: {'Content-Type': 'application/json'},
		params:{idVotacion: idVotacion, idUsuario: idUsuario, titulo: tituloVotacion, porcentaje: 0}
	}).catch(error =>{
		alert(error.response.data.message);
		console.log(error);
	});
};


const updateTituloPregLote = async (preguntasUpdate) => {
	
	await axios({
		method: 'put',
		url:serverUrl + "/preguntaUpdateLote", 
		headers: {'Content-Type': 'application/json'},
		data: preguntasUpdate,
	}).catch(error =>{
		alert(error.response.data.message);
		console.log(error);
	});
};

const updateTituloResp = async (respEdit) => {
    console.log(respEdit)
	
	await axios({
		method: 'put',
		url:serverUrl + "/respuestaUpdateLote", 
		headers: {'Content-Type': 'application/json'},
		data: respEdit
	}).catch(error =>{
		alert(error.response.data.message);
		console.log(error);
	});
};

 

  const handleActivarLista = (e) => {
    setActivarLista(e.target.checked);
  };

  
const handleSubmit = (event) => {
  event.preventDefault();
  console.log(nombre, rut)
  console.log(rut.length)
  if(nombre !== null && nombre !== undefined && !nombre.match(onlyLettersPattern) === false && rut !== null && rut !== undefined && rut.length === 9){
    
    if(listaParticipantes.length === 0){
      let aux = {nombre: nombre.toUpperCase(), rut: rut}
  
      setListaParticipantes([...listaParticipantes, aux]);
      document.getElementById('nombreUserVotante').value = '';
      document.getElementById('rutUserVotante').value = '';
  
      setNombre('')
      setRut('');
    
      console.log(listaParticipantes)
    }

    else{
      // validar que el nombre o rut no esta ya en la lista

      let auxValidador = 0;

      for(let i = 0; i < listaParticipantes.length; i++){
        if(listaParticipantes[i].nombre === nombre.toUpperCase() || listaParticipantes[i].rut === rut){
          auxValidador++;
        }
      }

      if(auxValidador === 0){
        let aux = {nombre: nombre.toUpperCase(), rut: rut}
  
        setListaParticipantes([...listaParticipantes, aux]);
        document.getElementById('nombreUserVotante').value = '';
        document.getElementById('rutUserVotante').value = '';
    
        setNombre('')
        setRut('');
      
        console.log(listaParticipantes)
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'El participante ya esta en la lista!',
        })
      }

    }

    
  }

  else{
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Los parametros ingresados son invalidos',
    })
  }

  
};

const handleEliminar = (index) => {
  const nuevaListaParticipantes = [...listaParticipantes];
  nuevaListaParticipantes.splice(index, 1);
  setListaParticipantes(nuevaListaParticipantes);
};


  const capturarResp = async (idPreg) => {
    const { value: inputValue } = await Swal.fire({
      title: 'Ingrese la nueva respuesta',
      input: 'text',
      inputPlaceholder: 'Ingrese una respuesta',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Guardar',
      allowOutsideClick: false,
      inputValidator: (value) => {
        if (!value) {
          return 'Debe ingresar una respuesta';
        }
      }
    });

    if (inputValue) {
      setDatosVotacion(false);
      console.log(respuestas)
      console.log(preguntas)
  
      const newRespAdd = {
        idPregunta: idPreg,
        respuestas: inputValue,
      };
  
      const RespAdd = [...respuestasAdd, newRespAdd]
  
      const newResp = {
        idPreg: idPreg,
        idResp: idResp,
        respuesta: inputValue,
      };
  
  
      const newRespuestasGlobal = [...respuestas, newResp];
  
      const newRespuestas = respuestas.filter((respu) => (respu.idPreg === idPreg));
      console.log(newRespuestas);
      console.log(respuestasAdd)
  
        newRespuestas.push(newResp)
        //console.log('newRespuestas');
  
        //console.log(newRespuestas);
  
        const newPreguntas = preguntas.map((preg) => {
        if(preg.idPregunta === idPreg){
          return {
            ...preg,
            respuesta: newRespuestas,
          }
        }
        return preg
      })
  
  
  
      setRespuestas(newRespuestasGlobal);
      setPreguntas(newPreguntas);
      setIdResp(idResp + 1);
      setDatosVotacion(true);
      setRespuestasAdd(RespAdd);
    }
  }


  const capturarPreg = async () => {
    const { value: inputValue } = await Swal.fire({
      title: 'Ingrese la nueva respuesta',
      input: 'text',
      inputPlaceholder: 'Ingrese una respuesta',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Guardar',
      allowOutsideClick: false,
      inputValidator: (value) => {
        if (!value) {
          return 'Debe ingresar una respuesta';
        }
      }
    });

    if (inputValue) {
      setDatosVotacion(false);

      console.log(preguntas);

      const newPreg = {
        idPregunta: idPreg + 1,
        idVotacion: idVotacion,
        tituloPreg: inputValue,
        respuesta: []
      }

      let preg = {idPregunta: idPreg + 1, idVotacion: idVotacion, titulo: inputValue}

      setPreguntasAdd([...preguntasAdd, preg]);

      setPreguntas([...preguntas, newPreg]);
      console.log(preguntas);
      setIdPreg(idPreg + 1)
      setDatosVotacion(true);
      }
  }

  const eliminarRespuestaEdit = (idResp, idPregu) => {
    setDatosVotacion(false);

    console.log(preguntas);
    console.log(respuestas);
    
    console.log(idResp);
    console.log(idPregu);
    
    const newPreguntas = preguntas.map((pregunta) => {
      const newRespuestas = respuestas.filter((respu) => respu.idResp !== idResp && respu.idPreg === pregunta.idPregunta);
    
      if (pregunta.idPregunta === idPregu) {
        return {
          ...pregunta,
          respuesta: newRespuestas,
        };
      }
    
      return pregunta;
    });
    
    const newRespuestas2 = respuestas.filter((respu) => respu.idResp !== idResp);

    let newResp = {idPregunta: idPregu, idRespuesta: idResp}
    setRespuestasDelete([...respuestasDelete, newResp]);
    
    setRespuestas(newRespuestas2);
    setPreguntas(newPreguntas);
    
    console.log(newPreguntas);
    console.log(newRespuestas2);
    
    setDatosVotacion(true);
    
  }

  const eliminarRespuestaLote = async (respuestasDeletee) => {
    console.log(respuestasDeletee)
    await axios.delete(serverUrl+"/respuestaDeleteLote",
        {
            data: respuestasDeletee
        }
    ).then(response =>{
    }).catch(error =>{
        alert(error.response.data.message);
    });
};

// funcion para eliminar una pregunta de la votacion

const eliminarPreguntaEdit = (idPregu) => {
  setDatosVotacion(false);

  console.log(idPregu);

  const newPreguntas = preguntas.filter((preg) => preg.idPregunta !== idPregu);


  const newResp = respuestas.filter((resp) => resp.idPreg !== idPregu);

  const respDelete = respuestas.filter((resp) => resp.idPreg === idPregu);

  console.log(respDelete)

  let respDeleteLote = []

  if (respDelete.length > 0) {
    respDelete.forEach((resp) =>{
      let newRespDelete = {idPregunta: resp.idPreg, idRespuesta: resp.idResp}
      respDeleteLote.push(newRespDelete)
    })
  }
  
  console.log(respDeleteLote)
  

  let newPreg = {idPregunta: idPregu, idVotacion: idVotacion}
  console.log(newPreg)
  setPreguntasDelete([...preguntasDelete, newPreg]);
  setRespuestasDelete([...respuestasDelete, ...respDeleteLote]);

  setPreguntas(newPreguntas);
  setRespuestas(newResp);

  setCantidadPreg(cantidadPreg - 1);

  document.getElementById('cantPreg').value = cantidadPreg;


  setDatosVotacion(true);

}

const eliminarPreguntaLote = async (preguntasDeletee) => {
  await axios.delete(serverUrl+"/preguntaDeleteLote",
      {
          data: preguntasDeletee
      }
  ).then(response =>{
  }).catch(error =>{
      alert(error.response.data.message);
      console.log(error);
  });
};

  return (
    <>{tipo === 'null' ?
    <div id='contenedorPrincipalMisVotaciones'>
        <MyNavbar activeKey='/crearVotacion'/>
        <div id='contenedorSecundarioMisVotaciones'>
          <div id='contenedorSuperiorCrearVotacion'>
            <Row className='filas'>
              <Col lg={12} md={12} sm={12} className='columnas'>
                <h1 id='tituloVotacion'>              
                  Para crear una nueva votacion ingrese los siguientes datos por favor
                </h1>
              </Col>
            </Row>
            
            <Row className='filas'>
              <Col className='columnas'>
                <Form.Label className="titulosFormCrearVot1">TÍTULO DE LA VOTACIÓN</Form.Label>
                  <Form.Control className="textosForm"
                      type="text"
                      placeholder="Ingrese el título de la votación"
                      value={tituloVotacion}
                      onChange={(e) => setTituloVotacion(e.target.value)}
                  />
              </Col>

              <Col className='columnas'>
                <Form.Label className="titulosFormCrearVot1">CANTIDAD DE PREGUNTAS DE LA VOTACIÓN</Form.Label>
                  <Form.Control className="textosForm"
                      id="cantPreg"
                      type="text"
                      placeholder="Ingrese la cantidad de preguntas que tendra la votación"
                      value={cantidadPreg}
                      onChange={(e) => setCantidadPreg(e.target.value)}
                  />
              </Col>

              <Col className='columnas'>
                <Form.Label className="titulosFormCrearVot1">CANTIDAD DE RESPUESTAS POR PREGUNTA DE LA VOTACIÓN</Form.Label>
                  <Form.Control className="textosForm"
                      type="text"
                      placeholder="Ingrese la cantidad de respuestas por pregunta que tendra la votación"
                      value={cantidadResp}
                      onChange={(e) => setCantidadResp(e.target.value)}
                  />  
              </Col>
            </Row>
            <div id='contenedorBotones'>
              <Button  className='boton' onClick={volverHome}>Cancelar</Button>
              <Button className='boton' onClick={continuarVotacion}>Continuar</Button>

            </div>
                
          </div>
          
          {
            datosVotacion === true  ? 
            <div id='contenedorVotacion'>
              {/* hola
              {preguntas.map(e => <h1>{e.id}</h1>)} */}
              
                {preguntas.map((element) => (
                  <div id='contenedorForm'>
                  <Form id='form'>
                    <Row id='filasFormCrear'>
                      <Col sm md lg ={11} id='columnaTituloPreg'>
                        
                        <Form.Control id='inputPreg' value = {element.tituloPreg} type="text" placeholder="Ingresa el titulo de la pregunta" onChange={(e) =>{
                          let nuevoTituloPreg = e.target.value;
                          updateTitulos(element.id, nuevoTituloPreg)
                          
                        }}/> 
                        
                        
                      </Col>

                      <Col>
                        <AiFillCloseCircle id='iconoCerrar' onClick={() => eliminarPregunta(element.id)}/>
                      </Col>
                      
                    </Row>
                    
                    <div id="contenedorRespuestas">
                      {element.respuestas.map((elem) =>(
                        
                        <Row id='filasFormCrear2'>
                          <Col sm md lg ={11} className='columnas' id='columnaTituloPreg'>
                            <Form.Control id='inputResp' type="text" placeholder="Ingrese una respuesta" onChange={(e) =>{
                              let nuevoTituloResp = e.target.value;
                              updateTitulosResp(elem.idRespuesta, elem.idPregunta, nuevoTituloResp);
                            }}/>
                          </Col>
                          <Col>
                            <AiFillCloseCircle id='iconoCerrar' onClick={() => eliminarRespuesta(elem.idRespuesta, elem.idPregunta)}/>
                          </Col>
                        </Row>
                        
                        ))}
                    </div>

                    <div id='contenedorBotonesCrear'>
                      <Button variant="primary" id='agregarRespCrear' onClick={() => agregarRespuesta(element.id)}>
                        Agregar Respuesta
                      </Button>

                      <Button variant="primary" id='agregarPregCrear' onClick={() => agregarPregunta(element.id)}>
                        Agregar Pregunta
                      </Button>

                    </div>
                          
                </Form>


                {element.id === preguntas[preguntas.length-1].id ?
                <>
                  <Row className='filasCrearVot1' id='filaSwitchCrearVot1'>
                  <Col lg={12} md={12} sm={12} className='columnasVot3'>
                    <Form>
                      <Form.Check 
                        type="switch"
                        id="switchListaParticipantesVot1"
                        label="Activar/desactivar lista de participantes"
                        onChange={handleActivarLista}
                        checked={activarLista}
                        
                      />
                      
                    </Form>
                  </Col>
                  </Row>

                  <>
            {activarLista === true ? 
              <div>
                <Row className='filasCrearVot1' id='filaSwitchCrearVot1'>
                  <Col lg={12} md={12} sm={12} className='columnasVot3'>
                    <h1 id='tituloSwitchVot1'>
                      Lista de participantes de la votación
                    </h1>
                    <h3 id='numeroParticipantesVot1'>
                      N° de participantes: {listaParticipantes.length}
                    </h3>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group  id='nombreVot1'>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" placeholder='Ingrese el nombre y apellido del participante' id='nombreUserVotante' value={nombre} onChange={(e) => setNombre(e.target.value)} />
                      </Form.Group>

                      <Form.Group  id='rutVot1'>
                        <Form.Label>Rut
                          
                        </Form.Label>
                        <Form.Control type="text" placeholder='Ingrese el rut del participante' id='rutUserVotante' value={rut} onChange={(e) => setRut(e.target.value)} />
                      </Form.Group>
                      <div id='contenedorBtnAgregarParticipanteVot1'>
                        <Button variant="primary" type="submit" id='btnAgregarParticipantesVot1'>
                          Agregar participante a la lista
                        </Button>
                      </div>
                      
                    </Form>
                  </Col>
                </Row>

                <>{listaParticipantes.length > 0?
                <Table striped bordered hover variant="dark" responsive>
                <tbody>
                    <tr>
                        <th className='titulosTabla'>#</th>
                        <th className='titulosTabla'>Nombre Participante</th>
                        <th className='titulosTabla'>Rut</th>
                        <th className='titulosTabla'>Acción</th>
                    </tr>
                    
                    {listaParticipantes.map((e, key) => (
                         <tr>
                            <td className='textosTabla'>{key + 1}</td>
                            <td className='textosTabla'>{e.nombre}</td>
                            <td className='textosTabla'>{e.rut}</td>
                            <td className='textosTabla'>
                              <TiDeleteOutline id='iconoEliminarVot1' onClick= {() => handleEliminar(e.key)}/>
                              <button id='btnEliminarParticipanteVot1' onClick={() => handleEliminar(e.key)}>Eliminar</button>
                            </td> 
                        </tr> 
                    ))}
                </tbody>
              </Table>:
              <div></div>

                }</>
              </div>:
              <div></div>
            }
            </>

                  
                  
                  
                  <div id='contenedorBotonFinal'>
                     <Button variant="primary" id='botonFinal' onClick={() => crearVotacion(element.id)}>
                      Crear Votación
                    </Button>
                  </div>
                  </>:
                  <></>
              
              }


                  
                
            </div>
                ))}
              
              
          </div>
            :
            <div id='contenedorVotacion'>
              no
            </div>
          } 
        </div>
          
      </div>:
      <div id='contenedorPrincipalMisVotaciones'>
      <MyNavbar activeKey='/crearVotacion'/>
      <div id='contenedorSecundarioMisVotaciones'>
        <div id='contenedorSuperiorCrearVotacion'>
          <Row className='filas'>
            <Col lg={12} md={12} sm={12} className='columnas'>
                <h1 id='tituloVotacion'>              
                    Editar Votación
                </h1>
            </Col>
          </Row>
          
          <Row className='filas'>
            <Col className='columnas'>
              <Form.Label className="titulosFormCrearVot1">TÍTULO DE LA VOTACIÓN</Form.Label>
                <Form.Control className="textosForm"
                    type="text"
                    placeholder="Ingrese el título de la votación"
                    value={tituloVotacion}
                    onChange={(e) => setTituloVotacion(e.target.value)}
                />
            </Col>

            <Col className='columnas'>
              <Form.Label className="titulosFormCrearVot1">CANTIDAD DE PREGUNTAS DE LA VOTACIÓN</Form.Label>
                <Form.Control className="textosForm"
                    id="cantPreg"
                    type="text"
                    placeholder="Ingrese la cantidad de preguntas que tendra la votación"
                    value={cantidadPreg}
                    onChange={(e) => setCantidadPreg(e.target.value)}
                />
            </Col>

            <Col className='columnas'>
              <Form.Label className="titulosFormCrearVot1">CANTIDAD DE RESPUESTAS POR PREGUNTA DE LA VOTACIÓN</Form.Label>
                <Form.Control className="textosForm"
                    type="text"
                    placeholder="Ingrese la cantidad de respuestas por pregunta que tendra la votación"
                    value={cantidadResp}
                    onChange={(e) => setCantidadResp(e.target.value)}
                />  
            </Col>
          </Row>
              
        </div>
        
        {
          datosVotacion === true  ? 
          <div id='contenedorVotacion'>
            {/* hola
            {preguntas.map(e => <h1>{e.id}</h1>)} */}
            
              {preguntas.map((element) => (
                <div id='contenedorForm'>
                <Form id='form'>
                  <Row id='filasFormCrear'>
                    <Col sm md lg ={11} id='columnaTituloPreg'>
                      
                    <Form.Control id='inputPreg' /* value = {element.tituloPreg} */ type="text" placeholder={element.tituloPreg} onChange={(e) =>{
                        let nuevoTituloPreg = e.target.value;
                        updateTitulosEditar(element.idPregunta, nuevoTituloPreg);
                    }}/> 
                      
                      
                    </Col>

                    <Col>
                      <AiFillCloseCircle id='iconoCerrar' onClick={() => eliminarPreguntaEdit(element.idPregunta)}/>
                    </Col>
                    
                  </Row>
                  
                <div id="contenedorRespuestas">
                  <> {
                    element.respuesta.length > 0 ?
                    element.respuesta.map((elem) =>(
                      
                      <Row id='filasFormCrear2'>
                        <Col sm md lg ={11} className='columnas' id='columnaTituloPreg'>
                          <Form.Control id='inputResp' /* value={elem.respuesta} */ type="text" placeholder={elem.respuesta} onChange={(e) =>{
                            let nuevoTituloResp = e.target.value;
                            updateTitulosRespEditar(elem.idResp, elem.idPreg, nuevoTituloResp);
                          }}/>
                        </Col>
                        <Col>
                          <AiFillCloseCircle id='iconoCerrar' onClick={() => eliminarRespuestaEdit(elem.idResp, elem.idPreg)}/>
                        </Col>
                      </Row>
                      
                      )):
                      <></>
                  }
                  </>
                    
                  </div>

                  <div id='contenedorBotonesCrear'>
                    <Button variant="primary" id='agregarRespCrear' onClick={() => capturarResp(element.idPregunta)}>
                      Agregar Respuesta
                    </Button>

                    <Button variant="primary" id='agregarPregCrear' onClick={() => capturarPreg(element.id)}>
                      Agregar Pregunta
                    </Button>

                  </div>
                        
              </Form>
              


              {element.idPregunta === preguntas[preguntas.length-1].idPregunta ?
                <div id='contenedorBotonFinal'>
                   <Button id='botonFinal' onClick={volverHome}>Cancelar</Button>
                  <Button variant="primary" id='botonFinal' onClick={() => GuardarCambios(element.id)}>
                        Guardar Cambios
                  </Button>
                </div>
                :
                <></>
            
            }


                
              
          </div>
              ))}
            
            
        </div>
          :
          <div id='contenedorVotacion'>
            no
          </div>
        } 
      </div>
        
    </div>}
      </>)
}

export default CrearVotaciones