import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Nav() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/movies">Movies</Link></li>
        <li className="navMiddle"><Link id="pageTitle" to="/">Filmary</Link></li>

        <li className="navEnd">
          {user ? (
            <>
              <span>{user.email}</span> | <button onClick={logout} className="brown-button">Logout</button>
            </>
          ) : (
            <Link to="/auth">Login / Signup</Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
