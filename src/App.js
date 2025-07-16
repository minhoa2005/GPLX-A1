import React from "react";
import User from "./pages/User";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import { UserProvider } from "./userContext";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./Header";
import Register from "./pages/Register";
import EditQ from "./pages/EditQ";


function App() {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<User />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/new" element={<EditQ />} />
          <Route path="/edit/:id" element={<EditQ />} />
        </Routes>
      </Router>
    </UserProvider>
    // <User></User>
  )
}

export default App;
