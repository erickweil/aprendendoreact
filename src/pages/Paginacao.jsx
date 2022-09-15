import ItemAdapter from "../components/ItemAdapter/ItemAdapter";
import ItemParagrafo from "../components/ItemAdapter/ItemParagrafo";
import LayoutTituloConteudo from "../components/Coisas/LayoutTituloConteudo";
const Paginacao = () => {

    // Cria uma lista com palavras formadas aleatóriamente
    const nItems = 333;
    const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const fakeJson = new Array(nItems).fill(null).map(
        () => {
            let txt = "";
            let len = Math.floor(Math.random() * 12 + 1);
            for(let i = 0;i < len;i++)
            {
                let c = alfabeto.charAt(Math.floor(Math.random() * alfabeto.length));
                txt += c;
            }
            return {nome:txt};
        }
    );

    const getItems = (pagina,itemsPorPagina) => {
        const nItems = fakeJson.length;
        const index = (pagina-1)*itemsPorPagina;
        const nPaginas =  Math.ceil(nItems / itemsPorPagina);
        if(index >= 0 && index < nItems)
        {
            return {
                pagina:pagina,
                npaginas: nPaginas,
                items: fakeJson.slice(index,Math.min(index + itemsPorPagina,nItems))
            }
        }
        else return {
            pagina:pagina,
            npaginas: nPaginas,
            items:[]
        };
    }

    return (
        <LayoutTituloConteudo  titulo="Listagem com paginação" >

            <ItemAdapter 
                getItems={getItems} 
                layout={ItemParagrafo} 
                maxPaginas={7} 
                itemsPorPagina={20} 
            />
        </LayoutTituloConteudo>
    );
};
  
export default Paginacao;