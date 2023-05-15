import React, { useEffect, useState} from 'react'

import { useParams } from 'react-router-dom';

import MyNavbar from '../componts/MyNavbar';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import '../styles/CrearVotacion2.css';
import { TiDeleteOutline } from "react-icons/ti";
import axios from 'axios';
import Cookies from 'universal-cookie';
import Swal from 'sweetalert2';
const serverUrl = process.env.REACT_APP_SERVER;

const conectado = new Cookies();

const onlyLettersPattern = /^[a-zA-Z0-9?¿!¡ ()áéíóúñÁÉÍÓÚÑ]+$/;

var idUsuario = conectado.get('id'); 
var controlador = 1;
var tieneVotaciones = false;
var tieneVotacionesFunc = 0;

var controlador2 = 0;


const CrearVotacion2 = () => {

const {tipo} = useParams();
const {idVotacion} = useParams();

//console.log(tipo, idVotacion);


const [idVotacionLocal, setIdVotacionLocal] = useState(0);
const [idPregInsert, setIdPregInsert] = useState(0)
const [tituloVotacion, setTituloVotacion] = useState('');
const [preguntaVotacion, setPreguntaVotacion] = useState('');
const [porcentajeVotacion, setPorcentajeVotacion] = useState(50);
const [idPregEditar, setIdPregEditar] = useState(0);


//data para funcionalidad de seguridad
const [activarLista, setActivarLista] = useState(false);
const [listaParticipantes, setListaParticipantes] = useState([]);
const [listaParticipantesEliminar, setListaParticipantesEliminar] = useState([]);
const [listaParticipantesAgregar, setListaParticipantesAgregar] = useState([]);


const [nombre, setNombre] = useState('');
const [rut, setRut] = useState('');

// funciones que necesito cargar en cada render
useEffect(() => {

  if(tieneVotacionesFunc === 0){
    verificarSiTieneVotaciones();
    tieneVotacionesFunc = 1;
  }

  if (tieneVotaciones === true){
    actualizarIdVotacion();
    actualizarIdPreguntas();
    tieneVotaciones = false;
  }

  else if (controlador2 === 0){
    actualizarIdVotacionGeneral();
    actualizarIdPreguntas();
    controlador2 = 1
  }
  
  if(tipo === 'especial' && controlador === 1){
      obtenerTituloVot();
      obtenerTituloPreg();	
      getUsuarioVotantes(idVotacion)
      controlador = 0;
  }
});

// funcion para traer la data sobre los usuarios que participan de las votaciones

const getUsuarioVotantes = async (idVot) =>{
  console.log(idVot)
  console.log(typeof(idVot));
  await axios.get(serverUrl + "/usuariosVotante")
    .then(response=>{
      let usuarioVotantes = response.data.filter((e) => e.ID_VOTACION === parseInt(idVot));
      console.log(typeof(response.data[0].ID_VOTACION));
      console.log(response.data)
      console.log(usuarioVotantes)

      setListaParticipantes(usuarioVotantes)
  })
  .catch (error=> {
    //setIdVotacion(0)
    /* Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.response.data.message,
    }) */
  })
};


const verificarSiTieneVotaciones = async() => {
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
    
            console.log(response.data[0])
            let tituloGet = response.data[0].titulo;
			      setIdPregEditar(response.data[0].id_pregunta)
            setPreguntaVotacion(tituloGet);
            
        })
        .catch (error=> {
            Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            })
        })
}

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

const actualizarIdVotacion = async () =>{
    await axios.get(serverUrl + "/votaciones", {params:{idUsuario: idUsuario}})
      .then(response=>{
        setIdVotacionLocal(response.data[response.data.length - 1].id_votacion)
        //setLoading(true);
        //console.log("trae esto getVotaciones:");
        //console.log(response.data[response.data.length - 1].id_votacion);
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
        
        setIdPregInsert(response.data[response.data.length - 1].ID_PREGUNTA)
        //setLoading(true);
        //console.log("trae esto getPreguntas:");
        //console.log(response.data[response.data.length - 1].ID_PREGUNTA);
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


const volverHome = () =>{
    window.location.replace('/misVotaciones')
}

const crearVotacion2 = () => {
  //console.log(typeof(parseInt(porcentajeVotacion)))
  let auxSwitch = document.getElementById('switchListaParticipantesVot2').checked;
  var idVot = idVotacionLocal + 1;

    if(tituloVotacion !== '' && preguntaVotacion !== '' && parseInt(porcentajeVotacion)) {

      if(auxSwitch === true && listaParticipantes.length > 0){
        var dataUserVotantesPorLote = [];

        for(let i = 0; i < listaParticipantes.length; i++){
          dataUserVotantesPorLote.push({NOMBRE: listaParticipantes[i].nombre, RUT: listaParticipantes[i].rut, idVotacion: idVot, validacion: 1})
          //crearUsuarioVotante(listaParticipantes[i].nombre, listaParticipantes[i].rut, idVot)
        }
        // Ejecutar las tres peticiones al servidor de manera asíncrona
        Promise.all([
          createVotacion(1),
          createPregunta(),
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
          createPregunta(),
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
        text: 'Debe asegurarse de ingresar un titulo y pregunta para la nueva votación',
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
	if(tituloVotacion !== '' && preguntaVotacion !== '') {

    // Se crean las promesas correspondientes a cada solicitud al servidor
    const updateTituloVotacionPromise = updateTituloVotacion();
    const updateTituloPregPromise = updateTituloPreg();
    const crearUsuarioVotantePromise = crearUsuarioVotante(listaParticipantesAgregar);
    const eliminarUsuarioVotanteLotePromise = eliminarUsuarioVotanteLote(listaParticipantesEliminar);

    // Se ejecutan todas las promesas en paralelo utilizando Promise.all
    Promise.all([
      updateTituloVotacionPromise,
      updateTituloPregPromise,
      crearUsuarioVotantePromise,
      eliminarUsuarioVotanteLotePromise
    ]).then(() => {
      Swal.fire({
        title: 'Votación editada con éxito',
        icon: 'success',
        timer: 2000
      });
      setTimeout(function() {
        window.location.replace('/misVotaciones');
      }, 2000);
    }).catch((error) => {
      console.error(error);
      // Mostrar mensaje de error en caso de fallo
      Swal.fire({
        title: 'Ocurrió un error al editar la votación',
        icon: 'error'
      });
    });
  }
  else{
    Swal.fire({
      title: 'Debe asegurarse de ingresar un titulo y pregunta para la nueva votación',
      icon: 'error'
    });
  }
}

const updateTituloVotacion = async () => {
	
	await axios({
		method: 'put',
		url:serverUrl + "/votacionUpdate", 
		headers: {'Content-Type': 'application/json'},
		params:{idVotacion: idVotacion, idUsuario: idUsuario, titulo: tituloVotacion}
	}).catch(error =>{
		alert(error.response.data.message);
		console.log(error);
	});
};

const updateTituloPreg = async () => {
	
	await axios({
		method: 'put',
		url:serverUrl + "/preguntaUpdate", 
		headers: {'Content-Type': 'application/json'},
		params:{idVotacion: idVotacion, idPregunta: idPregEditar, titulo: preguntaVotacion}
	}).catch(error =>{
		alert(error.response.data.message);
		console.log(error);
	});
};

const createVotacion = async (segura) =>{
    var idVot = idVotacionLocal + 1;
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
        tipo: 'especial',
        porcentaje: porcentajeVotacion,
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

const createPregunta = async () =>{
    let idVot = idVotacionLocal + 1;

    let idPreguntaInsert = idPregInsert

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
        titulo: preguntaVotacion,
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

const handleEliminarLote = (index, rutEliminar) => {
  console.log(index)
  var idVot = idVotacionLocal;
  let aux = {RUT: rutEliminar, idVotacion: idVot}
  const nuevaListaParticipantes = [...listaParticipantes];
  nuevaListaParticipantes.splice(index, 1);
  setListaParticipantes(nuevaListaParticipantes);

  setListaParticipantesEliminar([...listaParticipantesEliminar, aux]);
};

const eliminarUsuarioVotanteLote = async (usuariosVotantesEliminar) => {
  console.log(typeof(rut))
  await axios.delete(serverUrl+"/usuarioVotanteDeleteLote",
      {
        data: usuariosVotantesEliminar
      }
  ).then(response =>{
      
  }).catch(error =>{
      alert(error.response.data.message);
      console.log(error);
  });
};


const handleSubmitAgregar = (event) => {
  event.preventDefault();
  var idVot = idVotacionLocal;
  console.log(nombre, rut)
  console.log(rut.length)
  if(nombre !== null && nombre !== undefined && !nombre.match(onlyLettersPattern) === false && rut !== null && rut !== undefined){
    
    if(listaParticipantes.length === 0){
      let aux = {NOMBRE: nombre.toUpperCase(), RUT: rut}
      let aux2 = {NOMBRE: nombre.toUpperCase(), RUT: rut, idVotacion: idVot, validacion: 1}

      setListaParticipantes([...listaParticipantes, aux]);
      setListaParticipantesAgregar([...listaParticipantesAgregar, aux2]);
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

        let aux = {NOMBRE: nombre.toUpperCase(), RUT: rut}
        let aux2 = {NOMBRE: nombre.toUpperCase(), RUT: rut, idVotacion: idVot, validacion: 1}
  
        setListaParticipantes([...listaParticipantes, aux]);
        setListaParticipantesAgregar([...listaParticipantesAgregar, aux2]);
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

console.log(listaParticipantes);
console.log(listaParticipantesAgregar)
console.log(listaParticipantesEliminar)

  return (

    <>{tipo === 'null'?
    
    <div id='contenedorPrincipalMisVotaciones2'>
        <MyNavbar activeKey='/crearVotacion'/>
        <div id='contenedorSecundarioMisVotaciones2'>
          <div id='contenedorCrearVotacion2'>
            <Row className='filasCrearVot2' id='filaTitulo'>
              <Col lg={12} md={12} sm={12} className='columnasVot2'>
                <h1 id='tituloVotacion2'>              
                  Para crear una nueva votación de única selección ingrese los siguientes datos por favor
                </h1>
              </Col>
            </Row>

            <Row className='filasCrearVot2' id='filaTituloVot'>
              <Col lg={12} md={12} sm={12} className='columnasVot2'>
                <Form.Label className="titulosForm2">TÍTULO DE LA NUEVA VOTACIÓN</Form.Label>
                <Form.Control className="textosForm2"
                    type="text"
                    placeholder="Ingrese el título de la votación"
                    value={tituloVotacion}
                    onChange={(e) => setTituloVotacion(e.target.value)}
                /> 
              </Col>
            </Row>

            <Row className='filasCrearVot2' id='filaTituloPreg'>
                <Col lg={12} md={12} sm={12} className='columnasVot2'>
                    <Form.Label className="titulosForm2">TÍTULO DE LA PREGUNTA</Form.Label>
                    <Form.Control className="textosForm2"
                        type="text"
                        placeholder="Ingrese la pregunta de la votación"
                        value={preguntaVotacion}
                        onChange={(e) => setPreguntaVotacion(e.target.value)}
                    /> 
                </Col>
            </Row>

            <Row className='filasCrearVot2' id='filaTituloPreg'>
                <Col lg={12} md={12} sm={12} className='columnasVot2'>
                    <Form.Label className="titulosForm2">INGRESE EL % DE VOTOS</Form.Label>
                    <Form.Control className="textosForm2"
                        type="text"
                        placeholder="Ingrese la pregunta de la votación"
                        value={porcentajeVotacion}
                        onChange={(e) => setPorcentajeVotacion(e.target.value)}
                    /> 
                </Col>
            </Row>

            <Row className='filasCrearVot3' id='filaSwitchCrearVot2'>
                <Col lg={12} md={12} sm={12} className='columnasVot3'>
                  <Form>
                    <Form.Check 
                      type="switch"
                      id="switchListaParticipantesVot2"
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
                <Row className='filasCrearVot3' id='filaSwitchCrearVot2'>
                  <Col lg={12} md={12} sm={12} className='columnasVot3'>
                    <h1 id='tituloSwitchVot2'>
                      Lista de participantes de la votación
                    </h1>
                    <h3 id='numeroParticipantesVot2'>
                      N° de participantes: {listaParticipantes.length}
                    </h3>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group  id='nombreVot2'>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" placeholder='Ingrese el nombre y apellido del participante' id='nombreUserVotante' value={nombre} onChange={(e) => setNombre(e.target.value)} />
                      </Form.Group>

                      <Form.Group  id='rutVot2'>
                        <Form.Label>
                          Rut
                        </Form.Label>
                        <Form.Control type="text" placeholder='Ingrese el rut del participante' id='rutUserVotante' value={rut} onChange={(e) => setRut(e.target.value)} />
                      </Form.Group>
                      <div id='contenedorBtnAgregarParticipanteVot2'>
                        <Button variant="primary" type="submit" id='btnAgregarParticipantesVot2'>
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
                              <TiDeleteOutline id='iconoEliminarVot2' onClick= {() => handleEliminar(e.key)}/>
                              <button id='btnEliminarParticipanteVot2' onClick={() => handleEliminar(e.key)}>Eliminar</button>
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

            <Row className='filasCrearVot2' id='filavot2Botones'>
              <Col lg={12} md={12} sm={12} className='columnasVot2'>
                <div id='contenedorBotonesVot2'>
                    <Button  className='boton2' onClick={volverHome}>Cancelar</Button>
                    <Button className='boton2' onClick={crearVotacion2}>Crear Votación</Button>
                </div>
              </Col>
            </Row>
            
            
                
          </div>
          
        </div>
          
      </div>:
      <div id='contenedorPrincipalMisVotaciones2'>
      <MyNavbar activeKey='/crearVotacion'/>
      <div id='contenedorSecundarioMisVotaciones2'>
        <div id='contenedorCrearVotacion2'>
          <Row className='filasCrearVot2' id='filaTitulo'>
            <Col lg={12} md={12} sm={12} className='columnasVot2'>
              <h1 id='tituloVotacion2'>              
                Editar Votación
              </h1>
            </Col>
          </Row>

          <Row className='filasCrearVot2' id='filaTituloVot'>
            <Col lg={12} md={12} sm={12} className='columnasVot2'>
              <Form.Label className="titulosForm2">TÍTULO DE LA VOTACIÓN</Form.Label>
              <Form.Control className="textosForm2"
                  type="text"
                  placeholder="Ingrese el título de la votación"
                  value={tituloVotacion}
                  onChange={(e) => setTituloVotacion(e.target.value)}
              /> 
            </Col>
          </Row>

          <Row className='filasCrearVot2' id='filaTituloPreg'>
              <Col lg={12} md={12} sm={12} className='columnasVot2'>
                  <Form.Label className="titulosForm2">TÍTULO DE LA PREGUNTA</Form.Label>
                  <Form.Control className="textosForm2"
                      type="text"
                      placeholder="Ingrese la pregunta de la votación"
                      value={preguntaVotacion}
                      onChange={(e) => setPreguntaVotacion(e.target.value)}
                  /> 
              </Col>
          </Row>


          <>
            {listaParticipantes.length > 0 ? 
              <div>
                <Row className='filasCrearVot3' id='filaSwitchCrearVot3'>
                  <Col lg={12} md={12} sm={12} className='columnasVot3'>
                    <h1 id='tituloSwitchVot3'>
                      Lista de participantes de la votación
                    </h1>
                    <h3 id='numeroParticipantesVot3'>
                      N° de participantes: {listaParticipantes.length}
                    </h3>
                    <Form onSubmit={handleSubmitAgregar}>
                      <Form.Group  id='nombreVot3'>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" placeholder='Ingrese el nombre y apellido del participante' id='nombreUserVotante' value={nombre} onChange={(e) => setNombre(e.target.value)} />
                      </Form.Group>

                      <Form.Group  id='rutVot3'>
                        <Form.Label>Rut
                          
                        </Form.Label>
                        <Form.Control type="text" placeholder='Ingrese el rut del participante' id='rutUserVotante' value={rut} onChange={(e) => setRut(e.target.value)} />
                      </Form.Group>
                      <div id='contenedorBtnAgregarParticipanteVot3'>
                        <Button variant="primary" type="submit" id='btnAgregarParticipantesVot3'>
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
                            <td className='textosTabla'>{e.NOMBRE}</td>
                            <td className='textosTabla'>{e.RUT}</td>
                            <td className='textosTabla'>
                              <TiDeleteOutline id='iconoEliminarVot3' onClick= {() => handleEliminarLote(key, e.RUT)}/>
                              <button id='btnEliminarParticipanteVot3' onClick={() => handleEliminarLote(key, e.RUT)}>Eliminar</button>
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




          <Row className='filasCrearVot2' id='filavot2Botones'>
            <Col lg={12} md={12} sm={12} className='columnasVot2'>
              <div id='contenedorBotonesVot2'>
                  <Button  className='boton2' onClick={volverHome}>Cancelar</Button>
                  <Button className='boton2' onClick={GuardarCambios}>Guardar Cambios</Button>
              </div>
            </Col>
          </Row>
          
          
              
        </div>
        
      </div>
        
    </div>}</>
  )
}
  

export default CrearVotacion2