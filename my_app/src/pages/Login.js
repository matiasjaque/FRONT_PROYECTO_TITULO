import React, {useRef, useEffect, useState} from 'react'
import '../styles/Login.css';
import 'bootstrap/dist/css/bootstrap.css';
import fondo from '../assets/fondo.png';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const serverUrl = process.env.REACT_APP_SERVER;

function Login() {
    const userRef = useRef();
    const errRef = useRef();

    /* const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [login, setLogin] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => { 
        setError('');
    }, [email, password]) */

    const [login, setLogin] = useState({
        email: '',
        password: '',
    });

    const imagenFondo = {
        backgroundImage: `url(${fondo})`,
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        height: '100vh',
        //width: '100vw'
      };

  return (
    <div style={imagenFondo} className='contenedorPrincipal'>
        <div className='contenedorSecundario'>
            <h1 className='titulo'>Software De Votación Electronica</h1>
            {JSON.stringify(login)}
            <Form className='contenedorForm'>
                <Form.Group className='mb-3' controlId="formBasicEmail">
                    <Form.Control className='formEmailInput' id='email' type="email" placeholder="Ingrese su email"  onChange={(event) => {
                        const value = event.target.value;
                        console.log(value);
                        setLogin({...login, email: value});
                    }}/>
                </Form.Group>

                <Form.Group className="mb-3" id='password' controlId="formBasicPassword">
                    <Form.Control type="password" id='contraseña' placeholder="Ingrese su contraseña" onChange={(event) => {
                        const value = event.target.value;
                        console.log(value);
                        setLogin({...login, password: value});
                    }}/>
                </Form.Group>
                <Button id="botonLogin" variant="primary" type="submit">
                    Iniciar Sesión
                </Button>
            </Form>
            <div>
                <Button id="botonOlvideContraseña" variant="primary" type="submit">
                    ¿Olvidaste tu contraseña?
                </Button>
                <Button id="botonRegistrarse" variant="primary" type="submit">
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