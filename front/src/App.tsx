import Header from "./components/Header";
import './App.css';
import Solicitacao from "./pages/Solicitacao";
import { Route, Routes } from "react-router-dom";
import ListagemCall from "./pages/Listagem";
import { useState } from "react";
import Authentication from "./components/Authentication";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = (key: string) => {
    setAuthenticated(true);
  };

  return (
    <>
    <Header />
      <div className="bg-div">
        <div className='d-flex flex-center flex-column flex-column-fluid hf-spacing'>
          <div className='container bg-light-opacity rounded mx-auto' style={{ padding: "2rem" }}>
            <Routes>
              <Route path="/" element={<Solicitacao />} />
              <Route path="/listagem" element={authenticated ? <ListagemCall /> : <Authentication onLogin={handleLogin} />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
