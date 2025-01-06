import axios from 'axios';
import { message } from 'antd';
import { useUserStore } from '../../store/userStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

///////////////////////////////// GET ALL /////////////////////////////////
export const getHistorial = async (id) => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken)
            throw new Error('Token de acceso no disponible')

        const response = await axios.get(`http://127.0.0.1:8000/MRAP/incidente/historial/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        const historial = response.data.map(elemento => ({
            incidente: elemento.incidente,
            fecha: elemento.fecha,
            cambio: elemento.operacion.descripcion_operacion,
            usuario: {
                id: elemento.usuario.id,
                alias: elemento.usuario.alias
            }
        }))

        console.log(historial)

        return historial

    } catch (error) {
        console.log('Error en get historial')
        throw new Error(error)
    }
}

const realizarCambio = async ({ incidente_id, operacion_id }) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;
        const userId = userInfo.userId;

        if (!accessToken)
            throw new Error('Token de acceso no disponible');

        const payload = {
            incidente: incidente_id,
            operacion: operacion_id,
            usuario: userId,
        };

        console.log(payload)

        const response = await axios.post('http://127.0.0.1:8000/MRAP/incidente/operacion/',
            payload,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error en realizarCambio:', error);
        throw error.response?.data?.detail || error.message || 'Error desconocido';
    }
};

export const useRealizarCambio = () => {
    const queryClient = useQueryClient();

    return useMutation(
        // Cambiamos la función para que reciba un único objeto como argumento
        (variables) => realizarCambio(variables),
        {
            onSuccess: () => {
                queryClient.invalidateQueries();
                message.success('Historial modificado');
            },
            onError: (error) => {
                // Muestra el mensaje de error devuelto por `realizarCambio`
                message.error(`Error: ${error}`);
            },
        }
    );
};
