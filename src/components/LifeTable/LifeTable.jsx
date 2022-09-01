
import {useEffect, useState, useRef} from 'react';
import LifeCell from "../LifeCell/LifeCell";

function LifeTable(props) {
    // Define o estado da grade
    // com 'count' de largura e altura
    // valores todos com 0 incialmente
    const count = props.count;
    const exec = props.exec;
    const [grade, setGrade] = useState(
        {
            g:Array(count).fill(null).map(() => Array(count).fill(0))
        }
    );

    // Função para Ativar/Desativar uma única célula
    const toggleCell = (x,y) => {
        grade.g[y][x] = grade.g[y][x] == 0 ? 1 : 0;
        setGrade({g:grade.g});
    };

    // Função para executar o jogo da vida na grade
    const execjogo = (grade) => {
        let g = grade.g;
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

        setGrade({g:gnext});
    };

   

    // Timer para executar a cada 100ms
    const execRef = useRef(exec); // para funcionar no timer
    execRef.current = exec;

    const gradeRef = useRef(grade); // para funcionar no timer
    gradeRef.current = grade;
    useEffect(() => {
        const timer = setInterval(() => {
            if(execRef.current)
                execjogo(gradeRef.current);
        }, 100);
        return () => clearInterval(timer);
    }, []);

    // Criar as células usando map 
    return (
        <>
        <table className="celltable">
        {
            grade.g.map(function (row,y) {
                return (
                <tr className="cellrow">
                {row.map(function (cell,x) {
                    return <LifeCell 
                    vivo = {grade.g[y][x]}
                    x={x}
                    y={y}
                    toggleCell={toggleCell}
                    ></LifeCell>    
                })}
                </tr>
                );
            })
        }
        </table>
        </>
    );
}

export default LifeTable;