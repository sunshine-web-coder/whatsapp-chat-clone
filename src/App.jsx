import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
// import Header from "./component/header/Header";
import ChatRoom from "./pages/chatroom/ChatRoom";
import Profile from "./pages/profile/Profile";
import PrivateRoute from "./routes/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { ChatContextProvider } from "./context/ChatContext";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <ChatContextProvider>
          {/* <Header /> */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route exact path="/chat" element={<PrivateRoute />}>
              <Route exact path="/chat" element={<ChatRoom />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </ChatContextProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
