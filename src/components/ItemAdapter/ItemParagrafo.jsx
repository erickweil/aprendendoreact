function ItemParagrafo(props) {
    const dados = props.item;
    
    if(dados.nome)
    return <p>{dados.nome}</p>;
    else
    return <p>Item desconhecido</p>;
}

export default ItemParagrafo;