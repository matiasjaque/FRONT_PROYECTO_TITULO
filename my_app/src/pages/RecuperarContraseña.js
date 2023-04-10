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
    const [passwordAntigua, setPasswordAntigua] = useState('');

    const validarContraseñaAntigua = async(contraseñaAntigua) => {

        var dataUsuarios = [];
        var correoOk = false;
        var contraseñaAntiguaOk = false;

        //obtener la data sobre los usuario
        await axios.get(serverUrl + "/usuarios")
            .then(response=>{
            console.log(response.data)
            console.log(passwordAntigua)
            dataUsuarios = response.data;
            //setLoading(true);
            //console.log("trae esto getPreguntas:");
            //console.log(response.data[response.data.length - 1].ID_PREGUNTA);
        })
        .catch (error=> {
            Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
            })
        })

        //validar que el gmail corresponde
        for(let i=0; i<dataUsuarios.length; i++){
            if(email.toUpperCase() === dataUsuarios[i].EMAIL){
                correoOk = true;
            }
        }

        if(correoOk === true){
            //validar que la contraseña antigua corresponde 
            for (let i=0; i<dataUsuarios.length; i++) {
                if(email.toUpperCase() === dataUsuarios[i].EMAIL && passwordAntigua === dataUsuarios[i].PASSWORD){
                    contraseñaAntiguaOk = true;
                }
            }
            if(contraseñaAntiguaOk === true){
                crearUsuario()
            }
            else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'La contraseña antigua ingresado es invalida',
                })
            }
        }

        else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El correo electronico ingresado es invalido',
            })
        }
    }


    const crearUsuario =  async () =>{
        if (email !=='' && password!=='' && passwordAntigua !=='') {
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
    //console.log(window.innerWidth +' <= 1200' )

    return (
        <div style={imagenFondo} className="containerPadre">
            <Container className="container">
                <Col xs md lg={12}>
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
                                <Form.Label>ANTIGUA PASSWORD</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese su antigua contraseña" onChange={(
                                    event => setPasswordAntigua(event.target.value)
                                )}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="text" id="filaRecuperarContra">
                                <Form.Label>NUEVA PASSWORD</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese su nueva contraseña" onChange={(
                                    event => setPassword(event.target.value)
                                )}/>
                            </Form.Group>

                            <Row className='botones'>
                                <Col>
                                    {window.innerWidth >= 1200 ?
                                        <Button id="botonVolverRecContra" href='/'>VOLVER</Button>
                                        :<Button id='botonVolverRecContraChico' href='/'>VOLVER</Button>
                                    }
                                </Col>
                                <Col>
                                    <Button className='botonCrearCuenta' onClick={validarContraseñaAntigua}>CAMBIAR CONTRASEÑA</Button>
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