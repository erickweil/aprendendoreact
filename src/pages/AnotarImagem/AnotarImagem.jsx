import { mesclarEstado } from "../../components/Canvas/CanvasControler";
import ZoomableCanvas from "../../components/Canvas/ZoomableCanvas";
import { linhaMaisProxima, pontoMaisProximo } from "./geometria";
import { newPoly } from "./Poligono";
import { newRect } from "./Retangulo";
const AnotarImagem = (props) => {

    const defaultOptions = {
        spanButton:"right", // left | middle | right | any
        delButton:"right", // middle | right
        interactionStyle: "click", // click | drag
        maxZoomScale:50.0,
        minZoomScale:0.25,
        baseLineWidth: 1.0, // SCREEN COORDS da largura da linha
        selectedLineWidth: 5.0, // SCREEN COORDS da largura da linha quando selecionado
        DEBUG: false,
        colorStroke: "rgba(0, 127, 0, 0.6)",
        colorFill: "rgba(0, 255, 0, 0.3)",
        colorDrawingStroke: "rgba(127, 0, 0, 0.7)",
        colorDrawingFill: "rgba(255, 0, 0, 0.4)",
        colorSelectedStroke: "rgba(127, 0, 0, 0.6)",
        colorSelectedFill: "rgba(255, 0, 0, 0.3)",
        colorPoint: "rgba(255, 255, 255, 1.0)",
        colorActivePoint: "rgba(255, 255, 0, 1.0)",
        minDist: 0.1, // Distância mínima que irá aceitar entre pontos. afeta a criação e edição de formatos
        minClickDist: 32 // Distância mínima EM SCREEN COORDINATES para entender que clicou em um ponto
    };
    const options = props.options ? {...defaultOptions,...props.options} : defaultOptions;
    const DEBUG = options.DEBUG;

    /**=================================================================
     *              FUNÇÕES QUE DESENHAM AS COISAS NA TELA
     * =================================================================
     */

    const drawPoints = (ctx,points,radius) => {
        for(const point of points)
		{
            ctx.beginPath();
            //tamanho do ponto é 25% do raio de clique aceitável de clique SCREEN COORDINATES
            ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);

            ctx.stroke();
            ctx.fill();

            // Desenha círculo da área aceitável do clique
            if(DEBUG)
            {
                ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
    }
    // Not affected by zooming and spanning
    const myuidraw = (ctx,estado) => {

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

        const pointRadius = (options.minClickDist * 0.25) / estado.scale;
        if(estado.desenhando)
        {
            ctx.fillStyle = options.colorDrawingFill;
            ctx.strokeStyle = options.colorDrawingStroke;
            ctx.lineWidth = (options.selectedLineWidth)/estado.scale;

            estado.desenhando.onDraw(estado.desenhando,ctx);

            const points = estado.desenhando.getPoints(estado.desenhando);
            ctx.fillStyle = options.colorPoint;
            drawPoints(ctx,points,pointRadius);
            ctx.fillStyle = options.colorActivePoint;
            drawPoints(ctx,[points[estado.desenhando.type == "rect" ? 2 : points.length-1]],pointRadius);
        }

        if(estado.elementos)
        {
            for(const e of estado.elementos)
            {
                const selecionado = estado.selecionado == e;
                if(selecionado)
                {
                    ctx.fillStyle = options.colorSelectedFill;
                    ctx.strokeStyle = options.colorSelectedStroke;
                    ctx.lineWidth = options.selectedLineWidth/estado.scale;
                }
                else
                {
                    ctx.fillStyle = options.colorFill;
                    ctx.strokeStyle = options.colorStroke;
                    ctx.lineWidth = options.baseLineWidth/estado.scale;
                }

                e.onDraw(e,ctx,estado);

                if(selecionado)
                {
                    const points = e.getPoints(e);
                    ctx.fillStyle = estado.arrastando ? options.colorActivePoint : options.colorPoint;
                    drawPoints(ctx,e.getPoints(e),pointRadius);                    
                    
                    if(estado.editandoPonto != -1)
                    {
                        ctx.fillStyle = options.colorActivePoint;
                        drawPoints(ctx,[points[estado.editandoPonto]],pointRadius);
                    }
                }
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
            if(e.colisao(e,posicao)) return e;

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

        elementos.push(elem);
        return {
            desenhando:false,
            desenhandoCliques: 0,
            elementos:elementos,
            selecionado: false
        };
    };

    // Faz com que o elemento ativo no momento seja cancelado, ou etapas de seu desenho sejam des-feitas
    const desenhandoCancelar = (elem) =>
    {
        console.log("DESENHANDO CANCELAR:"+elem.type);

        if(elem.type == "poly" && elem.points.length > 2)
        {
            elem.removePoint(elem,-1);
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

        let newWhat = false;

        if(tipo == "rect") newWhat = newRect;
        else if(tipo == "poly") newWhat = newPoly;

        let elem = newWhat(posicao,{x:posicao.x+options.minDist*2,y:posicao.y+options.minDist*2});
        // retorna o novo elemento como algo sendo desenhando no momento
        return {
            desenhando:elem,
            desenhandoCliques: 0, // reseta o número de cliques
            selecionado: false
        };
    }

    // Adiciona um novo ponto ao polígono sendo desenhado
    const desenhandoClique = (elementos,elem,posicao,ncliques,scale) =>
    {
        console.log("DESENHANDO CLIQUE:"+elem.type+",["+posicao.x+","+posicao.y+"],"+ncliques);

        if(elem.type == "poly")
        {
            const points = elem.getPoints(elem);

            // Calcula o ponto mais próximo no formato, retorna a distância ao quadrado
            const [minP,minSqrDist] = pontoMaisProximo(points,posicao,points.length-1);

            // Se clicou no primeiro ponto, termine o desenho
            if(minP == 0 && Math.sqrt(minSqrDist)*scale < options.minClickDist)
            {
                console.log("DESENHANDO CLICOU NO PRIMEIRO, CONFIRMANDO:"+elem.type);
                
                // remove o último ponto que iria ficar duplicado
                elem.removePoint(elem,-1);

                elementos.push(elem);
                return {
                    desenhando:false,
                    desenhandoCliques: 0,
                    elementos:elementos,
                    selecionado: false
                };
            }

            elem.addPoint(elem,-1,{x:posicao.x+options.minDist*2,y:posicao.y+options.minDist*2},options.minDist);
        }

        return {
            desenhando:elem,
            desenhandoCliques: ncliques+1, // registra que um novo clique foi realizado
            selecionado: false
        };
    }

    // Mover o ponto do que está sendo desenhado
    const desenhandoMover = (elem,posicao) =>
    {        
        elem.onEditPoint(elem,-1,posicao, options.minDist);
        
        return {
            desenhando:elem
        };
    }

    /**=================================================================
     *      FUNÇÕES QUE LIDAM COM ELEMENTOS SENDO EDITADOS
     * =================================================================
     */

    // Clicou enquanto havia um elemento selecionado
    const selecionadoClique = (elem,posicao,scale) =>
    {
        const points = elem.getPoints(elem);

        // Calcula o ponto mais próximo no formato, retorna a distância ao quadrado
        const [minP,minSqrDist] = pontoMaisProximo(points,posicao);

        // Se o clique está dentro da área aceitável ao redor do ponto mais próximo em SCREEN COORDS
        // está multiplicando pela escala para que compare idependente do zoom
        if(minP != -1 && Math.sqrt(minSqrDist)*scale < options.minClickDist)
        {
            const posicaoAnterior = {x:points[minP].x, y:points[minP].y};
            const mouseClickOff = {x:posicao.x - posicaoAnterior.x,y:posicao.y - posicaoAnterior.y};
            const retEstado = editandoPontoMover(elem,minP,posicao,mouseClickOff);
            
            return {...retEstado,...{
                editandoPonto: minP,
                desenhandoCliques: 0,
                posicaoAnterior: posicaoAnterior,
                mouseClickOff: mouseClickOff
            }};
        }

        // Calcula o a linha mais próximo no formato, retorna a distância ao quadrado
        const [minLinha,minLinhaSqrDist] = linhaMaisProxima(points,posicao);
        if(minLinha != -1 && Math.sqrt(minLinhaSqrDist)*scale < options.minClickDist)
        {
            // Adicionar novo ponto na linha
            if(elem.type == "poly")
            {
                const posicaoAnterior = {x:posicao.x,y:posicao.y};
                elem.addPoint(elem,minLinha+1,{x:posicao.x,y:posicao.y},options.minDist);

                return {
                    editandoPonto: minLinha+1,
                    desenhandoCliques: 0,
                    posicaoAnterior: posicaoAnterior,
                    mouseClickOff: {x:0,y:0}
                };
            }
        }

        // Se não clicou em nenhum ponto, então é porque quer arrastar,
        // mas verifica se clicou dentro do objeto primeiro né
        if(elem.colisao(elem,posicao)) {
            const centro = elem.getCenter(elem);
            const mouseClickOff = {x:posicao.x - centro.x,y:posicao.y - centro.y};

            return {
                posicaoAnterior: centro,
                arrastando: true,
                mouseClickOff: mouseClickOff
            };
        }

        return false;
    }
     // Edita um ponto
    const editandoPontoMover = (elem,ponto,posicao,mouseClickOff) =>
    {
        elem.onEditPoint(elem,ponto,
        {
            x:posicao.x - mouseClickOff.x,
            y:posicao.y - mouseClickOff.y
        }, options.minDist);
        
        return {
            selecionado:elem,
            editandoPonto: ponto
        };
    }

    const editandoPontoClique = (elem,ponto,ncliques) =>
    {
        return {
            selecionado: elem,
            editandoPonto: ponto,
            desenhandoCliques: ncliques+1 // controle da interação, precisa saber o número de cliques
        };
    }

    const editandoPontoConfirmar = (elem,ponto) =>
    {
        return {
            selecionado: elem,
            editandoPonto: -1,
            desenhandoCliques: 0,
            posicaoAnterior: {x:0,y:0},
            mouseClickOff: {x:0,y:0}
        };
    }

    const editandoPontoCancelar = (elem,ponto,posicaoAnterior) =>
    {
        elem.onEditPoint(elem,ponto,
        {
            x:posicaoAnterior.x,
            y:posicaoAnterior.y
        }, false);

        return {
            selecionado: elem,
            editandoPonto: -1,
            desenhandoCliques: 0,
            posicaoAnterior: {x:0,y:0},
            mouseClickOff: {x:0,y:0}
        };
    }

    const editandoPontoDeletar = (elem,posicao,scale) =>
    {
        if(elem.type != "poly") return false;
        
        const points = elem.getPoints(elem);

        // Calcula o ponto mais próximo no formato, retorna a distância ao quadrado
        const [minP,minSqrDist] = pontoMaisProximo(points,posicao);

        // Se o clique está dentro da área aceitável ao redor do ponto mais próximo em SCREEN COORDS
        // está multiplicando pela escala para que compare idependente do zoom
        if(minP != -1 && Math.sqrt(minSqrDist)*scale < options.minClickDist)
        {
            // Não deixa deletar quando é um triângulo
            if(points.length > 3)
            {
                elem.removePoint(elem,minP);
                return {
                    selecionado: elem,
                    editandoPonto: -1,
                    desenhandoCliques: 0,
                    posicaoAnterior: {x:0,y:0},
                    mouseClickOff: {x:0,y:0}
                };
            }
        }

        // Clicou longe demais de qualquer ponto
        return false;
    }

    const arrastandoClique = (elem,ncliques) =>
    {
        return {
            selecionado: elem,
            arrastando: true,
            desenhandoCliques: ncliques+1 // controle da interação, precisa saber o número de cliques
        };
    }

    const arrastandoMover = (elem,posicao,mouseClickOff) =>
    {
        const novoCentro = {x:posicao.x - mouseClickOff.x, y:posicao.y - mouseClickOff.y};

        elem.setCenter(elem,novoCentro);

        return {
            selecionado:elem,
            arrastando: true
        };
    }

    const arrastandoConfirmar = (elem) =>
    {
        return {
            selecionado:elem,
            arrastando: false,
            desenhandoCliques: 0,
            posicaoAnterior: {x:0,y:0},
            mouseClickOff: {x:0,y:0}
        };
    }

    // nada
    const arrastandoCancelar = (elem,posicaoAnterior) =>
    {
        elem.setCenter(elem,posicaoAnterior);

        return {
            selecionado:elem,
            arrastando: false,
            desenhandoCliques: 0,
            posicaoAnterior: {x:0,y:0},
            mouseClickOff: {x:0,y:0}
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
            else if(estado.selecionado && estado.arrastando) // elemento sendo arrastado
            {
                return arrastandoClique(estado.selecionado,estado.desenhandoCliques);
            }
            else if(estado.desenhando) // Há halgo sendo desenhando
            {
                return desenhandoClique(estado.elementos,estado.desenhando,estado.mouse,estado.desenhandoCliques,estado.scale);
            }
            else // Não há nada sendo desenhando nem editado no momento
            {
                // Tem um selecionado e clicou
                if(estado.selecionado)
                {
                    const estadoModificado = selecionadoClique(estado.selecionado,estado.mouse,estado.scale);
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
            return editandoPontoMover(estado.selecionado,estado.editandoPonto,estado.mouse,estado.mouseClickOff);
        }
        if(estado.selecionado && estado.arrastando)
        {
            if(shouldMove)
            return arrastandoMover(estado.selecionado,estado.mouse,estado.mouseClickOff);
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
                mesclarEstado(estado,editandoPontoMover(estado.selecionado,estado.editandoPonto,estado.mouse,estado.mouseClickOff));
                return editandoPontoConfirmar(estado.selecionado,estado.editandoPonto);
            }
            else if(estado.selecionado && estado.arrastando) // Soltou o botão esquerdo do mouse e estava desenhando um retângulo
            {
                mesclarEstado(estado,arrastandoMover(estado.selecionado,estado.mouse,estado.mouseClickOff));
                return arrastandoConfirmar(estado.selecionado);
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
        if(estado.selecionado)//&& (estado.editandoPonto != -1 || estado.arrastando))
        {
            const elem = estado.selecionado;
            if(options.interactionStyle == "click")
            {
                if(estado.arrastando && e.button == 0 && estado.desenhandoCliques >= 1)
                {
                    mesclarEstado(estado,arrastandoMover(estado.selecionado,estado.mouse,estado.mouseClickOff));
                    return arrastandoConfirmar(estado.selecionado);
                }
                else if(estado.editandoPonto != -1 && e.button == 0 && estado.desenhandoCliques >= 1)   //  foi clicado o botão esquerdo
                {
                    mesclarEstado(estado,editandoPontoMover(elem,estado.editandoPonto,estado.mouse,estado.mouseClickOff));
                    return editandoPontoConfirmar(elem,estado.editandoPonto);
                }
            }

            // Se não está editando ponto nem arrastando e clicou o botão de deletar
            if(!estado.arrastando && estado.editandoPonto == -1 && 
                ((options.delButton == "right" && e.button == 2) || (options.delButton == "middle" && e.button == 1))
            )
            {
                return editandoPontoDeletar(elem,estado.mouse,estado.scale);
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
            else if(estado.selecionado && estado.arrastando)
            return arrastandoConfirmar(estado.selecionado);
            else if(estado.desenhando)
            return desenhandoConfirmar(estado.elementos,estado.desenhando);
        }
    };

    const onKeyDown = (e,estado) =>
    {
        //console.log("Down:"+e.key);

        if(e.key == "Escape" || e.key == "Esc")
        {            
            if(estado.selecionado && estado.editandoPonto != -1)
            return editandoPontoCancelar(estado.selecionado,estado.editandoPonto,estado.posicaoAnterior);
            else if(estado.selecionado && estado.arrastando)
            return arrastandoCancelar(estado.selecionado,estado.posicaoAnterior);
            else if(estado.selecionado)
            return { selecionado: false }
            else if(estado.desenhando)
            return desenhandoCancelar(estado.desenhando);
        }
        else if(e.key == "z" && e.ctrlKey) // Deletar último elemento desenhado quando apertar ctrl+z
        {
            if(estado.selecionado && estado.editandoPonto != -1)
            {
                return editandoPontoCancelar(estado.selecionado,estado.editandoPonto,estado.posicaoAnterior);
            }
            else if(estado.selecionado && estado.arrastando)
            {
                return arrastandoCancelar(estado.selecionado,estado.posicaoAnterior);
            }
            else if(estado.desenhando)
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
        if(e.key == "Delete")
        {
            if(estado.selecionado && estado.editandoPonto == -1 && !estado.arrastando)
            {
                // Pesquisa a posição do elemento selecionado na lista
                // e remove ele pelo índice
                const index = estado.elementos.indexOf(estado.selecionado);
                estado.elementos.splice(index,1);
                return {
                    elementos:estado.elementos,
                    selecionado: false
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
            arrastando: false, // Se está arrastando o elemento selecionado
            posicaoAnterior: {x:0,y:0}, // Para cancelar movimentações em geral
            mouseClickOff: {x:0,y:0}, // Offset do clique do mouse em relação ao objeto clicado (Para que o drag funcione)
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