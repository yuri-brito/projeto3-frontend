import "./App.css";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import { AuthContextComponent } from "./contexts/authContext";
import Login from "./pages/Login";
import Tarefas from "./pages/Tarefas";
import Registro from "./pages/Registro";
function App() {
  return (
    <div className="App">
      <Toaster />
      <AuthContextComponent>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/tarefas" element={<Tarefas />} />
        </Routes>
      </AuthContextComponent>
    </div>
  );
}

export default App;
