import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from '../pages/Login';
import PaginaPrincipal from '../pages/PaginaPrincipal';
import Registrarse from '../pages/Registrarse';
import RecuperarContraseña from '../pages/RecuperarContraseña';
import OlvidarContraseña from '../pages/OlvidarContraseña';
import CrearVotacion from '../pages/CrearVotacion';
import MisVotaciones from '../pages/MisVotaciones';
import Votar from '../pages/Votar';
import VotarNormal from '../pages/VotarNormal';
import ResultadosVotacion from '../pages/ResultadosVotacion';
import CrearVotacion2 from '../pages/CrearVotacion2';
import CrearVotacion3 from '../pages/CrearVotacion3';
import ControladorVotacion from '../pages/ControladorVotacion';
import Prueba from '../pages/Prueba';
import VerVotacion from '../pages/VerVotacion';

function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/paginaPrincipal" element={<PaginaPrincipal />} />
        <Route path="/registrarse" element={<Registrarse />} />
        <Route path="/recuperarContrasena" element={<RecuperarContraseña />} />
        <Route path="/crearVotacion/:tipo/:idVotacion" element={<CrearVotacion />} />
        <Route path="/crearVotacionUnGanador/:tipo/:idVotacion" element={<CrearVotacion2/>} />
        <Route path="/crearVotacionDirectorio/:tipo/:idVotacion" element={<CrearVotacion3/>} />
        <Route path="/misVotaciones" element={<MisVotaciones />} />
        <Route path="/resultadosVotacion/:estado/:idVotacion" element={<ResultadosVotacion/>} />
        <Route path="/votar/:id/:estadoVotacion/:idPreg" element={ <Votar/>}/>
        <Route path="/votarNormal/:id/:estadoVotacion/:idPreg" element={ <VotarNormal/>}/>
        <Route path="/olvidarContrasena" element={<OlvidarContraseña/>} />
        <Route path="/controladorVotacion" element={ <ControladorVotacion/>}/>
        <Route path="/verVotacion/:idVotacion/:idPreg" element={ <VerVotacion/>}/>
        <Route path="/prueba2" element={ <Prueba/>}/>
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
