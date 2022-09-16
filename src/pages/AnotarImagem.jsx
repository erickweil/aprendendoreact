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

        if(estado.imagemFundo)
        {
            ctx.drawImage(estado.imagemFundo,
                estado.imagemFundoPos.x,estado.imagemFundoPos.y,
                estado.imagemFundoSize.x,estado.imagemFundoSize.y);
        }

        ctx.lineWidth = 2.0;
        if(estado.desenhando)
        {
            ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
            ctx.strokeStyle = "rgba(127, 0, 0, 0.7)";
            if(estado.desenhando.type == "rect") drawRect(ctx,estado.desenhando);
            else if(estado.desenhando.type == "poly") drawPoly(ctx,estado.desenhando);
        }

        if(estado.elementos)
        {
            ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
            ctx.strokeStyle = "rgba(0, 127, 0, 0.6)";
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

    const finishPoly = (e,estado) =>
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
    };

    const onClick = (e,estado) =>
    {
        

        if(e.button == 2)
        {
            return finishPoly(e,estado);
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
            return finishPoly(e,estado);
        }
    };

    const onKeyDown = (e,estado) =>
    {
        if(e.key == "Escape" || e.key == "Esc")
        {
            return finishPoly(e,estado);
        }
        if(e.key == "z" && e.ctrlKey) // Deletar último elemento desenhado quando apertar ctrl+z
        {
            if(estado.desenhando)
            {
                if(estado.desenhando.type == "poly" && estado.desenhando.points.length > 2)
                {
                    estado.desenhando.points.pop();
                    return {
                    desenhando:estado.desenhando
                    };
                }
                else return {
                    desenhando:false
                };
            }
            else if(estado.elementos.length > 0)
            {
                estado.elementos.pop();
                return {
                    elementos:estado.elementos
                };
            }
        }
    }

    
    const getInitialState = (estado) => {
        // Só alterar o estado com mesclarEstado
        // Então o Canvas gerencia as mudanças assim decidindo re-desenhar
        mesclarEstado(estado,{
            tipoAtivo:"rect",
            desenhando:false,
            elementos:[],
            imagemFundo: false,
            imagemFundoPos: {x:0,y:0},
            imagemFundoScale: 1.0
        });

        const myImg = new Image();
        myImg.onload = () => {

            let imgW = myImg.naturalWidth;
            let imgH = myImg.naturalHeight;

            const W = estado.width;
            const H = estado.height;

            let scaleX = 1;
            if (imgW > W)
                scaleX = W/imgW;

            let scaleY = 1;
            if (imgH > H)
                scaleY = H/imgH;

            let scale = scaleY;
            if(scaleX < scaleY)
                scale = scaleX;
            
            imgH = imgH*scale;
            imgW = imgW*scale; 
            
            mesclarEstado(estado,{
                imagemFundo: myImg,
                imagemFundoPos: {
                    x:estado.width/2 - imgW /2,
                    y:estado.height/2 - imgH /2
                },
                imagemFundoSize: {
                    x:imgW,
                    y:imgH
                }
            });
        };
        myImg.src = 'https://cdn.vercapas.com.br/covers/folha-de-s-paulo/2022/capa-jornal-folha-de-s-paulo-16-09-2022-c4a2010f.jpg';
    };

    return (
        <ZoomableCanvas
        getInitialState={getInitialState}
        uidraw={myuidraw}
        draw={mydraw}
        events={{
            onKeyPress:onKeyPress,
            onKeyDown:onKeyDown,
            onMouseDown:onMouseDown,
            onMouseMove:onMouseMove,
            onMouseUp:onMouseUp,
            onClick:onClick
        }}
        options={{
            spanButton:"right",
            maxZoomScale:100.0,
            minZoomScale:0.20
        }}
        />
    );
};
  
export default AnotarImagem;