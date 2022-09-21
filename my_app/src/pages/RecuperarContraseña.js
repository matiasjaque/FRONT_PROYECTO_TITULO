import React, { useState} from 'react'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Swal from 'sweetalert2';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import fondo from '../assets/fondo.png';

import '../styles/RecuperarContraseña.css';


const serverUrl = process.env.REACT_APP_SERVER;

const imagenFondo = {
    backgroundImage: `url(${fondo})`,
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    height: '100vh',
    //width: '100vw'
  };


const RecuperarContraseña = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const crearUsuario =  async () =>{
        if (email !=='' && password!=='') {
            console.log(email, password)
            await axios({
                method: 'put',
                url:serverUrl + "/usuarioUpdate", 
                headers: {'Content-Type': 'application/json'},
            params:
                {
                email: email,
                password: password}
            }).then(response=>{
                console.log("la data funciona " + response);
                //var respuesta = response.data;
                
                Swal.fire({title: "Recuperar Contraseña", text:"La contraseña ha sido cambiada con éxito",
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
            alert('Debe completar todos los parametros para cambiar su contraseña');
        }

        
            
    }

    return (
        <div style={imagenFondo} className="containerPadre">
            <Container className="container">
                <Col lg={12}>
                    <Row  className="titulo">RESTABLEZCA SU CONTRASEÑA</Row>
                    <Row className="parametros">
                        <Form id='formRecContra'>

                            <Form.Group className="mb-3" id="filaRecuperarContra">
                                <Form.Label>EMAIL</Form.Label>
                                <Form.Control className='formEmailInput' type="email" placeholder="Ingrese su email" onChange={(
                                    event => setEmail(event.target.value)
                                )}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="text" id="filaRecuperarContra">
                                <Form.Label>PASSWORD</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese su nueva contraseña" onChange={(
                                    event => setPassword(event.target.value)
                                )}/>
                            </Form.Group>
                            <Row className='botones'>
                                <Col>
                                    <Button className='botonVolver' href='/'>VOLVER</Button>
                                </Col>
                                <Col>
                                    <Button className='botonCrearCuenta' onClick={crearUsuario}>RECUPERAR CONTRASEÑA</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Row>
                </Col>
            </Container>
        </div>
  );
}
    

export default RecuperarContraseña