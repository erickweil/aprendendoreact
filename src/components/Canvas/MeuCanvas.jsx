import React from 'react'
import CanvasControler from './CanvasControler'
import TouchManager from "./TouchManager";
import "./MeuCanvas.css"

const MeuCanvas = props => {  

    console.log("Criou o MeuCanvas");

    const { getInitialState, draw, options, events, ...rest } = props
    const { context, ...moreConfig } = options
    const [doEvent,canvasRef] = CanvasControler(draw,getInitialState, {context})
    
    let myListeners = {
        onContextMenu:(e,estado) => { 
            if(events.onContextMenu) 
                return events.onContextMenu(e,estado);
            else
                e.preventDefault(); // evitar abrir a janela contextMenu ao clicar o botão direito       
        },
        onTouchStart:(e,estado) => { touchManager.touchstart(e,estado); },
        onTouchMove:(e,estado) => { touchManager.touchmove(e,estado); },
        onTouchEnd:(e,estado) => { 
            // Impedir um evento de tap
            e.preventDefault();
            touchManager.touchend(e,estado); },
        onTouchCancel:(e,estado) => { touchManager.touchcancel(e,estado); }
    };

    for (const k in events) {
        if(!(k in myListeners))
        myListeners[k] = (e) => { doEvent(events[k],e); }
    }
  
    // TouchManager gerencia para que funcione em ambientes de toque perfeitamente
    // Basicamente o TouchManager faz ficar igual a quando é clique do mouse 
    // 1 toque -> Botão esquerdo
    // 2 toques -> Botão direito
    // 3 toques -> Botão do meio
    // (Especialmente necessário para funcionar o pinch zoom + span)
    const touchManager = new TouchManager();
  
    touchManager.addEventListener("onTouchDown",(...args) => {myListeners.onMouseDown && myListeners.onMouseDown(...args)}, false);
    touchManager.addEventListener("onTouchMove",(...args) => {myListeners.onMouseMove && myListeners.onMouseMove(...args)}, false);
    touchManager.addEventListener("onTouchUp",(...args) => {myListeners.onMouseUp && myListeners.onMouseUp(...args)}, false);
    touchManager.addEventListener("onTouchZoom",(...args) => {
        myListeners.doZoom && myListeners.doZoom(...args);
    }, false);
    
    // Removing custom doZoom listener from canvasListeners to prevent React Error
    const { doZoom, ...canvasListeners} = myListeners;
    return <canvas
        tabIndex="0"
        id="canvasInAPerfectWorld" 
        ref={el => canvasRef.current.canvas = el}
        {/*
        onMouseMove={(e) => { events.onMouseMove && doEvent(events.onMouseMove,e); }} 
        onMouseDown={(e) => { events.onMouseDown && doEvent(events.onMouseDown,e); }} 
        onMouseUp={(e) => { events.onMouseUp && doEvent(events.onMouseUp,e); }} 
        onContextMenu={(e) => { events.onContextMenu && doEvent(events.onContextMenu,e); }} 
        onWheel={(e) => { events.onWheel && doEvent(events.onWheel,e); }} 
        onTouchStart={(e) => { events.onTouchStart && doEvent(events.onTouchStart,e); }} 
        onTouchMove={(e) => { events.onTouchMove && doEvent(events.onTouchMove,e); }} 
        onTouchEnd={(e) => { events.onTouchEnd && doEvent(events.onTouchEnd,e); }} 
        onTouchCancel={(e) => { events.onTouchCancel && doEvent(events.onTouchCancel,e); }} 
        */
       ...canvasListeners}
        
        {...rest}    
    />;
}

export default MeuCanvas