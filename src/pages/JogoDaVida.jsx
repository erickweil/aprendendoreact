import {useEffect, useState, useRef} from 'react';
import LifeTable from "../components/LifeTable/LifeTable";

const JogoDaVida = () => {

    const [estado, setExec] = useState(
        {
            exec:false,
            gridSize:32
        }
    );

    // Executar ou não o jogo
    const toogleJogo = () => {
        setExec({exec:!estado.exec,gridSize:estado.gridSize});
    }

    const setSize = (size) => {
        console.log(size);
        setExec({exec:estado.exec,gridSize:size});
    }
    
    // O key={estado.gridSize} está setado pois o atributo key de um componente é especial
    // quando o atributo key é modificado, o inteiro componente é re-montado, zerando o estado 
    // É necessário re-montar quando muda o tamanho da grade
    return (
        <div className="App">
            <header className="App-header">
                <h2>Jogo da Vida</h2>
                <button className="App-textbutton" onClick={toogleJogo}>{estado.exec?"Parar":"Executar"}</button>
                <div>
                    <input type="number" value={estado.gridSize} 
                    onChange={(event) => setSize(parseInt(event.target.value))}
                    />
                </div>
                <LifeTable key={estado.gridSize} count={estado.gridSize} exec={estado.exec}>
                </LifeTable>
            </header>
        </div>
    );
};
  
export default JogoDaVida;