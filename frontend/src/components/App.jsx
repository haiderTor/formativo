// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./login/login.jsx";
import Tablero from "./principal/principal.jsx";
import Personal from "./personal/personal.jsx";


function App() {
    return (
        <div className="flex flex-row min-h-screen bg-gray-100">
        <BrowserRouter>
            <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/tablero" element={<Tablero />} />
            <Route path="/personal" element={<Personal />} />
            </Routes>
        </BrowserRouter>
        </div>
    );
}

export default App;
