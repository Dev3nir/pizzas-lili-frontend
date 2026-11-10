// src/components/Menu_admin.component.jsx

import { useState } from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { MenuOutlined, CloseOutlined, LogoutOutlined } from "@ant-design/icons";

const MenuAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    {
      key: "/admin/usuarios",
      label: "Gestionar usuarios",
    },
    {
      key: "/admin/reportes",
      label: "Reportes de ventas",
    },
    {
      key: "/admin/",
      label: "Inicio",
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {/* Botón de Hamburguesa flotante en la esquina superior derecha del contenido */}
      <div
        style={{
          position: "absolute",
          top: "115px",
          right: "30px",
          zIndex: 1000,
          cursor: "pointer",
          color: "#313131",
          fontSize: "46px",
          padding: "8px 12px",
          
          display: "flex",
          alignItem: "center",
          justifyContent: "center",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <CloseOutlined style={{ color: "#e1e1e1", fontSize: "45px" }} />
        ) : (
          <MenuOutlined style={{ color: "#313131", fontSize: "48px" }} />
        )}
      </div>

      {/* Menú Abatible / Sidebar Derecho con Transparencia y Blur */}
      <div
        style={{
          position: "fixed",
          top: "90px", // Justo debajo del Header
          right: 0,
          width: "20%",
          height: "calc(100vh - 90px)",
          backgroundColor: "rgba(53, 53, 53, 0.88)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "-5px 0 25px rgba(0,0,0,0.2)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingTop: "120px",
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={handleMenuClick}
          style={{
            backgroundColor: "transparent",
            borderRight: "none",
            color: "#FFFFFF",
            fontSize: "20px",
            fontWeight: 550,
          }}
          theme="dark"
        />

        {/* Botón de Cerrar Sesión en la parte inferior */}
        <div style={{ padding: "150px 20px" }}>
          <div
            onClick={handleLogout}
            style={{
              color: "#ff1d0c",
              fontSize: "20px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 15px",
              borderRadius: "8px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(204, 39, 27, 0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <LogoutOutlined />
            Cerrar sesión
          </div>
        </div>
      </div>

      <style>
        {`
          .ant-menu-dark .ant-menu-item-selected {
            background-color: #303030 !important;
            color: white !important;
          }
          .ant-menu-dark .ant-menu-item:hover {
            background-color: #c8261a !important;
            color: white !important;
          }
          .ant-menu-dark .ant-menu-item {
            margin-inline: 0px !important;
            width: 100% !important;
            border-radius: 0px;
            height: 65px !important;
            display: flex;
            align-items: center;
            padding-left: 45px !important;
            margin-bottom: 30px !important;
          }
        `}
      </style>
    </>
  );
};

export default MenuAdmin;