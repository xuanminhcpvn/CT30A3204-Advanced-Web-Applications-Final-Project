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
import i18n from './i18n';
import { useTranslation } from 'react-i18next';
function App() { 
  const [theme, setTheme] = useState<"light" | "dark">("light");//Parent owns Navigation state
  const [language, setLanguage] = useState<"en" | "fi">("en");
  const [jwt, setJwt] = useState<string | null>(null);
  const { t } = useTranslation();
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
            setLanguage(user.settings.language);
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(user.settings.theme);
            localStorage.setItem("theme", user.settings.theme);
        } catch (err) {
            console.log("Failed to load settings", err);
        }
    };
    fetchSettings();
  }, []);
  //themeUseEffect
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  //language useEffect
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const savedLanguage = localStorage.getItem("language") as "en" | "fi" | null;
    if (savedTheme) {setTheme(savedTheme);}
    if (savedLanguage) {setLanguage(savedLanguage);}
  }, []);
  return (
    <BrowserRouter>
      <Navigation setTheme={setTheme} theme={theme} setLanguage={setLanguage} language={language}/>
      <div className="App">
        <h1 style={{ color: "var(--text)" }}>{t("File Drive App")}</h1> 
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
