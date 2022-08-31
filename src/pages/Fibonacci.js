import './Fibonacci.css';
import Fib from '../components/Numero/Numero';
import {useEffect, useState} from 'react';

function Fibonacci() {
  const [count, setCount] = useState(5);

  const fib = <Fib n={count+""}></Fib>;
  const changefib = (a) => {
    setCount(count + a);
  };

  return (
    <div className="App">
      <header className="App-header">
        
        <h2>Sequência de fibonacci:</h2>
        <div>
        <button className="App-button" onClick={() => changefib(1)}>+</button>
        <button className="App-button" onClick={() => changefib(-1)}>-</button>
        </div>
        <div style={{border:"1px solid #fff"}}>
        {fib}
        </div>
      </header>
    </div>
  );
}

export default Fibonacci;
