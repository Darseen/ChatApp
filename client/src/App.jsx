import { Routes, Route, Navigate } from "react-router-dom";

/* COMPONENTS IMPORT */
import Home from "./pages/Home";
import Chats from "./pages/Chats";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Error from "./pages/Error";
import GlobalChat from "./pages/GlobalChat";
import User from "./pages/User";

import "./App.css";
import { useSelector } from "react-redux";

const App = () => {
  const user = useSelector((state) => state);
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user.token ? <Chats /> : <Login />} />
        <Route
          path="/register"
          element={user.token ? <Chats /> : <Register />}
        />
        <Route
          path="/chats"
          element={user.token ? <Chats /> : <Navigate to="/login" />}
        />
        <Route path="/user/:userId" element={<User />} />
        <Route path="/global" element={<GlobalChat />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
};

export default App;
