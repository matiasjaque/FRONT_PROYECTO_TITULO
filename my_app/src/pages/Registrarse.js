import React, { useState} from 'react'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Swal from 'sweetalert2';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import validator from 'validator'

import '../styles/Registrarse.css';


const serverUrl = process.env.REACT_APP_SERVER;


const Registrarse = () => {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const crearUsuario =  async () =>{
        if (validator.isEmail(email)){
            
            if (nombreUsuario!=='' && apellidoPaterno !=='' && apellidoMaterno!=='' && email !=='' && password!=='') {
                console.log(nombreUsuario, apellidoPaterno, apellidoMaterno, email, password)
                await axios({
                    method: 'post',
                    url:serverUrl + "/usuarioCreate", 
                    headers: {'Content-Type': 'application/json'},
                params:
                    {nombre: nombreUsuario,
                    apellidoPaterno: apellidoPaterno,
                    apellidoMaterno: apellidoMaterno,
                    email: email,
                    password: password}
                }).then(response=>{
                    console.log("la data funciona " + response);
                    //var respuesta = response.data;
                    
                    Swal.fire({title: "Registrarse", text:"La cuenta ha sido creada con éxito",
                    icon: "success", timer: "3000"})
                    setTimeout(function () {
                        window.location.replace("/")               
                    }, 3000);
                })
                .catch(error=>{
                    alert(error.response.data.message);
                    console.log(error);
                })
            }
            else{
                alert('Debe completar todos los parametros para crear una nueva cuenta!');
            }
        }
        else{
            alert('El correo ingresado no es valido');
        }
    

        
            
    }

    return (
        <div className="containerPadre">
            <Container className="container">
                <Col lg={12}>
                    <Row  className="titulo">REGISTRARSE</Row>
                    <Row className="parametros">
                        <Form>
                            <Form.Group className="mb-3" controlId="text" id="fila">
                                <Form.Label>NOMBRE</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese su nombre" onChange={(
                                    event => setNombreUsuario(event.target.value)
                                )}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="text" id="fila">
                                <Form.Label>APELLIDO PATERNO</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese su apellido paterno" onChange={(
                                    event => setApellidoPaterno(event.target.value)
                                )}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="text" id="fila">
                                <Form.Label>APELLIDO MATERNO</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese su apellido materno" onChange={(
                                    event => setApellidoMaterno(event.target.value)
                                )}/>
                            </Form.Group>

                            <Form.Group className="mb-3" id="fila">
                                <Form.Label>EMAIL</Form.Label>
                                <Form.Control type="email" placeholder="Ingrese su email" onChange={(
                                    event => setEmail(event.target.value)
                                )}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="text" id="fila">
                                <Form.Label>PASSWORD</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese su contraseña" onChange={(
                                    event => setPassword(event.target.value)
                                )}/>
                            </Form.Group>
                            <Row className='botones'>
                                <Col>
                                    <Button className='botonVolver' href='/'>VOLVER</Button>
                                </Col>
                                <Col>
                                    <Button className='botonCrearCuenta' onClick={crearUsuario}>CREAR CUENTA</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Row>
                </Col>
            </Container>
        </div>
  );
}
    


export default Registrarse