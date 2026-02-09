import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import CommmentPage from "./pages/CommmentPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/Signup" element={<SignUp />} />
      <Route path="/Home" element={<HomePage />} />
      
<Route path="/post/:postId" element={<CommmentPage />} />
    </Routes>
  );
}

export default App;
