// src/pages/Admin/Inicio.admin.jsx

import API_URL from "../../config/backend.js";
import axios from "axios";
import { useEffect, useState } from "react";
import MenuAdmin from "../../components/Menu_admin.componente.jsx";
import HeaderComponent from "../../components/Header.component.jsx";
import Logo from "../../assets/logos/logo.png";

// Importaciones de Ant Design
import { message } from "antd"; 
import { DollarOutlined } from "@ant-design/icons";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const InicioAdmin = () => {
    const [token] = useState(localStorage.getItem("token") || null);
    
    // Estados de estadísticas semanales (Basado en getReporteVentasEstadistico)
    const [semanalVentas, setSemanalVentas] = useState({
        "Lunes": 0, "Martes": 0, "Miércoles": 0, "Jueves": 0, "Viernes": 0, "Sábado": 0, "Domingo": 0
    });
    const [semanalVentasPasada, setSemanalVentasPasada] = useState({
  "Lunes": 0, "Martes": 0, "Miércoles": 0, "Jueves": 0, "Viernes": 0, "Sábado": 0, "Domingo": 0
});



    

    useEffect(() => {
        if (!token) {
            window.location.href = "/";
        }
    }, [token]);

    const fetchData = async () => {
  try {
    const hoy = new Date();

    // Lunes de esta semana
    const diaSemana = hoy.getDay(); // 0 = domingo, 1 = lunes...
    const offsetLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
    const lunesEstaSemana = new Date(hoy);
    lunesEstaSemana.setDate(hoy.getDate() + offsetLunes);
    lunesEstaSemana.setHours(0, 0, 0, 0);

    // Domingo de esta semana
    const domingoEstaSemana = new Date(lunesEstaSemana);
    domingoEstaSemana.setDate(lunesEstaSemana.getDate() + 6);
    domingoEstaSemana.setHours(23, 59, 59, 999);

    // Semana pasada
    const lunesSemanaPasada = new Date(lunesEstaSemana);
    lunesSemanaPasada.setDate(lunesEstaSemana.getDate() - 7);
    const domingoSemanaPasada = new Date(domingoEstaSemana);
    domingoSemanaPasada.setDate(domingoEstaSemana.getDate() - 7);

    const fmt = (d) => d.toISOString().slice(0, 10); // YYYY-MM-DD

        const base = `${API_URL}/reportes/ventas/estadisticas`;
    const [resActual, resPasada] = await Promise.all([
      axios.get(`${base}?fecha_inicio=${fmt(lunesEstaSemana)}&fecha_fin=${fmt(domingoEstaSemana)}`),
      axios.get(`${base}?fecha_inicio=${fmt(lunesSemanaPasada)}&fecha_fin=${fmt(domingoSemanaPasada)}`)
    ]);

    if (resActual.data?.semanal_ventas) {
      setSemanalVentas(resActual.data.semanal_ventas);
    }
    if (resPasada.data?.semanal_ventas) {
      setSemanalVentasPasada(resPasada.data.semanal_ventas);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

  

    // Helper: convierte un arreglo de valores en un path SVG
    const construirPath = (valores, maxValor = 30000) => {
    const dias = valores.length; // 7
    const xInicio = 60;
    const xFin = 700;
    const yBase = 190;
    const yTope = 15;
    const anchoPaso = (xFin - xInicio) / (dias - 1);

    return valores.map((v, i) => {
        const x = xInicio + i * anchoPaso;
        const ratio = Math.min(v / maxValor, 1);
        const y = yBase - ratio * (yBase - yTope);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
    };

   

    useEffect(() => {
        fetchData();
      
    }, []);

    const useResponsive = () => {
        const [isTablet, setIsTablet] = useState(false);
        useEffect(() => {
            const checkResponsive = () => setIsTablet(window.innerWidth <= 1024 || window.innerHeight <= 700);
            checkResponsive();
            window.addEventListener("resize", checkResponsive);
            return () => window.removeEventListener("resize", checkResponsive);
        }, []);
        return isTablet;
    };

    const isTablet = useResponsive();
    const headerHeight = isTablet ? 70 : 90;

    const diasKeys = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const diasCortos = ["Lun", "Mar", "Mier", "Jue", "Vie", "Sab", "Dom"];

const dataGrafica = {
  labels: diasCortos,
  datasets: [
    {
      label: "Esta semana",
      data: diasKeys.map((d) => Number(semanalVentas[d] || 0)),
      borderColor: "#111111",
      backgroundColor: "#111111",
      borderWidth: 3,
      pointRadius: 4,
      pointHoverRadius: 7,
      tension: 0.35, // curva suave
    },
    {
      label: "Semana pasada",
      data: diasKeys.map((d) => Number(semanalVentasPasada[d] || 0)),
      borderColor: "#5A9BD5",
      backgroundColor: "#5A9BD5",
      borderWidth: 2.5,
      borderDash: [6, 4], // línea punteada
      pointRadius: 3,
      pointHoverRadius: 6,
      tension: 0.35,
    },
  ],
};

const optionsGrafica = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      align: "left",
      labels: {
        usePointStyle: true,
        pointStyle: "line",
        font: { size: 16, weight: "400" },
        color: "#555",
        padding: 30,
      },
    },
    tooltip: {
      backgroundColor: "rgba(20,20,20,0.9)",
      padding: 12,
      titleFont: { size: 15, weight: "bold" },
      bodyFont: { size: 14 },
      callbacks: {
        label: (ctx) => {
          const valor = ctx.parsed.y;
          return ` ${ctx.dataset.label}: $${Number(valor).toLocaleString("es-MX", {
            minimumFractionDigits: 2,
          })}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#888", font: { size: 15, weight: "500" } },
    },
    y: {
      beginAtZero: true,
      grid: { color: "#38383830" },
      ticks: {
        color: "#888",
        font: { size: 15 },
        callback: (value) => `${(value / 1000).toFixed(0)}K`,
      },
    },
  },
};

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            width: "100vw",
            height: "100vh",
            backgroundColor: "#f9f9f6",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            position: "relative",
            overflow: "hidden"
        }}>
            <HeaderComponent
                text="ADMINISTRADOR" 
                logo={Logo}
                height={headerHeight}
                isTablet={isTablet}
            />
            
            {/* Menú Lateral Desplegable Derecho */}
            <MenuAdmin />
            
            {/* Contenido Principal */}
            <div style={{ flex: 1, padding: "40px 90px", overflowY: "auto", position: "relative" }}>
                
                <h1 style={{ color: "#333", fontSize: "48px", fontWeight: "bold", margin: "0 0 40px 0" }}>
                    Buenas tardes, Uriel!
                </h1>
                <p style={{ color: "#5e5e5e", fontSize: "30px", marginBottom: "75px" }}>
                    Últimos días en Pizzeria Lili
                </p>

                {/* Tarjeta de Estadísticas / Gráfica de Ventas Diarias */}
                <div style={{
                    backgroundColor: "#ededed",
                    borderRadius: "35px",
                    padding: "35px 45px",
                    boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
                    maxWidth: "1000px",
                    margin: "0 auto",
                    height:"50%",
                    border: "1px solid #eaeaea"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "72px" }}>
                        <h2 style={{ fontSize: "30px", color: "#111", fontWeight: "bold", margin: 0 }}>
                            Ventas diarias
                        </h2>
                        
                    </div>

    
                    <div style={{ position: "relative", height: "320px", width: "100%" }}>
                        {/* Gráfica de ventas con Chart.js */}
<div style={{ position: "relative", height: "300px", width: "100%" }}>
  <Line data={dataGrafica} options={optionsGrafica} />
</div>

                       
                    </div>
                </div>

            </div>

          
        </div>
    );
};

export default InicioAdmin;