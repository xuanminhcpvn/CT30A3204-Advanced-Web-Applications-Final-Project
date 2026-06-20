/*CT30A3204 Advanced Web Applications Final Project
  Author: Minh Pham
  Created at: 20/06/2026
  Last modified at: 20/06/206
*/
import { useState } from "react";
const registerUser = async (username: string, email: string, password: string, setLoading: (value: boolean) => void) => {
    try {
        setLoading(true);
        // Might need to refactor when the user model gets more complex
        const response = await fetch("http://localhost:3000/api/user/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username,
                email,
                password
            })
        });
        
        if (!response.ok) {
            throw new Error("Error fectching data");
        }
        const data = await response.json();
        console.log(data)
        // Next page => login
        if(response.status === 200) {
            window.location.href = "/login";
        }

    } catch (error) {
        if (error instanceof Error) {
            console.log(`Error when trying to register: ${error.message}`);
        }
    } finally {
        setLoading(false);
    }
};
const Register = () => {
    // Might need to refactor when the user model gets more complex
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    return (
        <div>
            <h2>Register</h2>
            {/* Username input */}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            {/* Email input */}
            <input
                type="mail" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                />
            {/* Password input */}
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {/* Submit button */}
            <button onClick={() => registerUser(username,email, password, setLoading)} disabled={loading}>
                {loading ? "Registering..." : "Register"}
            </button>
        </div>
    );
};
export default Register;