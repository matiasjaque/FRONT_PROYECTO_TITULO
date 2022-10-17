import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from '../pages/Login';
import PaginaPrincipal from '../pages/PaginaPrincipal';
import Registrarse from '../pages/Registrarse';
import RecuperarContraseña from '../pages/RecuperarContraseña';
import CrearVotacion from '../pages/CrearVotacion';
import MisVotaciones from '../pages/MisVotaciones';
import Votar from '../pages/Votar';
import ResultadosVotacion from '../pages/ResultadosVotacion';
import Grafico from '../componts/Grafico';
import CrearVotacion2 from '../pages/CrearVotacion2';
import CrearVotacion3 from '../pages/CrearVotacion3';

function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/paginaPrincipal" element={<PaginaPrincipal />} />
        <Route path="/registrarse" element={<Registrarse />} />
        <Route path="/recuperarContrasena" element={<RecuperarContraseña />} />
        <Route path="/crearVotacion" element={<CrearVotacion />} />
        <Route path="/crearVotacionUnGanador" element={<CrearVotacion2/>} />
        <Route path="/crearVotacionDirectorio" element={<CrearVotacion3/>} />
        <Route path="/misVotaciones" element={<MisVotaciones />} />
        <Route path="/resultadosVotacion/:estado/:idVotacion" element={<ResultadosVotacion/>} />
        <Route path="/votar/:id/:estadoVotacion/:idPreg" element={ <Votar/>}/>
        <Route path="/prueba2" element={ <Grafico/>}/>
        <Route path="*" element={<NotFound/>} />
      </Routes>
      
    </BrowserRouter>
    
    /* <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter> */
  );
}

function NotFound() {
  return (
    <div>
      <h1>Ha llegado a una pagina que no existe</h1>
    </div>
  )
};

export default RoutesApp;
