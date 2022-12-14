import "./App.css";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import { AuthContextComponent } from "./contexts/authContext";
import { useEffect, useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Tarefas from "./pages/Tarefas";
import Registro from "./pages/Registro";
import NavBar from "./components/NavBar";
import SetorGestor from "./pages/SetorGestor";
import SetorAdmin from "./pages/SetorAdmin";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import Atividades from "./pages/Atividades";
import Deducoes from "./pages/Deducoes";
function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="App">
      <Toaster />
      <AuthContextComponent>
        <NavBar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route
            path="/atividades"
            element={<ProtectedRoute Component={Atividades} />}
          />
          <Route
            path="/deducoes"
            element={<ProtectedRoute Component={Deducoes} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute Component={Profile} />}
          />
          <Route
            path="/tarefas"
            element={<ProtectedRoute Component={Tarefas} />}
          />
          <Route
            path="/gestorsetor"
            element={<ProtectedRoute Component={SetorGestor} />}
          />
          <Route
            path="/setor/:setorId"
            element={<ProtectedRoute Component={SetorGestor} />}
          />
          <Route
            path="/adminsetor"
            element={<ProtectedRoute Component={SetorAdmin} />}
          />
        </Routes>
        <Footer />
      </AuthContextComponent>
    </div>
  );
}

export default App;
