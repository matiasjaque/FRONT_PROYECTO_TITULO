import React, {useEffect, useState} from 'react'
//import {Chart, ArcElement, Pie} from 'chart.js'

import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';


import ChartDataLabels from 'chartjs-plugin-datalabels';




const Grafico = (props) => {

    const [respuestas, setRespuestas] = useState([]);
    const [votos, setVotos] = useState([]);
    const [backgroundData, setBackgroundData] = useState([]);



    useEffect( () => {
        var getRespuestas = [];
        var getVotos = [];
        var getBackGroundData = [];

        var totalVotos = 0;

        var votosPorcentaje = [];

        
        var backGroundDisponibles = ['#FFFF00', '#FFA500', '#FFDEAD', '#C0FF3E', '#FFFFE0',
                                    '#FFEC8B', '#E0FFFF', '#BFEFFF', '#FFC125', '#00FF00', 
                                    '#FFD700', '#FF3030', '#1E90FF', '#00BFFF', '#FF1493',
                                    '#FFD704', '#FF3034', '#1E90F4', '#00BFF4', '#FF1497'];

        for (var i in props.respuestas) {
            getRespuestas.push(props.respuestas[i].respuesta)
        }
    
        for (var j in props.respuestas) {
            getVotos.push(props.respuestas[j].votos)
        }
    
        for (let i = 0; i < props.respuestas.length; i++) {
            getBackGroundData.push(backGroundDisponibles[i])
        }

        for (let k in getVotos){
            totalVotos += getVotos[k]
        }

        /* console.log('totalVotos')
        console.log(totalVotos) */


        for( let l in getVotos){
            let porcentaje = ((getVotos[l] / totalVotos) * 100);


            if( Number.isInteger(porcentaje) ){
                votosPorcentaje.push(porcentaje)
            }

            else{
                votosPorcentaje.push(porcentaje.toFixed(1)  )
            }
        }
        /* console.log('votosPorcentaje')
        console.log(votosPorcentaje) */

        setRespuestas(getRespuestas)
        setVotos(votosPorcentaje)
        setBackgroundData(getBackGroundData)

    }, [props.respuestas])

    //console.log(props.respuestas)

    


    /* console.log('respuestas')
    console.log(respuestas)
    console.log('backgroundData')
    console.log(backgroundData)
    console.log('votos')
    console.log(votos) */

    
    const data = {
        labels: respuestas,
        datasets: [{
            data: votos,
            backgroundColor: backgroundData,
            
            
        }],
        hoverOffset: 10,
        
    };

    const opciones = {
        responsive: false,
        plugins: {
            datalabels: {
                formatter: (dato) => dato + "%",
                color: 'black',
                font:{
                    size: 22,
                        weight: '700',
                        family: 'sans-serif',
                }
            },
            
            legend: {display: true, position: 'top', 
                labels: {
                    color: 'black',
                    font: {
                        size: 16,
                        weight: 'bold',
                        family: 'sans-serif',
                    },
                },

            },
            
            
        },

        

        //tooltips: { enabled: false }
            
    }
        
        //height={400},
        //width={600}
        
    


  return (
    <Chart type='pie' data={data} options={opciones} plugins={[ChartDataLabels]} width={props.width} height={props.height}/>
  )
}

export default Grafico