import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import Button from 'react-bootstrap/Button';

import MyNavbar from '../componts/MyNavbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Swal from 'sweetalert2';

import '../styles/PaginaPrincipal.css'

import axios from 'axios';

import Votacion from '../componts/Votacion';

const serverUrl = process.env.REACT_APP_SERVER;
const conectado = new Cookies();

var idUsuario = conectado.get('id');

const PaginaPrincipal = () => {

  const [votaciones, setVotaciones] = useState([]);

  const votacionesGet = async () =>{
    await axios.get(serverUrl + "/votaciones", {params:{idUsuario: idUsuario}})
      .then(response=>{
        setVotaciones(response.data);
        //setLoading(true);
        console.log("trae esto getVotaciones:");
        console.log(response.data);
    })
    .catch (error=> {
      setVotaciones([]);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
      })/* 
      alert(error.response.data.message);
      console.log(error); */
    })
  };


  useEffect(() => {
      votacionesGet();
    },[]);


    console.log("id: " + conectado.get('id'));
    console.log("nombre: " + conectado.get('nombre'));
    console.log("apellido: " + conectado.get('apellido'));
    
    return (

      <div id='contenedorPrincipalPagina'>
        <MyNavbar/>
        <div id='contenedorSecundario'>
          <Votacion votaciones={votaciones}/>
        </div>
          
        

      </div>
  )
}

export default PaginaPrincipal