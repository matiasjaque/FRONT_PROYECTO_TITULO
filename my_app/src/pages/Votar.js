import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';

import Form from 'react-bootstrap/Form';

import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Swal from 'sweetalert2';


import Row from 'react-bootstrap/Row';

import '../styles/Votar.css'

const serverUrl = process.env.REACT_APP_SERVER;


var controlador = 0;

const Votar = () => {
    const {id} = useParams();
    const {estadoVotacion} = useParams();
    const {idPreg} = useParams();
    //console.log(estadoVotacion)
    

    // credenciales de usuarios que participan en la votación 
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [rutUsuario, setRutUsuario] = useState('');


    const [usuariosVotantes, setUsuariosVotantes] = useState([]);


    const [segura, setSegura ] = useState(0);

    
    


    //console.log(votacion)

    useEffect(() => {
        
        if(controlador === 0){
            //traer la data
            dataUsuarioVotanteGet()
            getSeguridadVotacion()
            controlador = 1;
        }
        
    });


   

    const ingresarDataUsuariosVotantes = () => {

        const numeros = /^[0-9]+$/

        // validacion del nombre de usuario
        if(nombreUsuario === undefined || nombreUsuario === '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Debe asegurarse de ingresar su nombre',
            })
        }

        // validacion del rut
        if(!rutUsuario.match(numeros) || rutUsuario.length !== 9 || rutUsuario === undefined || rutUsuario === '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El rut ingresado es invalido, si termina en k reemplácelo por un 0',
            })
        }

        else{
            var nombreUser = nombreUsuario.toUpperCase();
            var rut = parseInt(rutUsuario);
            console.log(nombreUser, rut, id)

            var usuarioExiste = 0; 

            // verificar si el usuario ya existe

            

            if(usuariosVotantes.length === 0){
                // se crea el usuario votante
                crearUsuarioVotante(nombreUser, rut, id)
            }
            
            // se comparan las credenciales con la base de datos
            for(let i=0; i<usuariosVotantes.length; i++){
                if((usuariosVotantes[i].ID_VOTACION === parseInt(id) && usuariosVotantes[i].NOMBRE === nombreUser) ||
                    (usuariosVotantes[i].ID_VOTACION === parseInt(id) && usuariosVotantes[i].RUT === rut)){
                    usuarioExiste = 1;
            }
        }
        if(usuarioExiste === 0){
            crearUsuarioVotante(nombreUser, rut, id)
        }
        else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El usuario ya existe',
            })
        }

        
    }
}


    //funcion para crear al usuario votante
    const crearUsuarioVotante =  async (nombre, rut, idVot) =>{   
        await axios({
            method: 'post',
            url:serverUrl + "/usuarioVotanteCreate", 
            headers: {'Content-Type': 'application/json'},
        params:
            {nombre: nombre,
            rut: rut,
            idVotacion: idVot,
            validacion: 0,
            }
        }).then(response=>{
            console.log("la data funciona " + response);
            
            
            Swal.fire({title: "Registrarse", text:'Sus credenciales han sido ingresadas con éxito',
            icon: "success", timer: "3000"})
            setTimeout(function () {
                window.location.replace(`http://localhost:3000/votarNormal/${id}/${estadoVotacion}/${idPreg}`)               
            }, 3000);
        })
        
        .catch(error=>{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El usuario ya existe',
            })
        })
    }
        

    // funcion para traer la data de los usuarios votante

    const dataUsuarioVotanteGet = async() => {
        //obtener la data sobre los usuario
        await axios.get(serverUrl + "/usuariosVotante")
        .then(response=>{
            console.log(response.data);
            setUsuariosVotantes(response.data);
        })
        .catch (error=> {
            setUsuariosVotantes([]);
            /* Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.message,
            }) */
        })
    }

    const getSeguridadVotacion = async() => {
        //obtener la data sobre los usuario
        await axios.get(serverUrl + "/votacionById", {params:{idVotacion: id}})
        .then(response=>{
            console.log(response.data);
            setSegura(response.data[0].segura)
        })
        .catch (error=> {
            /* Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.message,
            }) */
        })
    }


    const autenticarUsuario = () => {
        
        var usuariosVotantesFiltrados = usuariosVotantes.filter(votante => votante.VALIDACION === 1);

        const numeros = /^[0-9]+$/

        // validacion del nombre de usuario
        if(nombreUsuario === undefined || nombreUsuario === '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Debe asegurarse de ingresar su nombre',
            })
        }

        // validacion del rut
        if(!rutUsuario.match(numeros) || rutUsuario.length !== 9 || rutUsuario === undefined || rutUsuario === '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El rut ingresado es invalido, si termina en k reemplácelo por un 0',
            })
        }

        else{
            var nombreUser = nombreUsuario.toUpperCase();
            var rut = parseInt(rutUsuario);
            console.log(nombreUser, rut, id)
            console.log(usuariosVotantesFiltrados)

            var usuarioExiste = 0; 
            var verSiVoto = 0;

            // verificar si el usuario existe en la bd

            // se comparan las credenciales con la base de datos
            for(let i=0; i<usuariosVotantesFiltrados.length; i++){
                if( usuariosVotantesFiltrados[i].ID_VOTACION === parseInt(id) && 
                    usuariosVotantesFiltrados[i].NOMBRE === nombreUser &&
                    usuariosVotantesFiltrados[i].RUT === rut ){
                    usuarioExiste = 1;

                    if(usuariosVotantesFiltrados[i].VOTO === 0){
                        verSiVoto = 0;
                    }
                    else{
                        verSiVoto = 1;
                    }
            }
        }
        if(usuarioExiste === 1){
            //update estado de votacion 
            if(verSiVoto === 0){
                actualizarVotoUsuario(id,rut)
            }
            else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'El usuario ingresado ya ha realizado su voto',
                })
            }
            
        }
        else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El usuario ingresado no tiene permiso para participar en la votación',
            })
        }

        
    }
    }

    const actualizarVotoUsuario =  async (idVot, rut) =>{
        
        
        await axios({
            method: 'put',
            url:serverUrl + "/usuarioVotanteUpdate", 
            headers: {'Content-Type': 'application/json'},
        params:
            {
                idVotacion: idVot,
                rut: rut
            }
        }).then(response=>{
            console.log("la data funciona " + response);
            //var respuesta = response.data;
            Swal.fire({title: "Autenticación", text:'Sus credenciales han sido validadas con éxito',
            icon: "success", timer: "3000"})
            setTimeout(function () {
                window.location.replace(`http://localhost:3000/votarNormal/${id}/${estadoVotacion}/${idPreg}`)               
            }, 3000);
        })
        .catch(error=>{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El usuario ingresado no tiene permiso para participar en la votación',
            })
        })
            
    }

    
    return (
        <div id='contenedorPadreVotar'>
            <div id='contenedorSecundarioVotar'>
                {(estadoVotacion === '1') /* || estadoVotacion === '2' */? 
                <>
                    {segura === 0 ? 
                    
                    <div id='contenedorIngresarElNombreVotante'>
                        <Row className='filasEstado2' id='filaTituloVOtarEstado1Nuevo'>
                            <h1 id='tituloEstado2'>
                                Ingrese su nombre y rut para continuar con el proceso de votación por favor!
                            </h1>
                        </Row>
                        <Row className='filasEstado2' id='filaFormularioEstado1Nuevo'>
                            <Form.Control id="formularioEstado2"
                                type="text"
                                placeholder="Ingrese su nombre y apellido por favor!"
                                value={nombreUsuario}
                                onChange={(e) => setNombreUsuario(e.target.value)}
                            /> 
                        </Row>
                        <Row className='filasEstado2' id='filaFormularioEstado1Nuevo'>
                            <Form.Control id="formularioEstado2"
                                type="text"
                                placeholder="Ingrese su RUT sin puntos ni guión ej: 123456789"
                                value={rutUsuario}
                                onChange={(e) => setRutUsuario(e.target.value)}
                            /> 
                        </Row>
                        <Row className='filasEstado2' id='filaBotonEstado2'>
                            <div id='contenedorBotonesEstado2'>
                                <Button className='botonEstado2' onClick={() => ingresarDataUsuariosVotantes()}>Continuar votación</Button>
                            </div>
                        </Row>
                    
                    </div>:
                    <div id='contenedorIngresarElNombreVotante'>
                    <Row className='filasEstado2' id='filaTituloVOtarEstado1Nuevo'>
                        <h1 id='tituloEstado2'>
                            Ingrese su nombre y rut para autenticar su usuario por favor!
                        </h1>
                    </Row>
                    <Row className='filasEstado2' id='filaFormularioEstado1Nuevo'>
                        <Form.Control id="formularioEstado2"
                            type="text"
                            placeholder="Ingrese su nombre y apellido por favor!"
                            value={nombreUsuario}
                            onChange={(e) => setNombreUsuario(e.target.value)}
                        /> 
                    </Row>
                    <Row className='filasEstado2' id='filaFormularioEstado1Nuevo'>
                        <Form.Control id="formularioEstado2"
                            type="text"
                            placeholder="Ingrese su RUT sin puntos ni guión ej: 123456789"
                            value={rutUsuario}
                            onChange={(e) => setRutUsuario(e.target.value)}
                        /> 
                    </Row>
                    <Row className='filasEstado2' id='filaBotonEstado2'>
                        <div id='contenedorBotonesEstado2'>
                            <Button className='botonEstado2' onClick={() => autenticarUsuario()}>Autenticar Usuario</Button>
                        </div>
                    </Row>
                
                </div>}
                    
            </>: window.location.replace(`http://localhost:3000/votarNormal/${id}/${estadoVotacion}/${idPreg}`)
            }      
                
            </div>
        
        </div>
    )
        
    };

    


export default Votar


