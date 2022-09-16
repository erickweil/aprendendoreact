import { mesclarEstado } from "../components/Canvas/CanvasControler";
import ZoomableCanvas from "../components/Canvas/ZoomableCanvas";
const AnotarImagem = () => {

    // Not affected by zooming and spanning
    const myuidraw = (ctx,estado) => {

    };

    const drawRect = (ctx,ret) => {
        let startx = ret.start.x;
        let starty = ret.start.y;
        let endx = ret.end.x;
        let endy = ret.end.y;

        if(startx > endx) [startx,endx] = [endx,startx];
        if(starty > endy) [starty,endy] = [endy,starty];

        ctx.fillRect(startx,starty,endx-startx,endy-starty);
        ctx.strokeRect(startx,starty,endx-startx,endy-starty);
    };

    const drawPoly = (ctx,poly) => {

        ctx.beginPath();

        for(let i=0;i<poly.points.length;i++)
		{
            const p = poly.points[i];
			ctx.lineTo(p.x,p.y);
		}

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };

    const mydraw = (ctx,estado) => {

        

        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        ctx.lineWidth = 6.0;
        if(estado.desenhando)
        {
            ctx.fillStyle = '#ff0000';
            ctx.strokeStyle = '#660000';
            if(estado.desenhando.type == "rect") drawRect(ctx,estado.desenhando);
            else if(estado.desenhando.type == "poly") drawPoly(ctx,estado.desenhando);
        }

        if(estado.elementos)
        {
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#666666';
            estado.elementos.map((e) => {
                if(e.type == "rect") drawRect(ctx,e);
                else if(e.type == "poly") drawPoly(ctx,e);
            });
        }
    };

    const onMouseDown = (e,estado) =>
    {
        if(e.button == 0)
        {
            const mouse = estado.mouse;
            const tipo = estado.tipoAtivo ? estado.tipoAtivo : "rect";

            if(!estado.desenhando)
            {
                let elem = {};
                
                if(tipo == "rect")
                {
                    elem = {type:tipo,start:{x:mouse.x,y:mouse.y},end:{x:mouse.x,y:mouse.y}};
                }
                else if(tipo == "poly")
                {
                    elem = {type:tipo,points:[{x:mouse.x,y:mouse.y},{x:mouse.x,y:mouse.y}]};
                }

                return {
                    desenhando:elem
                };
            }
            else
            {
                let elem = estado.desenhando;

                if(tipo == "poly")
                {
                    elem.points.push({x:mouse.x,y:mouse.y});
                }

                return {
                    desenhando:elem
                };
            }
        }
    };

    const onMouseMove = (e,estado) =>
    {
        if(estado.desenhando)
        {
            const mouse = estado.mouse;
            const elem = estado.desenhando;

            if(elem.type == "rect" && mouse.left)
            {
                elem.end.x = mouse.x;
                elem.end.y = mouse.y;
            }
            else if(elem.type == "poly")
            {
                const p = elem.points[elem.points.length-1];
                p.x = mouse.x;
                p.y = mouse.y;
            }

            return {
                desenhando:elem
            };
        }
    };

    const onMouseUp = (e,estado) =>
    {
        if(e.button == 0 && estado.desenhando)
        {
            const elem = estado.desenhando;
         
            if(elem.type == "rect")
            {
                estado.elementos.push(elem);
                return {
                    desenhando:false,
                    elementos:estado.elementos
                };
            }
            else if(elem.type == "poly")
            {

            }
        }
    };

    const onClick = (e,estado) =>
    {
        

        if(e.button == 2)
        {
            let elem = estado.desenhando;
            if(elem && elem.type == "poly")
            {
                estado.elementos.push(elem);
                return {
                    desenhando:false,
                    elementos:estado.elementos
                };
            }
        }
        
        if(e.button == 1)
        {
            return { tipoAtivo: estado.tipoAtivo == "rect" ? "poly" : "rect" };
        }
    };

    const onKeyPress = (e,estado) =>
    {
        console.log("Pressionado:"+e.key);

        if(e.key == "1")
            return { tipoAtivo:"rect" };
        if(e.key == "2")
            return { tipoAtivo:"poly" };
        if(e.key == "Enter")
        {
            let elem = estado.desenhando;
            if(elem && elem.type == "poly")
            {
                estado.elementos.push(elem);
                return {
                    desenhando:false,
                    elementos:estado.elementos
                };
            }
        }
    };

    
    const getInitialState = (estado) => {

        // Só alterar o estado com mesclarEstado
        // Então o Canvas gerencia as mudanças assim decidindo re-desenhar
        mesclarEstado(estado,{
            tipoAtivo:"rect",
            desenhando:false,
            elementos:[]
        });
    };

    return (
        <ZoomableCanvas
        getInitialState={getInitialState}
        spanButton="right"
        uidraw={myuidraw}
        draw={mydraw}
        events={{
            onKeyPress:onKeyPress,
            onMouseDown:onMouseDown,
            onMouseMove:onMouseMove,
            onMouseUp:onMouseUp,
            onClick:onClick
        }}
        />
    );
};
  
export default AnotarImagem;