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

import { CgAdd } from "react-icons/cg";
import { BsArchive } from "react-icons/bs";
//import { GiReturnArrow } from "react-icons/gi";
import {MdPerson} from "react-icons/md";


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

const dropdown = document.getElementById('dropDownUser');

window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  const navbarHeight = navbar.offsetHeight;
  const navbarTop = navbar.getBoundingClientRect().top + window.scrollY;

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const topOffset = Math.max(navbarHeight, scrollTop - navbarTop);

  dropdown.style.top = topOffset + 'px';
});



const MyNavbar = (props) => {
    var nombre = conectado.get('nombre'); 
    

  return (
    <div>
    <Navbar collapseOnSelect expand="lg" id="navbar" variant="dark">
      <Container id="containerNav">
        <Navbar.Brand id='titulo' href="/">Software de votación electrónica</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav id='navbarContenedor' variant="pills" defaultActiveKey={props.activeKey} disabled={props.activeKey} >

            {/* <Nav.Item className="botonesNavbar">
              <Nav.Link href="/paginaPrincipal" id='homeLink'><AiOutlineHome id='iconoHome'/> Home</Nav.Link>
            </Nav.Item>  */}

            {props.activeKey === '/crearVotacion' ?
              <Nav.Item className="botonesNavbar"> 
              <div id='contenedorCrearVotacionSelected'>
                {/* <Row id='filaGenerico'>
                  <Col className='colGenerico' id='columnaIcono'>
                  
                    <CgAdd id='iconoCrearVotacion'/> 
                  </Col>
                  <Col className='colGenerico'>
                    <NavDropdown  title="Crear Votación" id="colorDelDrop" >
                      <NavDropdown.Item href={`/crearVotacion/${'null'}/${'null'}`} className='interiorDropDown'>  Votación Normal</NavDropdown.Item>
                      <NavDropdown.Item href={`/crearVotacionUnGanador/${'null'}/${'null'}`} className='interiorDropDown'>Votación Única Selección</NavDropdown.Item>
                      <NavDropdown.Item href={`/crearVotacionDirectorio/${'null'}/${'null'}`}  className='interiorDropDown'>Votación Estratégica</NavDropdown.Item>
                    </NavDropdown>
                  </Col>
                </Row> */}
                <Nav.Item className="botonesNavbar">
                  <Nav.Link href="/controladorVotacion" id='navLink'><CgAdd id='iconoCrearVotacion'/>  Crear votación</Nav.Link>
                </Nav.Item> 
                
                
              </div>
              
            </Nav.Item> :

            <Nav.Item className="botonesNavbar"> 
            <div id='contenedorCrearVotacion'>
              {/* <Row id='filaGenerico'>
                <Col className='colGenerico' id='columnaIcono'>
                  <CgAdd id='iconoCrearVotacion'/> 
                </Col>
                <Col className='colGenerico'>
                  <NavDropdown  title="Crear Votación" id="colorDelDrop" >
                    <NavDropdown.Item href={`/crearVotacion/${'null'}/${'null'}`} className='interiorDropDown'>Votación Normal</NavDropdown.Item>
                    <NavDropdown.Item href={`/crearVotacionUnGanador/${'null'}/${'null'}`} className='interiorDropDown'>Votación Única Selección</NavDropdown.Item>
                    <NavDropdown.Item href= {`/crearVotacionDirectorio/${'null'}/${'null'}`} className='interiorDropDown'>Votación Estratégica</NavDropdown.Item>
                  </NavDropdown>
                </Col>
              </Row> */}
                <Nav.Item className="botonesNavbar">
                  <Nav.Link href="/controladorVotacion" id='navLink'><CgAdd id='iconoCrearVotacion'/>  Crear votación</Nav.Link>
                </Nav.Item> 
              
            </div>

            
            </Nav.Item> 

            }
            
            <Nav.Item className="botonesNavbar">
              <Nav.Link href="/misVotaciones" id='navLink'><BsArchive id='iconoMisVotaciones'/> Mis Votaciones</Nav.Link>
            </Nav.Item> 


            <Nav.Item className="botonesNavbar"> 
            <div id='contenedorCrearVotacion'>
              <Row id='filaGenerico'>
                <Col className='colGenerico' id='columnaIcono'>
                  <MdPerson id='iconoCrearVotacion'/> 
                </Col>
                
                <Col className='colGenerico'>
                  <NavDropdown  title={`${nombre}`} id="dropDownUser" >
                    <NavDropdown.Item href={`/recuperarContrasena`} className='interiorDropDown'>Cambiar Constraseña</NavDropdown.Item>
                    <NavDropdown.Item onClick={()=>cerrarSesion()} className='interiorDropDown'>Cerrar Sesión</NavDropdown.Item>
                  </NavDropdown>
                </Col>
              </Row>
              
            </div>
            </Nav.Item> 

            
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    
    </div>
    
  );
}


export default MyNavbar