import { useRef, useEffect } from 'react'
import TouchManager from './TouchManager';
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
const CanvasControler = (draw, options={}) => {
  
  const canvasRef = useRef(null);
  
  useEffect(() => {
    
    const canvas = canvasRef.current;
    const context = canvas.getContext(options.context || '2d');
    let canvasInfo = {
      frameCount:0,
      mouse:{x:0,y:0}
    };
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

    const mousedown = (e) => {};
    const mousemove = (e) => {
      canvasInfo.mouse = {x:e.pageX - canvas.offsetLeft,y:e.pageY- canvas.offsetTop};
    };
    const mouseup = (e) => {};
    const mousewheel = (e) => {};
    const dozoom = (p,zoomDelta) => {};

    // Listeners
    
    canvas.addEventListener("mousedown",(e) => mousedown(e));
		canvas.addEventListener("mousemove",(e) => mousemove(e));
		canvas.addEventListener("contextmenu",(e) => mouseup(e));
		canvas.addEventListener("mouseup",(e) => mouseup(e));
		canvas.addEventListener("wheel",(e) => mousewheel(e));
		
    // O touch manager visa simplificar o manuseio de toques como se fosse cliques do mouse normal
		const touchManager = new TouchManager();
		canvas.addEventListener("touchstart",(e) => {touchManager.touchstart(e);}, false);
		canvas.addEventListener("touchmove",(e) => {touchManager.touchmove(e);}, false);
		canvas.addEventListener("touchend", (e) => {
			e.preventDefault(); // prevent 300ms after a tap event?
			touchManager.touchend(e);
		}, false);
		canvas.addEventListener("touchcancel",(e) => {touchManager.touchcancel(e);}, false);
		canvas.addEventListener("touchleave",(e) => {touchManager.touchleave(e);}, false);
		
		touchManager.addEventListener("onTouchDown",(p,ntouches) => {mousedown({pageX:p.x,pageY:p.y,button:ntouches})}, false);
		touchManager.addEventListener("onTouchMove",(p,ntouches) => {mousemove({pageX:p.x,pageY:p.y,button:ntouches})}, false);
		touchManager.addEventListener("onTouchUp",(p,ntouches) => {mouseup({pageX:p.x,pageY:p.y,button:ntouches})}, false);
		touchManager.addEventListener("onTouchZoom",(p,zoomDelta) => {dozoom(p,zoomDelta)}, false);
				

    // Timer que se auto-registra recursivamente
    const render = () => {

      // Controle do desenho
      canvasInfo.frameCount++;
      draw(context, canvasInfo);

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
  
  return canvasRef;
}
export default CanvasControler;