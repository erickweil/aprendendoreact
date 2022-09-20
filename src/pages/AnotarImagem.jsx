import { mesclarEstado } from "../components/Canvas/CanvasControler";
import ZoomableCanvas from "../components/Canvas/ZoomableCanvas";
import { colisaoPoly, checkIntersection, colisaoRect, pontosRect,pontoMaisProximo } from "../geometria";
const AnotarImagem = (props) => {

    const defaultOptions = {
        spanButton:"right", // left | middle | right | any
        interactionStyle: "click", // click | drag
        maxZoomScale:50.0,
        minZoomScale:0.25,
        DEBUG: false,
        //minDist: 0.01, // Distância mínima que irá aceitar entre pontos. Fator que decide quando remover pontos duplicados em um formato
        minClickDist: 15 // Distância mínima para entender que clicou em um ponto
    };
    const options = props.options ? {...defaultOptions,...props.options} : defaultOptions;

    /**=================================================================
     *              FUNÇÕES QUE DESENHAM AS COISAS NA TELA
     * =================================================================
     */

    // Not affected by zooming and spanning
    const myuidraw = (ctx,estado) => {

    };

    const drawPoints = (ctx,points,color) => {
        const prevfillStyle = ctx.fillStyle;
        ctx.fillStyle = color;
        for(const point of points)
		{
            ctx.beginPath();
            ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);

            ctx.fill();
        }
        ctx.fillStyle = prevfillStyle ;
    }
    
    const drawRect = (ctx,ret,selecionado,ponto) => {
        const [a,b] = pontosRect(ret);

        ctx.fillRect(a.x, a.y, b.x-a.x, b.y-a.y);
        ctx.strokeRect(a.x, a.y, b.x-a.x, b.y-a.y);

        if(selecionado)
        {
            drawPoints(ctx,[a,b],"rgba(255, 0, 0, 1.0)");

            if(ponto == 0)
            drawPoints(ctx,[a],"rgba(255, 255, 255, 1.0)");

            if(ponto == 1)
            drawPoints(ctx,[b],"rgba(255, 255, 255, 1.0)");
        }
    };

    const drawPoly = (ctx,poly,selecionado,ponto) => {

        ctx.beginPath();

        for(let i=0;i<poly.points.length;i++)
		{
            const p = poly.points[i];
			ctx.lineTo(p.x,p.y);
		}

        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        if(selecionado)
        {
            drawPoints(ctx,poly.points,"rgba(255, 0, 0, 1.0)");

            if(ponto != -1)
            drawPoints(ctx,[poly.points[ponto]],"rgba(255, 255, 255, 1.0)");
        }
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
            if(estado.desenhando.type == "rect") 
                drawRect(ctx,estado.desenhando,true,1);
            else if(estado.desenhando.type == "poly") 
                drawPoly(ctx,estado.desenhando,true,estado.desenhando.points.length-1);
        }

        if(estado.elementos)
        {
            for(const e of estado.elementos)
            {
                const selecionado = estado.selecionado == e;
                if(selecionado)
                {
                    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
                    ctx.strokeStyle = "rgba(127, 0, 0, 0.6)";
                    ctx.lineWidth = 2.0;
                }
                else
                {
                    ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
                    ctx.strokeStyle = "rgba(0, 127, 0, 0.6)";
                    ctx.lineWidth = 1.0;
                }

                if(e.type == "rect") drawRect(ctx,e,selecionado,estado.editandoPonto);
                else if(e.type == "poly") drawPoly(ctx,e,selecionado,estado.editandoPonto);
            }
        }
    };

    /**=================================================================
     *      FUNÇÕES QUE FAZEM CÁLCULOS E ENCONTRAM ELEMENTOS
     * =================================================================
     */

    // Procura um elemento na posição especificada
    const encontrarElemento = (elementos,posicao) =>
    {
        for(const e of elementos)
        {
            if(e.type == "rect")
            {
                if(colisaoRect(e,posicao)) return e;
            }
            else if(e.type == "poly")
            {
                if(colisaoPoly(e,posicao)) return e;
            }
        }

        return false;
    }

    /**=================================================================
     *      FUNÇÕES QUE LIDAM COM NOVOS ELEMENTOS SENDO DESENHADOS
     * =================================================================
     */

    // Finalizar o desenho de um elemento, caso tenha algum
    const desenhandoConfirmar = (elementos,elem) =>
    {
        console.log("DESENHANDO CONFIRMAR:"+elem.type);

        if(elem.type == "poly" || elem.type == "rect")
        {
            elementos.push(elem);
            return {
                desenhando:false,
                desenhandoCliques: 0,
                elementos:elementos,
                selecionado: false
            };
        }
    };

    // Faz com que o elemento ativo no momento seja cancelado, ou etapas de seu desenho sejam des-feitas
    const desenhandoCancelar = (elem) =>
    {
        console.log("DESENHANDO CANCELAR:"+elem.type);

        if(elem.type == "poly" && elem.points.length > 2)
        {
            elem.points.pop();
            return {
                desenhando:elem
            };
        }
        else return {
            desenhando:false,
            desenhandoCliques: 0,
            selecionado: false
        };
    }

    // Inicia o desenho de um novo elemento.
    const desenhandoNovo = (tipo,posicao) =>
    {
        console.log("DESENHANDO NOVO:"+tipo+",["+posicao.x+","+posicao.y+"]");

        let elem = {};
                
        if(tipo == "rect") // A ferramenta ativa é desenhar retângulos
        {
            elem = {type:tipo,start:{x:posicao.x,y:posicao.y},end:{x:posicao.x,y:posicao.y}};
        }
        else if(tipo == "poly") // A ferramenta ativa é desenhar polígonos
        {
            elem = {type:tipo,points:[{x:posicao.x,y:posicao.y},{x:posicao.x,y:posicao.y}]};
        }

        // retorna o novo elemento como algo sendo desenhando no momento
        return {
            desenhando:elem,
            desenhandoCliques: 0, // reseta o número de cliques
            selecionado: false
        };
    }

    // Adiciona um novo ponto ao polígono sendo desenhado
    const desenhandoClique = (elem,posicao,ncliques) =>
    {
        console.log("DESENHANDO CLIQUE:"+elem.type+",["+posicao.x+","+posicao.y+"],"+ncliques);

        if(elem.type == "poly") // Adiciona um ponto ao polígono
        elem.points.push({x:posicao.x,y:posicao.y});

        return {
            desenhando:elem,
            desenhandoCliques: ncliques+1, // registra que um novo clique foi realizado
            selecionado: false
        };
    }

    // Mover o ponto do que está sendo desenhado
    const desenhandoMover = (elem,posicao) =>
    {
        if(elem.type == "rect") // Se é um retângulo, define o fim dele pela posição do mouse
        {
            elem.end.x = posicao.x;
            elem.end.y = posicao.y;
        }
        // Se é um polígono, define a posição do último ponto pela posição do mouse
        else if(elem.type == "poly") 
        {
            const p = elem.points[elem.points.length-1];
            p.x = posicao.x;
            p.y = posicao.y;
        }

        return {
            desenhando:elem
        };
    }

    /**=================================================================
     *      FUNÇÕES QUE LIDAM COM ELEMENTOS SENDO EDITADOS
     * =================================================================
     */

    // Clicou em um elemento selecionado
    const selecionadoClique = (elem,posicao) =>
    {
        const points = elem.type == "rect" ? pontosRect(elem) 
        : (elem.type == "poly" ? elem.points : [] );

        const [minP,minSqrDist] = pontoMaisProximo(points,posicao);

        if(minP != -1 && minSqrDist < options.minClickDist * options.minClickDist)
        {
            const retEstado = editandoPontoMover(elem,minP,posicao);
            
            return {...retEstado,...{
                editandoPonto: minP,
                desenhandoCliques: 0
            }};
        }

        return false;
    }
     // Edita um ponto
    const editandoPontoMover = (elem,ponto,posicao) =>
    {
        if(elem.type == "rect")
        {
            const rectPoints = pontosRect(elem);
            
            rectPoints[ponto].x = posicao.x;
            rectPoints[ponto].y = posicao.y;

            elem.start.x = rectPoints[0].x;
            elem.start.y = rectPoints[0].y;

            elem.end.x = rectPoints[1].x;
            elem.end.y = rectPoints[1].y;
            return {
                selecionado: elem,
                editandoPonto: ponto
            }
        }
        else if(elem.type == "poly")
        {
            elem.points[ponto].x = posicao.x;
            elem.points[ponto].y = posicao.y;

            return {
                selecionado: elem,
                editandoPonto: ponto
            }
        }
    }

    const editandoPontoClique = (elem,ponto,ncliques) =>
    {
        return {
            selecionado: elem,
            editandoPonto: ponto,
            desenhandoCliques: ncliques+1
        };
    }

    const editandoPontoConfirmar = (elem,ponto) =>
    {
        return {
            selecionado: elem,
            editandoPonto: -1,
            desenhandoCliques: 0
        };
    }

    const editandoPontoCancelar = (elem,ponto) =>
    {
        return {
            selecionado: elem,
            editandoPonto: -1,
            desenhandoCliques: 0
        };
    }

    /**=================================================================
     *       FUNÇÕES QUE LIDAM COM OS EVENTOS DO MOUSE E TECLADO
     * =================================================================
     */

    const onMouseDown = (e,estado) =>
    {
        //console.log("onMouseDown:"+e.button);
        if(e.button == 0) // Clicou o botão esquerdo
        {
            if(estado.selecionado && estado.editandoPonto != -1) // ponto de elemento selecionado sendo editado
            {
                return editandoPontoClique(estado.selecionado,estado.editandoPonto,estado.desenhandoCliques);
            }
            else if(estado.desenhando) // Há halgo sendo desenhando
            {
                return desenhandoClique(estado.desenhando,estado.mouse,estado.desenhandoCliques);
            }
            else // Não há nada sendo desenhando nem editado no momento
            {
                // Tem um selecionado e clicou
                if(estado.selecionado)
                {
                    const estadoModificado = selecionadoClique(estado.selecionado,estado.mouse);
                    if(estadoModificado) return estadoModificado;
                }

                const elemClicado = encontrarElemento(estado.elementos,estado.mouse);

                if(!elemClicado && !estado.selecionado)
                {
                    return desenhandoNovo(estado.ferramenta,estado.mouse);
                }
                else
                {
                    return {
                        selecionado: elemClicado,
                        editandoPonto: -1
                    };
                }
            }
        }
    };

    const onMouseMove = (e,estado) =>
    {
        const mouse = estado.mouse;
        // Se deve movimentar o que está sendo desenhado
        // Quando é interação 'click', irá mover mesmo sem estar clicado o mouse
        // Quando é interação 'drag', só irá mover enquanto estiver clicado o botão esquerdo do mouse
        const shouldMove = options.interactionStyle == "click" || (mouse.left && options.interactionStyle == "drag")

        if(estado.selecionado && estado.editandoPonto != -1)
        {
            if(shouldMove)
            return editandoPontoMover(estado.selecionado,estado.editandoPonto,estado.mouse);
        }
        else if(estado.desenhando) // Há algo sendo desenhando
        {
            if(shouldMove)
            return desenhandoMover(estado.desenhando,mouse);
        }
    };

    const onMouseUp = (e,estado) =>
    {
        //console.log("onMouseUp:"+e.button);
        if(e.button == 0 && options.interactionStyle == "drag")
        {
            if(estado.selecionado && estado.editandoPonto != -1)
            {
                mesclarEstado(estado,editandoPontoMover(estado.selecionado,estado.editandoPonto,estado.mouse));
                return editandoPontoConfirmar(estado.selecionado,estado.editandoPonto);
            }
            else if(estado.desenhando && estado.desenhando.type == "rect") // Soltou o botão esquerdo do mouse e estava desenhando um retângulo
            {
                mesclarEstado(estado,desenhandoMover(estado.desenhando,estado.mouse));
                return desenhandoConfirmar(estado.elementos,estado.desenhando);
            }
        }
        
    };

    // o onClick é enviado após um onMouseDown e um onMouseUp ter sido enviado.
    const onClick = (e,estado) =>
    {
        //console.log("onClick:"+e.button);
        if(estado.selecionado && estado.editandoPonto != -1)
        {
            const elem = estado.selecionado;
            if(options.interactionStyle == "click")
            {
                if(e.button == 0 && estado.desenhandoCliques >= 1)   //  foi clicado o botão esquerdo
                {
                    mesclarEstado(estado,editandoPontoMover(elem,estado.editandoPonto,estado.mouse));
                    return editandoPontoConfirmar(elem,estado.editandoPonto);
                }
            }
        }
        else if(estado.desenhando) // Está desenhando algo e...
        {
            const elem = estado.desenhando;
            if(options.interactionStyle == "click")
            {
                if((elem.type == "poly" && e.button == 2)   // 1. É um polígono e foi clicado o botão direito
                || (elem.type == "rect" && e.button == 0 
                    && estado.desenhandoCliques >= 1    ))   // 2. OU É um retângulo e foi clicado o botão esquerdo
                {
                    mesclarEstado(estado,desenhandoMover(estado.desenhando,estado.mouse));
                    return desenhandoConfirmar(estado.elementos,elem);
                }
            }
            else if(options.interactionStyle == "drag")
            {
                if((elem.type == "poly" && e.button == 2 ))   // É um polígono e foi clicado o botão direito
                {
                    mesclarEstado(estado,desenhandoMover(estado.desenhando,estado.mouse));
                    return desenhandoConfirmar(estado.elementos,elem);
                }
            }
        }
        
        // TESTE MOBILE, BOTÃO DO MEIO (TRÊS TOQUES) MUDA O TIPO A SER DESENHADO
        if(e.button == 1)
        {
            return { ferramenta: estado.ferramenta == "rect" ? "poly" : "rect" };
        }
    };

    const onKeyPress = (e,estado) =>
    {
        //console.log("Pressionado:"+e.key);

        if(e.key == "1")
            return { ferramenta:"rect" };
        if(e.key == "2")
            return { ferramenta:"poly" };
        if(e.key == "Enter")
        {
            if(estado.selecionado && estado.editandoPonto != -1)
            return editandoPontoConfirmar(estado.selecionado,estado.editandoPonto);
            else if(estado.desenhando)
            return desenhandoConfirmar(estado.elementos,estado.desenhando);
        }
    };

    const onKeyDown = (e,estado) =>
    {
        if(e.key == "Escape" || e.key == "Esc")
        {            
            if(estado.selecionado && estado.editandoPonto != -1)
            return editandoPontoCancelar(estado.selecionado,estado.editandoPonto);
            else if(estado.selecionado)
            return { selecionado: false }
            else if(estado.desenhando)
            return desenhandoCancelar(estado.desenhando);
        }
        if(e.key == "z" && e.ctrlKey) // Deletar último elemento desenhado quando apertar ctrl+z
        {
            if(estado.selecionado && estado.editandoPonto != -1)
            {
                return editandoPontoCancelar(estado.selecionado,estado.editandoPonto);
            }
            if(estado.desenhando)
            {
                return desenhandoCancelar(estado.desenhando);
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
            ferramenta:"rect",
            desenhando:false,
            desenhandoCliques: 0, // controlar número de cliques
            selecionado: false, // elemento selecionado
            editandoPonto: -1, // índice do ponto que está sendo editado no elemento selecionado
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
        myImg.src = props.imagem || 'https://cdn.vercapas.com.br/covers/folha-de-s-paulo/2022/capa-jornal-folha-de-s-paulo-16-09-2022-c4a2010f.jpg';
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
        options={options}
        />
    );
};
  
export default AnotarImagem;