import "./App.css";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Toaster />
      <AuthContextComponent>
        <Routes>
          <Route path="/" />
        </Routes>
      </AuthContextComponent>
    </div>
  );
}

export default App;
