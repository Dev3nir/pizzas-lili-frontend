import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;

  if (requiredRole) {
    const userData = localStorage.getItem("user");
    if (!userData) return <Navigate to="/" replace />;

    try {
      const user = JSON.parse(userData);
      const rolRaw = (user.rol || "").toLowerCase();
      const rol = rolRaw === "administrador" ? "admin" : rolRaw;
      if (rol !== requiredRole.toLowerCase()) {
        return <Navigate to="/" replace />;
      }
    } catch {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;