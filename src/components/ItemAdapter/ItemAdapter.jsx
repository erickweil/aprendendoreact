import {useEffect, useState, useRef} from 'react';
import Borda from '../Coisas/Borda';
function ItemAdapter(props) {
    
    // Depois fazer receber a rota de pesquisa e realizar 
    // o pedido para api dos dados necessários
    const [estado, setEstado] = useState(props.getItems(1,props.itemsPorPagina));

    const mudarPagina = (pagina) => {
        setEstado(props.getItems(pagina,props.itemsPorPagina));
    }

    // Calcula quantas páginas deve exibir e cria os elementos da paginação
    const maxPaginas = props.maxPaginas ? props.maxPaginas : 5;
    let primeiraPagina = Math.max(estado.pagina-Math.floor(maxPaginas/2),1);
    let ultimaPagina = Math.min(primeiraPagina+maxPaginas-1,estado.npaginas);

    if(ultimaPagina-primeiraPagina+1 < maxPaginas)
    {
        primeiraPagina = Math.max(ultimaPagina-maxPaginas+1,1);
    }

    let elementosPaginacao = [];
    
    let quantasPaginas = ultimaPagina-primeiraPagina+1;
    for(let k = 0;k<quantasPaginas;k++)
    {
        const p = primeiraPagina+k;
        elementosPaginacao.push(<button 
        key={p}
        className={p == estado.pagina ? "App-button highlight" : "App-button"} 
        onClick={() => mudarPagina(p)}>
            {p}
        </button>);
    }


    return (
    <Borda>
        <div className="rowContainer">
        {
            (!estado.items || estado.items.length == 0)? 
                <p>Nenhum item para exibir</p>
            :
                estado.items.map((item,k) => {
                    // modelo que controla como um item será desenhado
                    return (
                        <div className="item" key={k}>
                            {props.layout({item:item})}
                        </div>
                    );
                })
        }
        </div>
        <hr/>
        <span className="colContainer right">
        {elementosPaginacao}
        </span>
    </Borda>    
    );
}

export default ItemAdapter;