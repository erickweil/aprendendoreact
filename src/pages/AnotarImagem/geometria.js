
    export const pontoMaisProximo = (pontos,pos,ignore = -1) => {
        
        let minponto = -1;
        let mindist = false;
        for(let i =0; i < pontos.length; i++)
        {
            if(i == ignore) continue;
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

    //https://gist.github.com/mattdesl/47412d930dcd8cd765c871a65532ffac
    //  // Taken From:
    //  // https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
    // distance squared
    function dist2(v, w) { return (v.x - w.x)*(v.x - w.x) + (v.y - w.y)*(v.y - w.y) }

    /**
     Return minimum distance between line segment vw and point p
     Consider the line extending the segment, parameterized as v + t (w - v).
     We find projection of point p onto the line. 
     It falls where t = [(p-v) . (w-v)] / |w-v|^2
     We clamp t from [0,1] to handle points outside the segment vw.
    */
    export const distToSegmentSquared = (p, v, w) => {
      let l2 = dist2(v, w);  // i.e. |w-v|^2 -  avoid a sqrt
      if (l2 == 0) return dist2(p, v); // v == w case, defaults to return distance to point v

      // t is the normalized dot product, where 0 is v and 1 is w
      let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;

      // clamp start and end of the segment
      t = Math.max(0, Math.min(1, t));

      return dist2(p, { x: v.x + t * (w.x - v.x),
                        y: v.y + t * (w.y - v.y) });
    }

    export const linhaMaisProxima = (pontos,pos) => {
        let minlinha = -1;
        let mindist = false;
        for(let i =0; i < pontos.length; i++)
        {
            const a = pontos[i];
            const b = pontos[(i+1)%pontos.length];

            const dist = distToSegmentSquared(pos,a,b);

            if(minlinha == -1 || dist < mindist)
            {
                mindist = dist;
                minlinha = i;
            }
        }

        return [minlinha,mindist];
    }

    // calcula o centro a partir de uma lista de pontos
    export const centroPontos  = (pontos) => {
        
        const centro = {x:0,y:0};
        
        for(let i =0; i < pontos.length; i++)
        {
            const p = pontos[i];

            centro.x += p.x;
            centro.y += p.y;
        }

        return {x:centro.x / pontos.length,y:centro.y / pontos.length};
    }

    // Retorna ponto superior esquerdo e inferior direito de um retângulo
    export const pontosRect = (ret) => {
        let startx = ret.start.x;
        let starty = ret.start.y;
        let endx = ret.end.x;
        let endy = ret.end.y;

        if(startx > endx) [startx,endx] = [endx,startx];
        if(starty > endy) [starty,endy] = [endy,starty];

        return [{x:startx,y:starty},{x:endx,y:starty},{x:endx,y:endy},{x:startx,y:endy}];
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
    export const colisaoRect = (a,b,pos) => {
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