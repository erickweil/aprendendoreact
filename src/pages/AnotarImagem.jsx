import Borda from "../components/Coisas/Borda";
import LayoutTituloConteudo from "../components/Coisas/LayoutTituloConteudo";
import MeuCanvas from "../components/Canvas/MeuCanvas";
const AnotarImagem = () => {

    const draw = (ctx, frameCount) => {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;
        ctx.clearRect(0, 0, w,h);
        
        //ctx.beginPath()
        //ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
        //ctx.fill()
        const b = 32
        ctx.fillStyle = '#0000ff';
        ctx.fillRect(0, 0, w, b);
        ctx.fillRect(0, h-b, w, b);

        ctx.fillStyle = '#00ff00';
        ctx.fillRect(0, 0, b, h);
        ctx.fillRect(w-b, 0, b, h);
    }

    return (
        <>
    {
    //<LayoutTituloConteudo  titulo="Anotador de Imagens">
    }
            <MeuCanvas draw={draw} options={{}} />
    {
    //</LayoutTituloConteudo>
    }
        </>
    );
};
  
export default AnotarImagem;