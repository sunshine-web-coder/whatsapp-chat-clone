import { useEffect, useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { currentUser, login, signinWithGoogle } = UserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signinWithGoogle();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoginWithEmailPassword = async (event) => {
    event.preventDefault();

    try {
      // Sign in the user using Firebase authentication
      await login(email, password);
      navigate("/chat");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/chat");
    }
  }, [currentUser, navigate]);

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content">
        <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
          <div className="card-body">
            <div className="max-w-md text-center">
              <h1 className="text-5xl font-bold">tChat</h1>
              <p className="py-6">
                Join the conversation, meet new people, and make connections in
                one shared room.
              </p>
              <button onClick={handleLogin} className="btn btn-primary">
                Sign up with google
              </button>
            </div>
            <div className="divider">OR</div>
            <form onSubmit={handleLoginWithEmailPassword}>
              <div className="relative z-0 w-full mb-5">
                <input
                  type="email"
                  name="email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 border-gray-500"
                />
                <label
                  htmlFor="email address"
                  className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500"
                >
                  Email address
                </label>
              </div>
              <div className="relative z-0 w-full mb-5">
                <input
                  type="password"
                  name="password"
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 border-gray-500"
                />
                <label
                  htmlFor="password"
                  className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500"
                >
                  Password
                </label>
              </div>
              <div className="form-control">
                <button className="btn btn-primary">Login</button>
              </div>
            </form>
            <p>
              <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
