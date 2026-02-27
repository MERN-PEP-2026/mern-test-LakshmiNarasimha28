import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;