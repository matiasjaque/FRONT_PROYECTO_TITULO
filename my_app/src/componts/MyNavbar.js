import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import '../styles/MyNavbar.css';

import Cookies from 'universal-cookie';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Swal from 'sweetalert2';

import { AiOutlineHome } from "react-icons/ai";
import { CgAdd } from "react-icons/cg";
import { BsArchive } from "react-icons/bs";
import { GiEyeTarget, GiReturnArrow } from "react-icons/gi";


const conectado = new Cookies();


function cerrarSesion(){
    conectado.remove('id', {path:"/"});
    conectado.remove('nombre',{path:"/"})
    conectado.remove('apellido',{path:"/"})
    
    Swal.fire({title: "Cerrar Sesion",
                    icon: "success", timer: "2500"})
            setTimeout(function () {
                window.location.replace("/")               
            }, 2500);
}

const MyNavbar = (props) => {


  return (
    <div>
    <Navbar collapseOnSelect expand="lg" bg="dark" id="navbar" variant="dark">
      <Container id="containerNav">
        <Navbar.Brand id='titulo' href="/">SOFTWARE DE VOTACIÓN ELECTRONICA</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav id='navbarContenedor' variant="pills" defaultActiveKey={props.activeKey} disabled={props.activeKey} >

            <Nav.Item className="botonesNavbar">
              <Nav.Link href="/paginaPrincipal" id='homeLink'><AiOutlineHome id='iconoHome'/> Home</Nav.Link>
            </Nav.Item> 

            {props.activeKey === '/crearVotacion' ?
              <Nav.Item className="botonesNavbar"> 
              <div id='contenedorCrearVotacionSelected'>
                <Row id='filaGenerico'>
                  <Col className='colGenerico' id='columnaIcono'>
                  
                    <CgAdd id='iconoCrearVotacion'/> 
                  </Col>
                  <Col className='colGenerico'>
                    <NavDropdown title="Crear Votación" id="colorDelDrop">
                      <NavDropdown.Item href="/crearVotacion" className='interiorDropDown'>  Votación normal</NavDropdown.Item>
                      <NavDropdown.Item href="/crearVotacionUnGanador" className='interiorDropDown'>Votación especial</NavDropdown.Item>
                      <NavDropdown.Item href="/crearVotacionDirectorio" className='interiorDropDown'>Votación directorio</NavDropdown.Item>
                    </NavDropdown>
                  </Col>
                </Row>
                
              </div>
              
            </Nav.Item> :

            <Nav.Item className="botonesNavbar"> 
            <div id='contenedorCrearVotacion'>
              <Row id='filaGenerico'>
                <Col className='colGenerico' id='columnaIcono'>
                
                  <CgAdd id='iconoCrearVotacion'/> 
                </Col>
                <Col className='colGenerico'>
                  <NavDropdown title="Crear Votación" id="backgroundDelDrop">
                    <NavDropdown.Item href="/crearVotacion" className='interiorDropDown'>Votación normal</NavDropdown.Item>
                    <NavDropdown.Item href="/crearVotacionUnGanador" className='interiorDropDown'>Votación especial</NavDropdown.Item>
                    <NavDropdown.Item href="/crearVotacionDirectorio" className='interiorDropDown'>Votación directorio</NavDropdown.Item>
                  </NavDropdown>
                </Col>
              </Row>
              
            </div>

            {/* <Nav.Link href="/crearVotacion" id='createLink' ><CgAdd id='iconoCrearVotacion'/> Crear Votación </Nav.Link> */}
            </Nav.Item> 

            }
            
            <Nav.Item className="botonesNavbar">
              <Nav.Link href="/misVotaciones" id='navLink'><BsArchive id='iconoMisVotaciones'/> Mis Votaciones</Nav.Link>
            </Nav.Item> 
            
            <Nav.Item className="botonesNavbar">
              <Nav.Link onClick={()=>cerrarSesion()} id='returnLink'><GiReturnArrow id='iconoReturn'/> Cerrar Sesión</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    
    </div>
    
  );
}


export default MyNavbar