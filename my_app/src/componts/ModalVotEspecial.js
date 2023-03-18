import React, { useEffect, useState} from 'react'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
import axios from 'axios';
import Cookies from 'universal-cookie';

const serverUrl = process.env.REACT_APP_SERVER;
const conectado = new Cookies();


var idUsuario = conectado.get('id');

const ModalVotEspecial = (props) => {
    const [idVotacionLocal, setIdVotacionLocal] = useState(1);
    const [idPregInsert, setIdPregInsert] = useState(0)
    const [porcentajeVot, setPorcentaje] = useState(0)
    const [tituloPreg, setTituloPreg] = useState("")

    // funciones que necesito cargar en cada render
  useEffect(() => {
    actualizarIdVotacion();
    actualizarIdPreguntas();
    setPorcentaje(props.porcentaje)
    setTituloPreg(props.tituloPregEspecial)
    
  },[props.porcentaje, props.tituloPregEspecial]);

  const actualizarIdVotacion = async () =>{
    await axios.get(serverUrl + "/votaciones", {params:{idUsuario: idUsuario}})
      .then(response=>{
        setIdVotacionLocal(response.data[response.data.length - 1].id_votacion)
        //setLoading(true);
        /* console.log("trae esto getVotaciones:");
        console.log(response.data[response.data.length - 1]); */
    })
    .catch (error=> {
      setIdVotacionLocal(0)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
      })
    })
};

const actualizarIdPreguntas = async () =>{
    await axios.get(serverUrl + "/preguntasGetGlobal")
      .then(response=>{
        
        setIdPregInsert(response.data[response.data.length - 1].ID_PREGUNTA)
        //setLoading(true);
        //console.log("trae esto getPreguntas:");
        //console.log(response.data[response.data.length - 1].ID_PREGUNTA);
    })
    .catch (error=> {
      setIdVotacionLocal(0)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
      })
    })
};





    const cambiarCheck = (usuario) => {
        
        /* alert('llame a cambiar check')
        console.log(usuario); */

        

        if(usuario.isCheck === true) {
            usuario.isCheck = false;
        }
        else{
            usuario.isCheck = true;
        }
        
        /* console.log("despues: ")
        console.log(usuario); */
    }

    const continuar = () => {
        //console.log(props.data)
        props.onHide();
        Swal.fire({
            title: 'Los usuarios se han registrado con exito, ¿desea continuar?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Si, crear la nueva votación!',
        }).then((result) => {
            if (result.isConfirmed) {
        Swal.fire({
            title: "Ingrese el titulo para su nueva votación!",
            text: "Titulo de votación",
            input: 'text',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Continuar',
            
            showCancelButton: true,  
            inputValidator: (value) => {
                if (!value) {
                return 'El campo del nuevo titulo es obligatorio!'
                }    
            }  
        }).then((result) => {
            if (result.value !== "" && result.value !== undefined) {
                
                // se llama la funcion de crear la votacion con el titulo obtenido en el input
                //logicaRepetirVotacionAuto(idVot, result.value)
                createVotacion(result.value)
                createPregunta()
                //console.log(props.data)
                props.data.forEach((r) => {
                    if(r.isCheck === true) {
                        createResp(r.nombre)
                    }
                    
                })
                Swal.fire(
                    'Votación creada!',
                    'Su votación ha sido creada con éxito',
                    'success',
                )
                setTimeout(function () {   
                    updateEstadoVotacion(props.idVotacion, idUsuario)  
                }, 1500);
                //console.log("Result: " + result.value);
            } 

            /* else{
                setTimeout(function () {   
                    cerrarVotacion(idVot, estado)  
                }, 1500);
            } */
    })}
        })
    }

    const createVotacion = async (tituloVotacion) =>{
        var idVot = idVotacionLocal + 1;
        var estado = 1;
        var porcentaje = porcentajeVot;
        console.log(idUsuario, tituloVotacion, idVot, porcentaje)
        await axios({
          method: 'post',
          url:serverUrl + "/votacionCreate", 
          headers: {'Content-Type': 'application/json'},
          params:
          {
            idUsuario: idUsuario,
            titulo: tituloVotacion,
            idVotacion: idVot,
            estado: estado,
            tipo: 'especial',
            porcentaje: porcentaje,
          }
        }).then(response=>{
          console.log("Funciona create votacion con id de votacion: ");
          console.log(response);
          //setIdVotacion(response.data.insertId);
        })
        .catch(error=>{
                alert(error.response.data.message);
                console.log(error);
              })
    };

    const createPregunta = async () =>{
        let idVot = idVotacionLocal + 1;
    
        let idPreguntaInsert = idPregInsert
    
        idPreguntaInsert++;
    
        console.log('idPregunta: ' )
        console.log(idPreguntaInsert);
    
        console.log('idVot: ' )
        console.log(idVot);
        await axios({
          method: 'post',
          url:serverUrl + "/preguntaCreate",
          headers: {'Content-Type': 'application/json'},
          params:
          {
            idVotacion: idVot,
            titulo: tituloPreg,
            idPregunta: idPreguntaInsert,
          }
        }).then(response=>{
          console.log("Funciona create pregunta ");
        })
        .catch(error=>{
                alert(error.response.data.message);
                console.log(error);
        })
    };

    const createResp = async ( tituloResp) =>{


        let idPreguntaInsert = idPregInsert + 1;
    
        console.log(idPreguntaInsert, tituloResp);
    
        await axios({
          method: 'post',
          url:serverUrl + "/respuestaCreate", 
          headers: {'Content-Type': 'application/json'},
          params:
          {
            idPregunta: idPreguntaInsert,
            respuestas: tituloResp,
          }
        }).then(response=>{
          console.log("Funciona create respuesta ");
        })
        .catch(error=>{
                alert(error.response.data.message);
                console.log(error);
              })
    };

    const updateEstadoVotacion = async (idVotacion, idUser) => {
        var estado = 0;
        //console.log(estado);
        await axios({
            method: 'put',
            url:serverUrl + "/votacionEstadoUpdate", 
            headers: {'Content-Type': 'application/json'},
            params:{idVotacion: idVotacion, idUsuario: idUser, estado: estado}
        }).then(response =>{
            window.location.reload(true);
        }).catch(error =>{
            alert(error.response.data.message);
            console.log(error);
        });
    };



    console.log(props.data)
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="tituloModalVisRes">
                    La votación no cumple con los requisitos estipulados!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>
                    Seleccione a los participantes que pasaran a la siguiente votación
                </h4>
      
                <Form>
                    {props.data.map((e) => (
                        
                        <Form.Check
                            type="checkbox"
                            label= {e.nombre}
                            name="group1"
                            id= {e.nombre}
                            /* checked={true} */
                            
                            defaultChecked={true}
                            onChange={() => cambiarCheck(e)}
                            
                        />
                    ))}
                </Form>
    
            </Modal.Body>
            <Modal.Footer>
                <Button id='botonCerrarVisRes' onClick={props.onHide}>Cancelar</Button>
                <Button id='botonCerrarVisRes' onClick={() => continuar()}>Registrar Usuarios</Button>
            </Modal.Footer>
        </Modal>
      )
}

export default ModalVotEspecial