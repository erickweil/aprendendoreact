import React from 'react'
import CanvasControler from './CanvasControler'
import "./MeuCanvas.css"

export function mesclarEstado(estado,novoEstado) {
    // https://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
    //setEstado({...estado,...novoEstado});

    // Se não fizer assim, outras chamadas a updateEstado podem mesclar valores antigos e causar inconsistências
    // Experimenta comentar essa parte e descomentar a de cima e dar zoom. Agora dê zoom mexendo o mouse ou enquando arrasta a tela
    // Veja que tudo chacoalha loucamente, é porque dois eventos são enviado ao mesmo tempo com o mesmo objeto de estado
    // porém apenas um deles registra o estado sobrescrevendo o valor final. Este código visa resolver esse conflito de mesclagem
    if(!novoEstado) return;

    for (const k in novoEstado) {
        estado[k] = novoEstado[k];
    }
}

const MeuCanvas = props => {  

    const { getInitialState, draw, options, events, ...rest } = props
    const { context, ...moreConfig } = options
    const [estado,setEstado,canvasRef] = CanvasControler(draw,getInitialState, {context})
        
    // GetEstado
    // Essa função garante que:
    // - O estado obtido sempre é o mais recente
    //   - Um conflito de mesclagem é evitado por alterar o próprio objeto com novos valores e então realizar o setEstado
    // - Cada mudança de estado mudará apenas o necessário
    const getEstado = () => {
        if(!canvasRef) return {};

        return canvasRef.current.estado;
    }
    // Executa o evento e mescla o estado
    const doEvent = (callback,e) => 
    {
        const _estado = getEstado();

        const novoEstado = callback(e,_estado);

        mesclarEstado(_estado,novoEstado);
        setEstado({..._estado});
    };
    
    return <canvas
        id="canvasInAPerfectWorld" 
        ref={el => canvasRef.current.canvas = el}
        onMouseMove={(e) => { events.onMouseMove && doEvent(events.onMouseMove,e); }} 
        onMouseDown={(e) => { events.onMouseDown && doEvent(events.onMouseDown,e); }} 
        onMouseUp={(e) => { events.onMouseUp && doEvent(events.onMouseUp,e); }} 
        onContextMenu={(e) => { events.onContextMenu && doEvent(events.onContextMenu,e); }} 
        onWheel={(e) => { events.onWheel && doEvent(events.onWheel,e); }} 
        onTouchStart={(e) => { events.onTouchStart && doEvent(events.onTouchStart,e); }} 
        onTouchMove={(e) => { events.onTouchMove && doEvent(events.onTouchMove,e); }} 
        onTouchEnd={(e) => { events.onTouchEnd && doEvent(events.onTouchEnd,e); }} 
        onTouchCancel={(e) => { events.onTouchCancel && doEvent(events.onTouchCancel,e); }} 
        
        {...rest}    
    />;
}

export default MeuCanvas