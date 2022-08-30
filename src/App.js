import logo from './logo.svg';
import './App.css';
import Fibonacci from './Numero';

function App() {

  let rows = [];
  for (let i = 0; i < 20; i++) {
    rows.push(<Fibonacci n={i}></Fibonacci>);
  }

  return (
    <div className="App">
      <header className="App-header">
        
        <h1>
          APRENDENDO REACT
        </h1>
        <p>Sequência de fibonacci:</p>
        <div>
        {rows}
        </div>
      </header>
    </div>
  );
}

export default App;
