
    export const pontoMaisProximo = (pontos,pos) => {
        
        let minponto = -1;
        let mindist = false;
        for(let i =0; i < pontos.length; i++)
        {
            const p = pontos[i];

            const dist = (p.x - pos.x)*(p.x - pos.x) + (p.y - pos.y)*(p.y - pos.y);

            if(minponto == -1 || dist < mindist)
            {
                mindist = dist;
                minponto = i;
            }
        }

        return [minponto,mindist];
    }

    // Retorna ponto superior esquerdo e inferior direito de um retângulo
    export const pontosRect = (ret) => {
        let startx = ret.start.x;
        let starty = ret.start.y;
        let endx = ret.end.x;
        let endy = ret.end.y;

        if(startx > endx) [startx,endx] = [endx,startx];
        if(starty > endy) [starty,endy] = [endy,starty];

        return [{x:startx,y:starty},{x:endx,y:endy}];
    };

    // Retorna se a posição pos está dentro do retângulo
    // retorna 3 valores
    
    // Primeiro valor: Face
    // 0 --> não está dentro do retângulo
    // 1 --> está dentro do retângulo

    // Segundo valor: Linha
    // 0 --> está na linha direita
    // 1 --> está na linha inferior
    // 2 --> está na linha esquerda
    // 3 --> está na linha superior

    // Terceiro valor: Vértice
    // 0 --> está no canto superior esquerdo
    // 1 --> está no canto superior direito
    // 2 --> está no canto inferior direito
    // 3 --> está no canto inferior esquerdo
    export const colisaoRect = (ret,pos) => {
        const [a,b] = pontosRect(ret);

        if(
            pos.x < b.x && pos.x > a.x && // entre início e fim da caixa horizontalmente
            pos.y < b.y && pos.y > a.y    // entre início e fim da caixa verticalmente     
        )
        return true
        else return false
    };


    /** https://github.com/psalaets/line-intersect/blob/master/src/check-intersection.js
    * Check how two line segments intersect eachother. Line segments are represented
    * as (x1, y1)-(x2, y2) and (x3, y3)-(x4, y4).
    *    {
    *      type: none|parallel|colinear|intersecting,
    *      point: {x, y} - only defined when type == intersecting
    *    }
    */
    export const checkIntersection = (pa,pb,pc,pd) => {

        const x1 = pa.x;
        const y1 = pa.y;

        const x2 = pb.x;
        const y2 = pb.y;

        const x3 = pc.x;
        const y3 = pc.y;

        const x4 = pd.x;
        const y4 = pd.y;

        const denom = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));
        const numeA = ((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3));
        const numeB = ((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3));

        if (denom == 0) {
        if (numeA == 0 && numeB == 0) {
            //return COLINEAR;
            return {x: (x1 + x2 + x3 + x4) / 4, y: (y1 + y2 + y3 + y4)/4};
        }
        //return PARALLEL;
        return {x: (x1 + x2 + x3 + x4) / 4, y: (y1 + y2 + y3 + y4)/4};
        }

        const uA = numeA / denom;
        const uB = numeB / denom;

        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        return {
        x: x1 + (uA * (x2 - x1)),
        y: y1 + (uA * (y2 - y1))
        };
        }

        return false;
    }

    // https://www.quora.com/How-can-I-create-an-algorithm-that-can-determine-if-a-point-is-contained-in-an-irregular-polygon-defined-by-the-points-of-its-corners
    /**
    Assuming that it is a simple polygon (no crossing lines or multiple regions), the algorithm is basically to count how many segments you cross by going “out” of 
    the polygon in a particular direction. And the simplest way to do this is to count how many segments are “above” the point in question.

    Iterate through each segments (defined as consecutive pairs of vertices). Determine whether the segment is “above” the point. This is done in two steps:
    first, is the x-coordinate of the point between the x-coordinates of the vertices; 
    second, if it is, is the y-coordinate of the point below the line that the segment lies on. (This last bit requires that you find the equation of a line!)

    If there are an odd number of segments, then you are inside the polygon. Otherwise, you are outside.
    There are many corner cases to consider, like the point being directly below a vertex, or directly on an edge, etc. You can figure this out.
    */
    export const colisaoPoly = (poly,pos) => {
        const points = poly.points;

        const saindoA = pos;
        const saindoB = {x:pos.x+10000.0, y:pos.y+10000.0};

        let nInters = 0;
        for(let i =0;i<points.length;i++)
        {
            const pa = points[i];
            const pb = points[(i+1) % points.length]; // Se é o último conecta de volta com o primeiro

            // Checa a colisão desta linha com a linha 'saindo' de pos
            const inter = checkIntersection(pa,pb,saindoA,saindoB);

            if(inter) nInters++;
        }

        if(nInters % 2 == 1) return true;
        if(nInters % 2 == 0) return false;
    };