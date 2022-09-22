import { colisaoRect, pontosRect } from "./geometria";

// ############################ RETÂNGULOS #########################
    // Cria um novo retângulo
    export const newRect = (start,end) => {
        return {
            type:"rect",
            start:{x:start.x,y:start.y},
            end:{x:end.x,y:end.y},
            onDraw: drawRect,
            onDrawIncomplete: drawRect,
            getPoints: getRectPoints,
            colisao: (ret,pos) => { return colisaoRect(ret.start,ret.end,pos); },
            onEditPoint: editRectPoint,
            getCenter: (ret) => { return { 
                    x:(ret.start.x + ret.end.x)/2.0,
                    y:(ret.start.y + ret.end.y)/2.0
                };
            },
            setCenter: setRectCenter,
            addPoint: () => { return false; },
            removePoint: () => {}
        };
    };

    const drawRect = (ret,ctx) => {        
        const [p00,p10,p11,p01] = pontosRect(ret);
        const a = p00;
        const b = p11;

        ctx.fillRect(a.x, a.y, b.x-a.x, b.y-a.y);
        ctx.strokeRect(a.x, a.y, b.x-a.x, b.y-a.y);
    };

    const getRectPoints = (ret) => {
        return pontosRect(ret);        
    };

    const editRectPoint = (ret,ponto,posicao, mergeDist) => {
        if(ponto == -1) ponto = 2;
        // [p00,p10,p11,p01] - anti-horário
        const rectPoints = pontosRect(ret);
        const p00 = 0, p10 = 1, p11 = 2, p01 = 3;

        rectPoints[ponto].x = posicao.x;
        rectPoints[ponto].y = posicao.y;

        // se mudar o 00, deve também mudar o 10 e 01 (Para que continue sendo um retângulo)
        if(ponto == p00)
        {
            rectPoints[p01].x = posicao.x;
            rectPoints[p10].y = posicao.y;
        }
        else if(ponto == p10)
        {
            rectPoints[p11].x = posicao.x;
            rectPoints[p00].y = posicao.y;
        }
        else if(ponto == p11)
        {
            rectPoints[p10].x = posicao.x;
            rectPoints[p01].y = posicao.y;
        }
        else if(ponto == p01)
        {
            rectPoints[p00].x = posicao.x;
            rectPoints[p11].y = posicao.y;
        }


        // Obter o início e fim do retângulo novamente
        let _p = rectPoints[0];
        let start = {x:_p.x,y:_p.y};
        let end = {x:_p.x,y:_p.y};

        for(let i =0;i< rectPoints.length;i++)
        {
            let p = rectPoints[i];
            if(p.x < start.x) start.x = p.x;
            if(p.y < start.y) start.y = p.y;

            if(p.x > end.x) end.x = p.x;
            if(p.y > end.y) end.y = p.y;
        }

        ret.start = start;
        ret.end = end;

        //if(mergeDist)
        //{
            //if(ret.end.x - ret.start.x < mergeDist) ret.end.x = ret.start.x + mergeDist*2
            //if(ret.end.y - ret.start.y < mergeDist) ret.end.y = ret.start.y + mergeDist*2
        //}
        
        return true;
    }

    const setRectCenter = (ret,center) => {
        const atual = ret.getCenter(ret);
        const diff = {x: center.x - atual.x, y: center.y - atual.y};

        ret.start.x += diff.x;
        ret.start.y += diff.y;

        ret.end.x += diff.x;
        ret.end.y += diff.y;
    }
