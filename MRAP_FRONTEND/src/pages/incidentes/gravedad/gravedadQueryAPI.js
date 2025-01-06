import axios from 'axios';
import { message } from 'antd';
import { useUserStore } from '../../store/userStore';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

// Configuración de la API
const gravedadAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/MRAP/incidente/gravedad/' // Cambia esto a tu URL real
});

// Función auxiliar para obtener el token de acceso
const getAccessToken = () => {
    const { userInfo } = useUserStore.getState();
    const accessToken = userInfo?.accessToken;
    if (!accessToken) {
        throw new Error("Token de acceso no disponible");
    }
    return accessToken;
};

// Función auxiliar para configurar los headers
const authHeaders = () => ({
    headers: { Authorization: `Bearer ${getAccessToken()}` }
});

// Función para mostrar mensajes de error
const showError = (operation, error) => {
    console.error(`Error en ${operation}:`, error);
    message.error(`Error al ${operation.toLowerCase()}: ${error.message}`);
};

// Mapea los datos de gravedad
const mapGravedadData = (data) => data.map((reg) => ({
    key: reg.id,
    descripcion: reg.descripcion,
}));

///////////////////////////////// GET /////////////////////////////////
export const getGravedades = async () => {
    try {
        const response = await gravedadAPI.get('/', authHeaders());
        return mapGravedadData(response?.data || []);
    } catch (error) {
        showError('obtener tipos de gravedad', error);
    }
};

// Hook para obtener todas las gravedades
export const useGetGravedades = () => {
    return useQuery(['gravedades'], getGravedades, {
        onError: (error) => showError('obtener tipos de gravedad', error)
    });
};
