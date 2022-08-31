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
        <div>
        <Fibonacci n="10"></Fibonacci>
        </div>
      </header>
    </div>
  );
}

export default App;
