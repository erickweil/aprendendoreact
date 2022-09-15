import Borda from "../components/Coisas/Borda";
import LayoutTituloConteudo from "../components/Coisas/LayoutTituloConteudo";
import MeuCanvas from "../components/Canvas/MeuCanvas";
const AnotarImagem = () => {

    const draw = (ctx, canvasInfo) => {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;
        ctx.clearRect(0, 0, w,h);
        
        const b = 32
        ctx.fillStyle = '#0000ff';
        ctx.fillRect(0, 0, w, b);
        ctx.fillRect(0, h-b, w, b);

        ctx.fillStyle = '#00ff00';
        ctx.fillRect(0, 0, b, h);
        ctx.fillRect(w-b, 0, b, h);

        ctx.fillRect(canvasInfo.mouse.x,canvasInfo.mouse.y,b,b);
    }

    return (
        <MeuCanvas draw={draw} options={{}} />
    );
};
  
export default AnotarImagem;