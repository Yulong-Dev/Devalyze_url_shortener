import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";
import App from "./App.jsx";
import ThemeContext from "./context/ThemeContext.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
const GOOGLE_CLIENT_ID = "20918768827-2fk6u0idg2ru70od8rvq39e27uflb8uv.apps.googleusercontent.com";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID} useOneTap={ true}>
        <ThemeContext>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ThemeContext>
    </GoogleOAuthProvider>
  </StrictMode>
);
