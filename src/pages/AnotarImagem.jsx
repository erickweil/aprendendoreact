import ZoomableCanvas from "../components/Canvas/ZoomableCanvas";
const AnotarImagem = () => {

    const mydraw = (ctx,estado) => {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        const b = 32
        ctx.fillStyle = '#0000ff';
        ctx.fillRect(0, 0, w, b);
        ctx.fillRect(0, h-b, w, b);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(0, 0, b, h);
        ctx.fillRect(w-b, 0, b, h);

        if(estado.mouse)
        {
            if(estado.mouse.left)
            ctx.fillStyle = '#ff0000';
            else if(estado.mouse.middle)
            ctx.fillStyle = '#00ff00';
            else if(estado.mouse.right)
            ctx.fillStyle = '#0000ff';
            else 
            ctx.fillStyle = '#ffffff';

            ctx.fillRect(estado.mouse.x,estado.mouse.y,b,b);
        }

        if(estado.retangulos)
        {
            ctx.fillStyle = '#00ffff';
            estado.retangulos.map(function (ret) {
                ctx.fillRect(ret.x, ret.y, b, b);
            });
        }
    };

    const onMouseDown = (e,estado) =>
    {

    };

    const onMouseMove = (e,estado) =>
    {

    };

    const onMouseUp = (e,estado) =>
    {

    };

    const onClick = (e,estado) =>
    {
        const ret = {x:estado.mouse.x,y:estado.mouse.y};

        if(e.button == 2)
        {
            console.log(estado);
            return {};
        }
        else if(e.button == 0)
        {
            return {
                // Apesar de mesclar, filhos são substituídos, então é necessário mesclar aqui:
                retangulos:[ret,...(estado.retangulos ? estado.retangulos : [])]
            };
        }
    };

    return (
        <ZoomableCanvas
        spanButton="right"
        draw={mydraw}
        events={{
            onMouseDown:onMouseDown,
            onMouseMove:onMouseMove,
            onMouseUp:onMouseUp,
            onClick:onClick
        }}
        />
    );
};
  
export default AnotarImagem;