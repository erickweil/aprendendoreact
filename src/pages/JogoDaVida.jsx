import "./JogoDaVida.css";
import {useEffect, useState, useRef} from 'react';
import LifeCell from "../components/LifeCell/LifeCell";

const JogoDaVida = () => {
    const count = 24;

    const [grade, setGrade] = useState(
        {
            g:Array(count).fill(null).map(() => Array(count).fill(0)),
            exec:false
        }
    );

    const toggleCell = (x,y) => {
        grade.g[y][x] = grade.g[y][x] == 0 ? 1 : 0;

        setGrade({g:grade.g,exec:grade.exec});
    };

    const rows = [];
    const celltable = [];
    for(let y = 0;y<count;y++)
    {
        let columns = [];
        for(let x = 0;x<count;x++)
        {
            const col = <LifeCell 
            vivo = {grade.g[y][x]}
            x={x}
            y={y}
            toggleCell={toggleCell}
            ></LifeCell>;
            columns.push(col);
        }
        const row = <tr className="cellrow">{columns}</tr>;
        rows.push(row);

        celltable.push(columns);
    }

    const gradeRef = useRef(grade);
    gradeRef.current = grade;
    const execjogo = () => {
        let g = gradeRef.current.g;
        let gnext = Array(count).fill(null).map(() => Array(count).fill(0));

        for(let y = 1;y<=count;y++)
        {
            for(let x = 1;x<=count;x++)
            {
                let cell = g[y%count][x%count];
                const neigh = 
                      g[(y-1)%count][(x-1)%count]
                    + g[(y-1)%count][(x-0)%count]
                    + g[(y-1)%count][(x+1)%count]

                    + g[(y-0)%count][(x-1)%count]
                    //+ g[(y-0)%count][(x-0)%count]
                    + g[(y-0)%count][(x+1)%count]

                    + g[(y+1)%count][(x-1)%count]
                    + g[(y+1)%count][(x-0)%count]
                    + g[(y+1)%count][(x+1)%count];
                
                if(neigh < 2 || neigh > 3)
                cell = 0;
                if(neigh == 3)
                cell = 1;

                gnext[y%count][x%count] = cell;
            }
        }

        setGrade({g:gnext,exec:true});
    };

    const toogleJogo = () => {
        setGrade({g:grade.g,exec:!grade.exec});
    }

    useEffect(() => {
        const timer = setInterval(() => {
            if(gradeRef.current.exec)
                execjogo();
        }, 100);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h2>Jogo da Vida</h2>
                <button className="App-button" onClick={toogleJogo}>{grade.exec?"Parar":"Executar"}</button>
        
                <table className="celltable">
                    {rows}
                </table>
            </header>
        </div>
    );
};
  
export default JogoDaVida;