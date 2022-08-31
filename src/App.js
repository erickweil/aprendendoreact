import logo from './logo.svg';
import './App.css';
import Fibonacci from './components/Numero/Index';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        
        <h1>
          APRENDENDO REACT
        </h1>
        <p>Sequência de fibonacci:</p>
        <div style={{border:"1px solid #fff"}}>
        <Fibonacci n="5"></Fibonacci>
        </div>
      </header>
    </div>
  );
}

export default App;
