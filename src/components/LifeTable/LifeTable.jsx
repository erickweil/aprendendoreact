import "./LifeTable.css";
import {useEffect, useState, useRef} from 'react';
import LifeCell from "../LifeCell/LifeCell";

// Define uma Tabela que simula o jogo da vida
// props contém os seguintes campos:
//  count: número que indica a largura e altura da tabela
//  exec: valor lógico que indica se o jogo será simulado ou não
function LifeTable(props) {

    // Cria um Array de Arrays
    const getNovaGrade = (n) => {
        //console.log("Criando nova grade "+n);
        return Array(count).fill(null).map(() => Array(count).fill(0));
    };

    // Define o estado da grade
    // com 'count' de largura e altura
    // valores todos com 0 incialmente
    const count = props.count;
    const exec = props.exec;
    const [grade, setGrade] = useState(
        {
            // cria a grade, um array de arrays com countXcount de tamanho
            g:getNovaGrade(count)
        }
    );

    //console.log(grade.g.length+" == "+count);

    // Função para Ativar/Desativar uma única célula
    const toggleCell = (x,y) => {
        grade.g[y][x] = grade.g[y][x] == 0 ? 1 : 0;
        setGrade({g:grade.g});
    };

    // Função para executar o jogo da vida na grade
    const execjogo = (grade) => {
        let g = grade.g;

        // É necessário criar uma grade vazia para receber
        // os novos valores de cada célula
        let gnext = getNovaGrade(count);

        // Dois for atravessam a grade
        for(let y = 1;y<=count;y++)
        {
            for(let x = 1;x<=count;x++)
            {
                // Célula x,y
                let cell = g[y%count][x%count];
                // Contar o número de vizinhos vivos
                // -1-1     0-1     1-1
                // -1 0     0 0     1 0
                // -1 1     0 1     1 1
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
                
                // Se a célula contém menos de dois vizinhos
                // ou mais que três vizinhos, morre
                if(neigh < 2 || neigh > 3)
                cell = 0;

                // Se a célula contém exatamente três vizinhos, vive
                if(neigh == 3)
                cell = 1;

                // Em outros casos continua como está.

                // aplicando o valor da célula na grade da próxima etapa
                gnext[y%count][x%count] = cell;
            }
        }

        // Atualiza o estado da grade
        setGrade({g:gnext});
    };

   
    
    // Timer para executar a cada 100ms
    const estadoRef = useRef({exec:exec,grade:grade}); // para funcionar no timer
    estadoRef.current = {exec:exec,grade:grade};

    useEffect(() => {
        const timer = setInterval(() => {
            if(estadoRef.current.exec)
                execjogo(estadoRef.current.grade);
        }, 100);
        return () => clearInterval(timer);
    }, []);

    // Criar as células usando map 
    return (
        
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
        
    );
}

export default LifeTable;