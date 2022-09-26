import {useEffect} from 'react';

const Votar = () => {
    const closeTab = () => {
        window.close();
    };
    //<button onClick={closeTab}>Close Tab</button>
    return (
        <div>Votar
            <button onClick={() => closeTab()} >cerrar vista </button>
            a
        </div>
    )
        
    };

    


export default Votar


