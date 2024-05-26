import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import "./css/style.css";
import "./fonts/material-icon/css/material-design-iconic-font.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* other routes... */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
