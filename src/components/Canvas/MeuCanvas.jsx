import React from 'react'
import CanvasControler from './CanvasControler'
import "./MeuCanvas.css"
const MeuCanvas = props => {  

    const { draw, options, ...rest } = props
    const { context, ...moreConfig } = options
    const canvasRef = CanvasControler(draw, {context})

    return <canvas id="canvasInAPerfectWorld" ref={canvasRef} {...rest}/>
}

export default MeuCanvas