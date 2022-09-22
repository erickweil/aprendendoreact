import { colisaoRect } from "./geometria";

// ############################ RETÂNGULOS #########################
    // Cria um novo retângulo
    export const newRect = (start,end) => {
        return {
            type:"rect",
            pos: {x:start.x,y:start.y},
            width: Math.abs(end.x - start.x),
            height: Math.abs(end.y - start.y),
            // [p00,p10,p11,p01] - anti-horário
            points: [{x:start.x,y:start.y},{x:end.x,y:start.y},{x:end.x,y:end.y},{x:start.x,y:end.y}],
            onDraw: drawRect,
            onDrawIncomplete: drawRect,
            getPoints: getRectPoints,
            colisao: (ret,pos) => { return colisaoRect(ret.pos,{x:ret.pos.x + ret.width,y:ret.pos.y + ret.height},pos); },
            onEditPoint: editRectPoint,
            getCenter: (ret) => { return { 
                    x:ret.pos.x + ret.width/2.0,
                    y:ret.pos.y + ret.height/2.0
                };
            },
            setCenter: setRectCenter,
            addPoint: () => { return false; },
            removePoint: () => {},
            getArea: getRectArea,
            getDimensions: getRectDimensions
        };
    };

    const calcPointsAgain = (ret) => {
        ret.points[0].x = ret.pos.x;
        ret.points[0].y = ret.pos.y;

        ret.points[1].x = ret.pos.x + ret.width;
        ret.points[1].y = ret.pos.y;

        ret.points[2].x = ret.pos.x + ret.width;
        ret.points[2].y = ret.pos.y + ret.height;

        ret.points[3].x = ret.pos.x;
        ret.points[3].y = ret.pos.y + ret.height;
    }

    const drawRect = (ret,ctx) => {
        ctx.fillRect(ret.pos.x, ret.pos.y, ret.width, ret.height);
        ctx.strokeRect(ret.pos.x, ret.pos.y, ret.width, ret.height);
    };

    const getRectPoints = (ret) => {
        return ret.points;
    };

    const editRectPoint = (ret,ponto,posicao, mergeDist) => {
        if(ponto == -1) ponto = 2;
        // [p00,p10,p11,p01] - anti-horário
        const rectPoints = ret.points;//pontosRect(ret);
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

        ret.pos = start;
        ret.width = end.x - start.x;
        ret.height = end.y - start.y;

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

        ret.pos.x += diff.x;
        ret.pos.y += diff.y;

        calcPointsAgain(ret);
    }

    const getRectArea = (ret) => {
        const [largura,altura] = ret.getDimensions(ret)
        return largura * altura;
    }

    const getRectDimensions = (ret) => {
        return [ret.width,ret.height]
    }