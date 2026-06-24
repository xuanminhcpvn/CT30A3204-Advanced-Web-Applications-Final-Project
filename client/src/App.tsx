import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navigation from './components/Navigation'
import DocumentView from './pages/DocumentView';
import DocumentEdit from './pages/DocumentEdit';
import DocumentPublic from './pages/DocumentPublic';
import DocumentTrash from './pages/DocumentTrash';
import { useEffect, useState } from 'react';
function App() { 
  const [theme, setTheme] = useState<"light" | "dark">("light");//Parent owns state
  const [jwt, setJwt] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token){return;}
    setJwt(token);
    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/user/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!res.ok){return};
            const user = await res.json();
            setTheme(user.settings.theme);
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(user.settings.theme);
            localStorage.setItem("theme", user.settings.theme);
        } catch (err) {
            console.log("Failed to load settings", err);
        }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
    }
  }, []);
  return (
    <BrowserRouter>
      <Navigation setTheme={setTheme} theme={theme}/>
      <div className="App">
        <h1 style={{ color: "var(--text)" }}>File Drive App</h1> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trash" element={<DocumentTrash />} />
          <Route path="/document/edit/:driveFileId" element={<DocumentEdit />} />
          <Route path="/document/view/:driveFileId" element={<DocumentView />} />
          <Route path="/document/public/:driveFileId" element={<DocumentPublic />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App
