import { useRef, useEffect } from 'react'

function resizeCanvasToDisplaySize(canvas) {
    
    const { width, height } = canvas.getBoundingClientRect()

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
      return true // here you can return some usefull information like delta width and delta height instead of just true
      // this information can be used in the next redraw...
    }

    return false
}

const CanvasControler = (draw, options={}) => {
  
  const canvasRef = useRef(null);
  
  useEffect(() => {
    
    const canvas = canvasRef.current;
    const context = canvas.getContext(options.context || '2d');
    let frameCount = 0;
    // Timer
    let animationFrameId;

    // Timer que se auto-registra recursivamente
    const render = () => {

      // Controle do desenho
      frameCount++;
      resizeCanvasToDisplaySize(canvas);
      draw(context, frameCount);

      // auto-registra novamente
      animationFrameId = window.requestAnimationFrame(render);
    }

    // Inicia o Timer
    render();

    // Retorna a função que cancela o timer
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    }
  }, [draw]);
  
  return canvasRef;
}
export default CanvasControler;