import "./Coisas.css"

function Borda(props) {
    return <div className="borda">
        {props.titulo && <h1>{props.titulo}</h1>}
        {props.children}
    </div>;
}

export default Borda;