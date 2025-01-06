import axios from 'axios'
import { message } from 'antd';
import { useUserStore } from '../../store/userStore'; // Asegúrate de importar tu store correctamente
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const getUserLoged = () => {
    try {
        const { userInfo } = useUserStore.getState(); // Obtener el estado actual
        const usuario = userInfo?.username; // Accede a 'username', si existe
        return usuario ?? 'Usuario'; // Retorna 'Usuario' si 'username' es undefined o null
    } catch (error) {
        console.error("Error al obtener el usuario logueado:", error);
        return 'Usuario'; // Retorna un valor por defecto en caso de error
    }
}