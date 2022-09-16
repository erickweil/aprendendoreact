import MeuCanvas from "./MeuCanvas";
import { mesclarEstado } from "./CanvasControler";
import { normalizeWheel } from "./TouchManager";

const ZoomableCanvas = (props) => {

    console.log("Criou o ZoomableCanvas");
    const { uidraw, draw, spanButton, events, getInitialState, ...rest } = props

    let offLeft = 0;
    let offTop = 0;

    // Transformar de posição local para tela
    const transfp = (p,span,scale) =>
	{
		let tp = {x:p.x - span.x,y:p.y - span.y};
		tp = {x:tp.x * scale + offLeft,y:tp.y * scale + offTop};

		return tp;
	};
	
    // Transformar de posição da tela para local
	const untransfp = (p,span,scale) =>
	{
		let tp = {x:(p.x-offLeft) / scale,y:(p.y-offTop) / scale};
		tp = {x:tp.x + span.x,y:tp.y + span.y};
		
		return tp;
	};

    // Obtêm o mouse em coordenadas locais
    const getMouse = (e,span,scale) => 
    {
        const umouse = untransfp({
            x:e.pageX,
            y:e.pageY
        },span,scale);


        return {
            pageX:e.pageX,
            pageY:e.pageY,
            x:umouse.x,
            y:umouse.y,
            left: e.buttons & 1,
            middle: e.buttons & 4,
            right: e.buttons & 2
        };
    };

    // Desenhar ou não algumas informações sobre a tela e o mouse
    const DEBUG = true;
    let DEBUG_N = 0;
    // Função que desenha tudo
    const mydraw = (ctx,estado) => {

        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        offLeft = ctx.canvas.offsetLeft * 1.0;
        offTop = ctx.canvas.offsetTop * 1.0;

        ctx.clearRect(0, 0, w,h);

        

        ctx.save();

        ctx.scale(estado.scale,estado.scale);
        ctx.translate(-estado.span.x,-estado.span.y);
        
        if(DEBUG)
        {
            const b = 32
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(0, 0, w, b);
            ctx.fillRect(0, h-b, w, b);
            
            ctx.fillRect(0, 0, b, h);
            ctx.fillRect(w-b, 0, b, h);

            if(estado.mouse)
            {
                ctx.fillStyle = "#" + 
                (estado.mouse.left ? "ff" : "00") +
                (estado.mouse.middle ? "ff" : "00") +
                (estado.mouse.right ? "ff" : "00");

                ctx.fillRect(estado.mouse.x-b/2,estado.mouse.y-b/2,b,b);
            }
        }
        draw(ctx,estado);

        ctx.restore();

        if(DEBUG)
        {
            const w = ctx.canvas.width;
            const h = ctx.canvas.height;
    
            const b = 32
            ctx.fillStyle = '#0000ff';
            ctx.fillRect(0, 0, w, b);
            ctx.fillRect(0, h-b, w, b);
            //ctx.fillStyle = '#00ff00';
            ctx.fillRect(0, 0, b, h);
            ctx.fillRect(w-b, 0, b, h);   

            ctx.fillStyle = '#ffffff';
            ctx.font = "30px Arial";
            ctx.fillText("Drawed:"+DEBUG_N, 10, 25);
            DEBUG_N++;

            ctx.fillText("Changes:"+estado._changes, 200, 25);
        }
        uidraw(ctx,estado);
    };

    // ############################
    //          Eventos
    // ############################
    // onMouseDown - Clicou o mouse
    // onMouseMove - Moveu o mouse
    // onMouseUp - Soltou o mouse
    // onWheel e doZoom - Controlar o zoom
    const onMouseDown = (e,estado) => {

        const mouse = getMouse(e,estado.span,estado.scale);

        const spanning = spanButton == "any" ||
        (spanButton == "left" && mouse.left) ||
        (spanButton == "middle" && mouse.middle) ||
        (spanButton == "right" && mouse.right);

        mesclarEstado(estado,{
            mouse:mouse,
            spanning: spanning,
            spanned:false,
            spanningStart:mouse
        });

        if(!spanning && events.onMouseDown) 
        mesclarEstado(estado,events.onMouseDown(e,estado));
    };

    const onMouseMove = (e,estado) => {
        const mouse = getMouse(e,estado.span,estado.scale);

        const span = estado.span;
        let spanned = estado.spanned;

        if(estado.spanning)
        {
            span.x -= mouse.x - estado.spanningStart.x;
            span.y -= mouse.y - estado.spanningStart.y;
            spanned = true;
        }

        mesclarEstado(estado,{
            mouse:getMouse(e,estado.span,estado.scale),
            span:span,
            spanned:spanned
        });

        if(!estado.spanning && events.onMouseMove) 
        mesclarEstado(estado,events.onMouseMove(e,estado));
    };

    const onMouseUp = (e,estado) => {
        const mouse = getMouse(e,estado.span,estado.scale);

        const wasSpanning = estado.spanning;
        const wasSpanned = estado.spanned;

        mesclarEstado(estado,{
            mouse:mouse,
            spanning:false

            // Apesar do updateEstado mesclar, filhos são substituídos, então é necessário mesclar aqui:
            //,retangulos:[mouse,...(estado.retangulos ? estado.retangulos : [])]
        });

        if(!wasSpanning && events.onMouseUp) 
        mesclarEstado(estado,events.onMouseUp(e,estado));

        if(!wasSpanning || (wasSpanning && !wasSpanned))
        {
            // applyclick?
            if(events.onClick) 
            mesclarEstado(estado,events.onClick(e,estado));
        }
    };

    const doZoom = (e,estado) => {  

        let scale = estado.scale;
        let span = estado.span;
        let mouse = estado.mouse;
        
        //let screenPos = {pageX:window.innerWidth/2.0,pageY:window.innerHeight/2.0};
        //let screenPos = mouse;

        let before = untransfp({
            x:e.pageX,
            y:e.pageY
        },span,scale);

		scale *= e.delta;
		scale = Math.max(Math.min(scale,20.0),0.25);
		
        let after = untransfp({
            x:e.pageX,
            y:e.pageY
        },span,scale);

		span.x -= after.x - before.x;
		span.y -= after.y - before.y;

        const newMousePos = untransfp({x:mouse.pageX,y:mouse.pageY},span,scale); // Atualiza o mouse com a nova transformação
        mouse.x = newMousePos.x;
        mouse.y = newMousePos.y;

        return {
            scale:scale,
            span:span,
            mouse:mouse
        };
    };

    const onWheel = (e,estado) => {

        const wheelDelta = normalizeWheel(e);
        const amount = 1.0 - Math.max(Math.min(wheelDelta.pixelY/200.0,0.2),-0.2);
        const mouse = estado.mouse;

        return doZoom({
            pageX:mouse.pageX,
            pageY:mouse.pageY,
            delta:amount
            },estado);
    };
    // Não é o jeito certo? idaí?
    const myGetInitialState = (estado) => {
        mesclarEstado(estado,{
            mouse:{pageX:0,pageY:0,x:0,y:0,left:false,middle:false,right:false},
            span:{x:0,y:0},
            spanning:false,
            scale:1.0,
            spanningStart:{x:0,y:0},
            spanned:false
        });

        //carrega o estado inicial de quem chamou
        getInitialState(estado);
    };

    let myListeners = {
        onMouseDown:onMouseDown,
        onMouseMove:onMouseMove,
        onMouseUp:onMouseUp,
        onWheel:onWheel,
        doZoom:doZoom
    };

    for (const k in events) {
        if(!(k in myListeners))
        myListeners[k] = events[k];
    }

    return <MeuCanvas 
    draw={mydraw}
    getInitialState={myGetInitialState}
    events={myListeners}
    options={{}} />;
    
};
  
export default ZoomableCanvas;