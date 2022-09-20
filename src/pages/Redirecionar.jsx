import { useNavigate } from "react-router-dom";
import { useEffect } from 'react'

const Redirecionar = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate(props.path);
    });

    return (
        <h1>Redirecionando...</h1>
    );
}

export default Redirecionar;