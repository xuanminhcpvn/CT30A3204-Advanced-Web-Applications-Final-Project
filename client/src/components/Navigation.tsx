import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState} from "react";
import { useTranslation } from 'react-i18next';
//Problem: How to share state between components => app.tsx and 
const Navigation = ({setTheme,theme, setLanguage, language}: {
    setTheme: (mode: "light" | "dark") => void;
    theme: "light" | "dark";
    setLanguage: (language: "en" | "fi" | "vi") => void;
    language: "en" | "fi" | "vi";
}) => {
    const [jwt, setJwt] = useState<string | null>(null);//it will be best to pass this from app.tsx 
    const navigate = useNavigate();
    const { t } = useTranslation();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setJwt(token);
        }
    }, []);
    
    const handleLanguageChange = async (language: "en" | "fi" | "vi") => {
        setLanguage(language)
        try {
            await fetch("/api/user/me/settings", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwt}`
                },
                body: JSON.stringify({ language })
            });

            localStorage.setItem("language", language);
            console.log("Language updated:", language);
        } catch (err) {
            console.log("Failed to update language:", err);
        }
    };
    const handleLightModeChange = async (theme: "light" | "dark") => {
        setTheme(theme);
        try {
            await fetch("/api/user/me/settings", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwt}`
                },
                body: JSON.stringify({ theme: theme })
            });
            localStorage.setItem("theme", theme);
        } catch (err) {
            console.log("Failed to update theme:", err);
        }
    };
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setJwt(null);
        window.location.href = "/"
    }

    return (
    <nav style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/">{t("Home")}</Link>

        {!jwt ? (
            <>
                <Link to="/login">{t("Login")}</Link>
                <Link to="/register">{t("Register")}</Link>
            </>
        ) : (
            <button onClick={logout}>{t("Logout")}</button>
        )}
        <button onClick={() => navigate("/trash")}>{t("Trash")}</button>
        <button onClick={() => handleLanguageChange("fi")}>FI</button>
        <button onClick={() => handleLanguageChange("en")}>EN</button>
        <button onClick={() => handleLanguageChange("vi")}>VI</button>
        <button onClick={() => handleLightModeChange("light")}>{t("Light")}</button>
        <button onClick={() => handleLightModeChange("dark")}>{t("Dark")}</button>
    </nav>
    );
}

export default Navigation;