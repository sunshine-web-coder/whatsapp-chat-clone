import { Navigate, Outlet } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { currentUser } = UserAuth();

  return currentUser ? <Outlet /> : <Navigate to="/" />;
}
