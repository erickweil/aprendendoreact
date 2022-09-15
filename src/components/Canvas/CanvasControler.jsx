import { useRef, useState, useEffect } from 'react'
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
*/
const CanvasControler = (draw,getInitialState, options={}) => {
  
  
  const [estado,setEstado] = useState(null);
  if(!estado) setEstado(getInitialState());

  const canvasRef = useRef({canvas:null,estado:estado});
  canvasRef.current.estado = estado;

  useEffect(() => {
  
    console.log("CRIOU O CANVAS")
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
      draw(context,canvasRef.current.estado);

      // auto-registra novamente
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
  
  return [estado,setEstado,canvasRef];
}
export default CanvasControler;