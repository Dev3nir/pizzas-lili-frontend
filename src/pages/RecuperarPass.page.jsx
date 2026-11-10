import { useState, useEffect } from "react";
import { Layout } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

import HeaderLogin from "../components/ui/Login/Header.login";
import FormLogin from "../components/ui/Login/Form.login";
import ImageLogin from "../components/ui/Login/Image.login";

import imagen from "../assets/img_login.png";
import Logo from "../assets/logos/logo.png";
import API_URL from "../config/backend.js";
import { TextField, Button, Typography, Box } from "@mui/material";

const { Header, Content } = Layout;

const useResponsive = () => {
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const checkResponsive = () => {
            setIsTablet(window.innerWidth <= 1024 || window.innerHeight <= 700);
        };

        checkResponsive();
        window.addEventListener("resize", checkResponsive);

        return () => window.removeEventListener("resize", checkResponsive);
    }, []);

    return isTablet;
};

const RecuperarPass = () => {

    const isTablet = useResponsive();
    const headerHeight = isTablet ? "70px" : "90px";
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (values) => {
        if (!values) return;

        try {
            setLoading(true);

            const url = `${API_URL}/login`;

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            });

            const data = await res.json();

            console.log("RESPONSE:", data);

            if (!res.ok) {

                Swal.fire({
                    icon: "error",
                    title: "Error de autenticación",
                    text: data.message === "Contraseña incorrecta"
                        ? "Contraseña incorrecta"
                        : data.message || "Error de login"
                });

                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("token_table", data.tokenInvitado);  // 
            localStorage.setItem("token_table_exp", (Date.now() + 24 * 60 * 60 * 1000).toString());
            Swal.fire({
                icon: "success",
                title: "Login exitoso",
                text: "Accediendo al panel...",
                timer: 1200,
                showConfirmButton: false
            });

            navigate("/admin");

        } catch (error) {

            console.log("ERROR LOGIN:", error);

            Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "No se pudo conectar al servidor"
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout
            style={{
                minHeight: "100vh",
                width: "100%",
                backgroundColor: "var(--background-color)",
                overflow: "hidden",
                userSelect: "none",
            }}
        >
            <Header style={{ padding: 0, height: headerHeight, lineHeight: headerHeight }}>
                <HeaderLogin text="Pizzería Lili" logo={Logo} height={headerHeight} isTablet={isTablet} />
            </Header>

            <Content
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: isTablet ? "start" : "center",
                    padding: isTablet ? "16px" : "32px",
                    height: `calc(100vh - ${headerHeight})`,
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: isTablet ? "900px" : "1400px",
                        display: "flex",
                        gap: isTablet ? "20px" : "40px",
                        height: isTablet ? "80%" : "70vh",
                    }}
                >
                    <motion.div style={{ flex: 1, display: "flex" }}>
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                maxWidth: 600,
                                p: isTablet ? 3 : 6,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: isTablet ? 2 : 3,
                                    mt: isTablet ? 2 : 10,
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: "var(--text-color)",
                                        fontSize: isTablet ? "26px" : "36px",
                                        fontWeight: 600,
                                    }}
                                >
                                    Recuperar contraseña
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "var(--text-color)",
                                        fontSize: isTablet ? "14px" : "18px",
                                        fontWeight: 300,
                                    }}
                                >
                                    Ingresa tu correo electrónico y te enviaremos instrucciones para recuperar tu acceso.
                                </Typography>

                                <TextField
                                    label="Correo electrónico"
                                    variant="outlined"
                                    fullWidth
                                />

                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        backgroundColor: "var(--primary-color)",
                                        textTransform: "none",
                                        borderRadius: 2,
                                    }}
                                >
                                    Enviar correo de recuperación
                                </Button>
                            </Box>
                        </Box>
                    </motion.div>

                    <motion.div style={{ flex: 1, display: "flex" }}>
                        <ImageLogin image={imagen} />
                    </motion.div>
                </div>
            </Content>
        </Layout>
    );
};

export default RecuperarPass;