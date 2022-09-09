import Borda from "../components/Coisas/Borda";
import LayoutTituloConteudo
 from "../components/Coisas/LayoutTituloConteudo";
const Formulario = () => {
    return (
    <LayoutTituloConteudo  titulo="Formulário">
        <Borda>
        <form action="#" method="GET">
            <label>Nome:</label><input name="nome" type="text"/><br/>
            <label>Email:</label><input name="email" type="email"/><br/>
            <label>Reclamação:</label><textarea name="reclamacao"></textarea><br/>
            <input type="submit" value="Enviar"/>
        </form>
        </Borda>
    </LayoutTituloConteudo>
    );
};
  
export default Formulario;