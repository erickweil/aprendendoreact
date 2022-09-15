import MeuCanvas, {mesclarEstado} from "./MeuCanvas";
import TouchManager, {normalizeWheel} from "./TouchManager";

const ZoomableCanvas = (props) => {

    console.log("Criou o ZoomableCanvas");
    const { draw, spanButton, events, ...rest } = props

    const touchManager = new TouchManager();
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


    const mydraw = (ctx,estado) => {

        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        offLeft = ctx.canvas.offsetLeft * 1.0;
        offTop = ctx.canvas.offsetTop * 1.0;

        ctx.clearRect(0, 0, w,h);
        ctx.save();

        ctx.scale(estado.scale,estado.scale);
        ctx.translate(-estado.span.x,-estado.span.y);
        
        draw(ctx,estado);

        ctx.restore();
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

        return estado;
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

        return estado;
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

        return estado;
    };

    const doZoom = (screenPos,amount,estado) => {  

        let scale = estado.scale;
        let span = estado.span;
        let mouse = estado.mouse;
        
        //let screenPos = {pageX:window.innerWidth/2.0,pageY:window.innerHeight/2.0};
        //let screenPos = mouse;

        let before = untransfp({
            x:screenPos.pageX,
            y:screenPos.pageY
        },span,scale);

		scale *= amount;
		scale = Math.max(Math.min(scale,20.0),0.25);
		
        let after = untransfp({
            x:screenPos.pageX,
            y:screenPos.pageY
        },span,scale);

		span.x -= after.x - before.x;
		span.y -= after.y - before.y;

        mesclarEstado(estado,{
            scale:scale,
            span:span,
            mouse: getMouse({pageX:mouse.pageX,pageY:mouse.pageY},span,scale) // Atualiza o mouse com a nova transformação
        });

        return estado;
    };

    const onWheel = (e,estado) => {

        let wheelDelta = normalizeWheel(e);
        let amount = 1.0 - Math.max(Math.min(wheelDelta.pixelY/200.0,0.2),-0.2);

        return doZoom(estado.mouse,amount,estado);
    };

    // TouchManager gerencia para que funcione em ambientes de toque perfeitamente
    // Basicamente o TouchManager faz ficar igual a quando é clique do mouse 
    // 1 toque -> Botão esquerdo
    // 2 toques -> Botão direito
    // 3 toques -> Botão do meio
    // (Especialmente necessário para funcionar o pinch zoom + span)
    touchManager.addEventListener("onTouchDown",(...args) => {onMouseDown(...args)}, false);
	touchManager.addEventListener("onTouchMove",(...args) => {onMouseMove(...args)}, false);
    touchManager.addEventListener("onTouchUp",(...args) => {onMouseUp(...args)}, false);
    touchManager.addEventListener("onTouchZoom",(e,...args) => {
        return doZoom(e,e.delta,...args);
    }, false);

    // Não é o jeito certo? idaí?
    const getInitialState = () => {
        console.log("SETANDO ESTADO INICIAL");
        return {
            mouse:{pageX:0,pageY:0,x:0,y:0,left:false,middle:false,right:false},
            span:{x:0,y:0},
            spanning:false,
            scale:1.0,
            spanningStart:{x:0,y:0},
            spanned:false
        };
    };

    return <MeuCanvas 
    draw={mydraw}
    getInitialState={getInitialState}
    events={{
        onMouseDown:onMouseDown,
        onMouseMove:onMouseMove,
        onMouseUp:onMouseUp,
        onContextMenu:(e,estado) => { 
            // evitar abrir a janela contextMenu ao clicar o botão direito       
            //if(e.button == 2) {
                e.preventDefault();
            //}
        },
        onWheel:onWheel,
        onTouchStart:(e,estado) => { touchManager.touchstart(e,estado); },
        onTouchMove:(e,estado) => { touchManager.touchmove(e,estado); },
        onTouchEnd:(e,estado) => { 
            // Impedir um evento de tap
            e.preventDefault();
            touchManager.touchend(e,estado); },
        onTouchCancel:(e,estado) => { touchManager.touchcancel(e,estado); }
    }}
    options={{}} />;
    
};
  
export default ZoomableCanvas;