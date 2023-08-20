import { Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";

export default function Header() {
  const { currentUser, logout } = UserAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {currentUser ? (
        <div className="navbar bg-neutral text-neutral-content">
          <div className="container flex justify-between mx-auto max-w-4xl">
            <Link to="/chat" className="normal-case text-xl">tChat</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
