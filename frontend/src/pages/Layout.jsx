import { Link, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    if (confirm("Confirm Logout?")) {
      setUser({ email: null, role: null, token: null, password: null });
      navigate("/");
    }
  };


  return (
    <>
      <header className="bg-black text-green-500">
        <nav className="flex items-center justify-between p-4">
          <Link
            title="Home"
            to="/"
            className="fa-solid fa-house-chimney nav-link"
          ></Link>

          {user.email ? (
            <div className="flex items-center gap-2">
              <Link
                title="Create Quiz"
                to="/create"
                className="fa-solid fa-circle-plus nav-link"
              ></Link>

              {user.role === "Admin" && (
                <Link
                  title="Dashboard"
                  to="/dashboard"
                  className="fa-solid fa-circle-user nav-link"
                ></Link>
              )}

              <button
                title="Logout"
                onClick={handleLogout}
                className="fa-solid fa-right-from-bracket nav-link"
              ></button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                title="Login"
                to="/login"
                className="fa-solid fa-right-to-bracket nav-link"
              ></Link>

              <Link
                title="Register"
                to="/register"
                className="fa-solid fa-user-plus nav-link"
              ></Link>
            </div>
          )}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;