import "./Coisas.css"

function LayoutTituloConteudo(props) {
    return (
    <div className="App">
        <header className="App-titulo">
            {props.titulo && <h2>{props.titulo}</h2>}
        </header>
        <article className="App-conteudo">
            {props.children}
        </article>
    </div>
    );
}

export default LayoutTituloConteudo;