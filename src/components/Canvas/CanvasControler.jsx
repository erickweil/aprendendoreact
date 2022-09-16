import { useRef, useState, useEffect } from 'react'
import { mesclarEstado } from './MeuCanvas';
//import TouchManager from './TouchManager';
/*
https://www.pluralsight.com/guides/re-render-react-component-on-window-resize
Currently, our example code is set up to call handleResize as often
as the window resizes. We're setting state and re-rendering for every 
single pixel change as often as the event loop will let us.

But what if there's a good reason to handling the resizing less often
than that? We might want to be less aggressive in our re-rendering for 
performance reasons, such as in the case of a slow or expensive-to-render component.

In such a case, we can debounce the resize handling and thus the re-rendering.
This will mean to throttle or wait between calls to our handleResize function. 
There are solid debounce implementations. Let's add a short and simple one to our example:
*/
function debounce(fn, ms) {
  let timer
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  };
}

/*
https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258

Canvas Controler, handles resizing and animationframe callbacks
also handles state using useRef only... to prevent re-renders
*/
const CanvasControler = (draw,getInitialState, options={}) => {
  
  
  //const [estado,setEstado] = useState(null);
  //if(!estado) setEstado(getInitialState());

  // Usando só useRef pra não causar um re-render toda vez
  // https://www.smashingmagazine.com/2020/11/react-useref-hook/
  const canvasRef = useRef({canvas:null,estado:null});
  if(!canvasRef.current.estado)
  {
    canvasRef.current.estado =  getInitialState();
  }

  // GetEstado
  // Essa função garante que:
  // - O estado obtido sempre é o mais recente
  //   - Um conflito de mesclagem é evitado por alterar o próprio objeto com novos valores e então realizar o setEstado
  // - Cada mudança de estado mudará apenas o necessário
  const getEstado = () => {
    if(!canvasRef) return {};

    return canvasRef.current.estado;
  };

  // Executa o evento e mescla o estado
  const doEvent = (callback,e) => 
  {
    const _estado = getEstado();

    // Pode retornar apenas o que mudou como um novo objeto
    // O mesmo objeto já modificado
    // Um objeto vazio
    // Ou retornar nada.
    const novoEstado = callback(e,_estado);

    // Em qualquer situação, mesclarEstado faz com que o novoEstado seja aplicado
    // Apenas alterando propriedades no mesmo objeto, sem necessidade de alterar o ref
    mesclarEstado(_estado,novoEstado);
    
    //setEstado({..._estado}); -- NÃO USAR ESTADO MAIS
  };

  useEffect(() => {
  
    console.log("useEffect do CanvasControler")
    const canvas = canvasRef.current.canvas;
    const context = canvas.getContext((options && options.context) || '2d');
    let frameCount = 0;
    // Timer
    let animationFrameId;

    // Listener de Resize
    const doResize = (e) => {
      const { top, left } = canvas.getBoundingClientRect();
      const width = window.innerWidth;
      const height = window.innerHeight - top;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const debounceHandleResize = debounce(doResize,100);
    window.addEventListener("resize", debounceHandleResize);

    // Timer que se auto-registra recursivamente
    const render = () => {

      // Controle do desenho
      frameCount++;
      draw(context,getEstado());

      // auto-registra novamente
      // TODO: só pedir um AnimationFrame se houve uma mudança mesmo para ser feita.
      animationFrameId = window.requestAnimationFrame(render);
    }

    // Inicia o Timer
    doResize();
    render();

    // Retorna a função que cancela o timer
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", debounceHandleResize);
    }
  }, [draw]);

  return [doEvent,canvasRef];
}
export default CanvasControler;