import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState} from "react";
//Problem: How to share state between components => app.tsx and 
const Navigation = ({setTheme, theme}: {setTheme: (mode: "light" | "dark") => void; theme: "light" | "dark";}) => {
    const [jwt, setJwt] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setJwt(token);
        }
    }, []);
    
    const handleLanguageChange = async (language: string) => {
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
    const handleLightModeChange = async (mode: "light" | "dark") => {
        setTheme(mode);
        try {
            await fetch("/api/user/me/settings", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwt}`
                },
                body: JSON.stringify({ theme: mode })
            });
            localStorage.setItem("theme", mode);
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
        <Link to="/">Home</Link>

        {!jwt ? (
            <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </>
        ) : (
            <button onClick={logout}>Logout</button>
        )}

        <button onClick={() => navigate("/trash")}>Trash</button>
        <button onClick={() => handleLanguageChange("fi")}>FI</button>
        <button onClick={() => handleLanguageChange("en")}>EN</button>
        <button onClick={() => handleLightModeChange("light")}>Light</button>
        <button onClick={() => handleLightModeChange("dark")}>Dark</button>
    </nav>
    );
}

export default Navigation;