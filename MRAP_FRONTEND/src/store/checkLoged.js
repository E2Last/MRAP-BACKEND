import { useUserStore } from "./userStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // jwtDecode sin llaves

export const checkLoged = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const { userInfo, logoutUser } = useUserStore.getState();
        const { isLoged, accessToken } = userInfo;

        // Función para manejar el cierre de sesión y redirigir
        const handleLogout = () => {
            logoutUser();
            navigate('/');
        };

        // Verifica si hay un token de acceso
        if (!accessToken) {
            handleLogout();
            return;
        }

        try {
            const decoded = jwtDecode(accessToken); // Decodifica el token
            const currentTime = Date.now() / 1000; // Tiempo actual en segundos

            // Si el token ha expirado, se desloguea el usuario
            if (decoded.exp < currentTime) {
                console.log('Token expirado, usuario deslogueado');
                handleLogout();
            } else if (!isLoged) {
                // Si no está logueado, redirige al inicio
                navigate('/');
            }
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            handleLogout();
        }
    }, [navigate]); // Agregar `navigate` como dependencia para evitar advertencias
};
