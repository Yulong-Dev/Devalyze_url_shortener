// devalyze_url/src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";
import App from "./App.jsx";
import ThemeContext from "./context/ThemeContext.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// ✅ Render immediately - let App.jsx handle CSRF initialization
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID} useOneTap={true}>
            <ThemeContext>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </ThemeContext>
        </GoogleOAuthProvider>
    </StrictMode>
);