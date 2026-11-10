import './index.css'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const root = document.getElementById("root");

// Pages activas
import LoginPage from "./pages/Login.page.jsx";
import RecuperarPasswordPage from "./pages/RecuperarPass.page.jsx";

import InicioAdmin from "./pages/Admin/Inicio.admin.jsx";
import UsuariosPage from "./pages/Usuarios/Usuarios.page.jsx";
import ReportesPage from "./pages/Reportes/Reportes.page.jsx";

import MostradorPage from "./pages/Mostrador/Mostrador.page.jsx";
import SeleccionProducto from "./pages/Mostrador/SeleccionPage.jsx";
import CocinaPage from "./pages/Cocina/Cocina.page.jsx";

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/recuperar-password" element={<RecuperarPasswordPage />} />

      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <InicioAdmin />
        </ProtectedRoute>
      } />
      <Route path="/admin/usuarios" element={
        <ProtectedRoute requiredRole="admin">
          <UsuariosPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/reportes" element={
        <ProtectedRoute requiredRole="admin">
          <ReportesPage />
        </ProtectedRoute>
      } />

      <Route path="/mostrador" element={
        <ProtectedRoute requiredRole="mostrador">
          <MostradorPage />
        </ProtectedRoute>
      } />
      <Route path="/mostrador/seleccion" element={
        <ProtectedRoute requiredRole="mostrador">
          <SeleccionProducto />
        </ProtectedRoute>
      } />

      <Route path="/cocina" element={
        <ProtectedRoute requiredRole="cocina">
          <CocinaPage />
        </ProtectedRoute>
      } />
    </Routes>
  </BrowserRouter>,
);