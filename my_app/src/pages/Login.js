import React, { useState} from 'react'
import '../styles/Login.css';
import 'bootstrap/dist/css/bootstrap.css';
import fondo from '../assets/fondo.png';

import axios from 'axios';
import Cookies from 'universal-cookie';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import Swal from 'sweetalert2';

const serverUrl = process.env.REACT_APP_SERVER;
const conectado = new Cookies();

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const imagenFondo = {
        backgroundImage: `url(${fondo})`,
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        height: '100vh',
        //width: '100vw'
      };

      const iniciarSesion =  async (e) =>{
        // conectado.set('id',1,{path:"/"});
        // conectado.set('nombre',"Victor",{path:"/"});
        // console.log(conectado);
        e.preventDefault();
        console.log("llama a iniciarSesion")
        console.log(email, password)
        await axios.get(serverUrl + "/login", {params:{email: email, password: password}})
        .then(response=>{
            console.log("la data funciona " + response.data);
            var respuesta = response.data;
            conectado.set('id', respuesta.ID,{path:"/"});
            conectado.set('nombre',respuesta.NOMBRE,{path:"/"})
            conectado.set('apellido',respuesta.APELLIDO_PATERNO,{path:"/"})
            Swal.fire({title: `Bienvenido  ${respuesta.NOMBRE} ${respuesta.APELLIDO_PATERNO}`,
                    icon: "success", timer: "2500"})
            setTimeout(function () {
                window.location.replace("/paginaPrincipal")               
            }, 2500);
            document.getElementById('email').value = ''
        })
        .catch(error=>{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: (error.response.data.message),
                timer: 3000
              })/* 
            alert();
            console.log(error); */
        })
            
    }

  return (
    <div style={imagenFondo} className='contenedorPrincipal'>
        <div className='contenedorSecundario'>
            <h1 className='titulo'>Software De Votación Electronica</h1>
            
            <Form className='contenedorForm' onSubmit={iniciarSesion}>
                <Form.Group className='mb-3' >
                    <Form.Control className='formEmailInput' id='email' type="email" placeholder="Ingrese su email"  onChange={(event) => {
                        var value = event.target.value;
                        console.log(value);
                        setEmail(value);
                    }}/>
                </Form.Group>

                <Form.Group className="mb-3" id='password' >
                    <Form.Control type="password" id='contraseña' placeholder="Ingrese su contraseña" onChange={(event) => {
                        const value = event.target.value;
                        console.log(value);
                        setPassword(value);
                    }}/>
                </Form.Group>
                <Button id="botonLogin" variant="primary" type="submit">
                    Iniciar Sesión
                </Button>
            </Form>
            <div className='contenedorBotones'>
                <Button id="botonOlvideContraseña" variant="primary" type="onClick" href='/recuperarContrasena'>
                    ¿Olvidaste tu contraseña?
                </Button>
                <Button id="botonRegistrarse" variant="primary" type="onclick" href='/registrarse' >
                    ¿No tienes una cuenta? Registrate
                </Button>
            </div>
        </div>
    </div>
    
  );
}


/* const useStyles = makeStyles(Theme => ({
    root: {
            backgroundImage: `url(${fondo})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh'    
    },
    container: {
        height: '60%',
        marginTop: '20px',


        
    },
    
})); */


/* function Login() {
    const classes = useStyles()

    return (
        <Grid container component='main' className={classes.root}   >
           <Container component={Paper} elevation={5} maxWidth='xs'>

           </Container>
        </Grid>
    ) */
  
//}

export default Login;