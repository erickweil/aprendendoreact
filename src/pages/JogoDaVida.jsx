import "./JogoDaVida.css";
import {useEffect, useState, useRef} from 'react';
import LifeTable from "../components/LifeTable/LifeTable";

const JogoDaVida = () => {

    const [estado, setExec] = useState(
        {
            exec:false
        }
    );

    // Executar ou não o jogo
    const toogleJogo = () => {
        setExec({exec:!estado.exec});
    }
    
    return (
        <div className="App">
            <header className="App-header">
                <h2>Jogo da Vida</h2>
                <button className="App-button" onClick={toogleJogo}>{estado.exec?"Parar":"Executar"}</button>
        
                <LifeTable count={32} exec={estado.exec}>
                </LifeTable>
            </header>
        </div>
    );
};
  
export default JogoDaVida;