import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignupPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/Signup" element={<SignUp />} />
      <Route path="/Home" element={<HomePage />} />
    </Routes>
  );
}

export default App;
