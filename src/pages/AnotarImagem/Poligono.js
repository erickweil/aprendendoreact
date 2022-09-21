import { centroPontos, colisaoPoly, pontoMaisProximo } from "./geometria";
// ############################ POLÍGONOS #########################
    // Cria um novo polígono
    export const newPoly = (...points) => {
        return {
            type:"poly",
            points:points.map((p)=>{return {x:p.x,y:p.y}}),
            onDraw: drawPoly,
            getPoints: getPolyPoints,
            colisao: colisaoPoly,
            onEditPoint: editPolyPoint,
            getCenter: (poly) => { return centroPontos(poly.points);},
            setCenter: setPolyCenter,
            addPoint: addPolyPoint,
            removePoint: removePolyPoint
        };
    };

    const drawPoly = (poly,ctx) => {
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

    const getPolyPoints = (poly) => {
        return poly.points;
    };

    const editPolyPoint = (poly,ponto,posicao,mergeDist) => {
        if(ponto == -1) ponto = poly.points.length-1;

        if(mergeDist)
        {
            const [minP,minSqrDist] = pontoMaisProximo(poly.points,posicao,ponto);

            // não vai aceitar mover para não ficar em cima do outro ponto
            if(minSqrDist < mergeDist * mergeDist)
            {
                return false;
            }
        }

        poly.points[ponto].x = posicao.x;
        poly.points[ponto].y = posicao.y;

        return true;
    }

    const setPolyCenter = (poly,center) => {
        const atual = poly.getCenter(poly);
        const diff = {x: center.x - atual.x, y: center.y - atual.y};

        for(let i=0;i<poly.points.length;i++)
		{
            const p = poly.points[i];
			p.x += diff.x;
            p.y += diff.y;
		}
    }

    const addPolyPoint = (poly,indice,posicao,mergeDist) => {
        const [minP,minSqrDist] = pontoMaisProximo(poly.points,posicao);

        // não adiciona o ponto porque causaria duplicação
        if(minSqrDist < mergeDist * mergeDist)
        {
            console.log("TENTOU CRIAR DUPLICADO");
            return false;
        }


        if(indice == -1)
            poly.points.push({x:posicao.x,y:posicao.y});
        else
        {
            // splice(start, deleteCount, item1)
            poly.points.splice(indice, 0,{x:posicao.x,y:posicao.y});
        }
        
        return true;
    }

    const removePolyPoint = (poly,indice) => {
        if(indice == -1)
            poly.points.pop();
        else
        {
            // remove element at 'indice'
            // pass 1 as second argument
            // to tell method to
            // delete 1 element
            // from the starting index
            poly.points.splice(indice, 1);
        }
    }