import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import '../styles/MyNavbar.css';

import { AiOutlineHome } from "react-icons/ai";
import { CgAdd } from "react-icons/cg";
import { BsArchive } from "react-icons/bs";
import { GiEyeTarget, GiReturnArrow } from "react-icons/gi";





function cerrarSesion(){
    console.log("cerrandoSesion");
    window.location.replace("/");
}

const MyNavbar = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" id="navbar" variant="dark">
      <Container id="container">
        <Navbar.Brand id='titulo' href="/">SOFTWARE DE VOTACIÓN ELECTRONICA</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav id='navbarContenedor' variant="pills" defaultActiveKey="/home" >
            <Nav.Item className="botonesNavbar">
              <Nav.Link href="/home" id='homeLink'><AiOutlineHome id='iconoHome'/> Home</Nav.Link>
            </Nav.Item> 
            <Nav.Item className="botonesNavbar">
              <Nav.Link href="#pricingc" id='createLink'><CgAdd id='iconoCrearVotacion'/> Crear Votación </Nav.Link>
            </Nav.Item> 
            <Nav.Item className="botonesNavbar">
              <Nav.Link href="#pricingb" id='navLink'><BsArchive id='iconoMisVotaciones'/> Mis Votaciones</Nav.Link>
            </Nav.Item> 
            <Nav.Item className="botonesNavbar">
              <Nav.Link href="#pricinga" id='seeLink'><GiEyeTarget id='iconoVerResultados'/> Visualizar Resultados</Nav.Link>
            </Nav.Item> 
            <Nav.Item className="botonesNavbar">
              <Nav.Link onClick={()=>cerrarSesion()} id='returnLink'><GiReturnArrow id='iconoReturn'/> Cerrar Sesión</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


export default MyNavbar