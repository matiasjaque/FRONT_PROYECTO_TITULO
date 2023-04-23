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


const OlvidarContraseña = () => {
    const [email, setEmail] = useState('');

    const validarContraseñaAntigua = async() => {

        var dataUsuarios = [];
        var correoOk = false;

        

        //obtener la data sobre los usuario
        await axios.get(serverUrl + "/usuariosGmail")
            .then(response=>{
            console.log(response.data);
            dataUsuarios = response.data;
            console.log(email.toUpperCase())
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
            if(email.toUpperCase() === dataUsuarios[i].email.toUpperCase()){
                correoOk = true;
            }
        }

        if(correoOk === true){

            // se envia el correo
            recuperarContrasena()
            document.getElementById('emailRec').value = ''
            document.getElementById('antiguaContraRec').value = ''
            document.getElementById('nuevaContraRec').value = ''
        }

        else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El correo electronico ingresado es invalido',
            })
        }
    }

    
    const recuperarContrasena =  async () =>{
        if (email !=='') {
            console.log(email)
            await axios({
                method: 'put',
                url:serverUrl + "/usuarioUpdateContrasena", 
                headers: {'Content-Type': 'application/json'},
            params:
                {
                email: email
                }
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
                <Col xs md lg={12}>
                    <Row  className="titulo">RESTABLEZCA SU CONTRASEÑA</Row>
                    <Row className="parametros">
                        <Form id='formRecContra'>

                            <Form.Group className="mb-3" id="filaRecuperarContra">
                                <Form.Label>EMAIL</Form.Label>
                                <Form.Control className='formEmailInput' type="email" id='emailRec' placeholder="Ingrese su email" onChange={(
                                    event => setEmail(event.target.value)
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
                                    <Button className='botonCrearCuenta' onClick={validarContraseñaAntigua}>RECUPERAR CONTRASEÑA</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Row>
                </Col>
            </Container>
        </div>
  );
}
    

export default OlvidarContraseña