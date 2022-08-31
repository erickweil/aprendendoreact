import "./style.css"

function fib(n)
{
    if(n <= 1) return 1;
    else return fib(n-1) + fib(n-2);
}

function Fibonacci(props) {
    let n = parseInt(props.n);
    let qual = n % 4;
    let fibn = fib(n);
    let scale = 30;
    let estilo = {width: (fibn*scale)+"px",height: (fibn*scale)+"px", lineHeight:(fibn*scale)+"px"}
    if(n == 0) return (
      <div className="fibblock" style={estilo}>{fibn}</div>
    );

    if(qual == 0) // acima
    {
      return (
        <div className="fibparent">
          <div className="fibblock borderD" style={estilo}>{fibn}</div>
          <div className="fibblock"><Fibonacci n={""+(n-1)}></Fibonacci></div>
        </div>
      );
    }
    else if(qual == 1) // esquerda
    {
      return (
        <div className="fibparent">
          <div className="fibinline"><Fibonacci n={""+(n-1)}></Fibonacci></div>
          <div className="fibinline borderL" style={estilo}>{fibn}</div>
        </div>
      );
    }
    else if(qual == 2) // abaixo
    {
      return (
        <div className="fibparent">
          <div className="fibblock"><Fibonacci n={""+(n-1)}></Fibonacci></div>
          <div className="fibblock borderU" style={estilo}>{fibn}</div>
        </div>
      );
    }
    else if(qual == 3) // direita
    {
      return (
        <div className="fibparent">
          <div className="fibinline borderR" style={estilo}>{fibn}</div>
          <div className="fibinline"><Fibonacci n={""+(n-1)}></Fibonacci></div>
        </div>
      );
    }
    
    
  }

export default Fibonacci;