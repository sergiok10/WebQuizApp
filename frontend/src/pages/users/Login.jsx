import { useState } from "react";
import Alert from "../../Components/Alert";
import { loginUser } from "../../controllers/usersController";
import { UserContext } from "../../contexts/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  // User user context
  const { user, setUser } = useContext(UserContext);

  //Use navigate hook
  const navigate = useNavigate();

  //Error State
  const [error, setError] = useState(null);

  //Form data state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      //Login the User
      const data = await loginUser(email, password);
      //Update the User State

      setUser({
        email,
        password,
        role: data.role,
        token: data.token,
      });
      //Navigate to dashboard
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Logo section */}
      <div className="w-full md:w-2/3 bg-green-500 flex flex-col items-center justify-center p-8">
        <div className="text-9xl md:text-[200px] text-black">
          <i className="fa-solid fa-brain"></i>
        </div>
        <h2 className="text-xl md:text-2xl text-center font-semibold text-black mt-4">
          Unlock Knowledge, One Quiz at a Time!
        </h2>
      </div>

      {/* Login form section */}
      <div className="w-full md:w-1/3 bg-white p-8 flex flex-col justify-center">
        <section className="card max-w-md mx-auto w-full">
          <h1 className="title">Login to your account</h1>

          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email Address"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <input
              type="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn">Login</button>
          </form>

          {error && <Alert msg={error} />}
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
