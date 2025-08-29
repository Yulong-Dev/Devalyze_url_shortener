import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/SignIn" replace />;
  }

  // Else, render the protected page
  return children;
};

export default PrivateRoute;
