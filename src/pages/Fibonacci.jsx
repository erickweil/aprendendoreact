import './Fibonacci.css';
import Fib from '../components/Numero/Numero';
import LayoutTituloConteudo from '../components/Coisas/LayoutTituloConteudo';
import {useEffect, useState} from 'react';

function Fibonacci() {
  const [count, setCount] = useState(5);

  const fib = <Fib n={count+""}></Fib>;
  const changefib = (a) => {
    setCount(count + a);
  };

  return (
    <LayoutTituloConteudo  titulo="Sequência de Fibonacci">
        <div>
        <button className="App-button" onClick={() => changefib(1)}>+</button>
        <button className="App-button" onClick={() => changefib(-1)}>-</button>
        </div>
        <div style={{border:"1px solid #fff"}}>
        {fib}
        </div>
    </LayoutTituloConteudo>
  );
}

export default Fibonacci;
