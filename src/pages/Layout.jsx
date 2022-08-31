import './Layout.css';
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav className="topo">
        <ul className="topo" id="barratopo">
          <li className="col left">
            <Link to="/">Início</Link>
          </li>
          <li className="col right">
            <Link to="/fibonacci">Fibonacci</Link>
          </li>
          <li className="col right">
            <Link to="/jogodavida">Jogo Da Vida</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;