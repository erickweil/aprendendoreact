function fib(n)
{
    if(n <= 1) return 1;
    else return fib(n-1) + fib(n-2);
}

function Fibonacci(props) {
    return <b>&nbsp;{fib(parseInt(props.n))}</b>;
  }

export default Fibonacci;