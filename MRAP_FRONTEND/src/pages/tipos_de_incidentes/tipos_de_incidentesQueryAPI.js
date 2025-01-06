import axios from 'axios';
import { message } from 'antd';
import { useUserStore } from '../../store/userStore'; // Asegúrate de importar tu store correctamente
import { useMutation, useQueryClient } from '@tanstack/react-query';

const incidenteAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/MRAP/incidente/' // Cambia la base URL según sea necesario
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

///////////////////////////////// GET ALL /////////////////////////////////
export const getIncidentes = async () => {
    try {
        const accessToken = getAccessToken();

        const response = await axios.get('http://127.0.0.1:8000/MRAP/incidente/tipo_incidente/', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response?.data) {
            const data = [];
            for (let reg of response.data) {
                const registro = {
                    key: reg.id,
                    descripcion_tipo_incidente: reg.descripcion_tipo_incidente,
                    inhabilitar_elemento: reg.inhabilitar_elemento,
                };
                data.push(registro);
            }
            return data;
        }
    } catch (error) {
        console.log('Error en getIncidentes:', error);
        message.error('Error al obtener incidentes: ' + error.message);
    }
};

///////////////////////////////// GET ONE /////////////////////////////////
export const getIncidente = async (id) => {
    try {
        const accessToken = getAccessToken();

        const response = await incidenteAPI.get(`/incidente/${id}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;
    } catch (error) {
        console.log('Error en getIncidente:', error);
        message.error('Error al obtener el incidente: ' + error.message);
    }
};

///////////////////////////////// POST /////////////////////////////////
const postIncidente = async (formValues) => {
    try {

        console.log(formValues)

        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        const { descripcion_tipo_incidente, inhabilitar_elemento } = formValues;

        const response = await incidenteAPI.post('/tipo_incidente/', {
            descripcion_tipo_incidente,
            inhabilitar_elemento
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        console.log('respuesta: ', response.data);
        return response.data;
    } catch (error) {
        console.log('Error en postIncidente:', error);
        message.error('Error al registrar el incidente: ' + error.message);
    }

};

export const usePostIncidente = () => {
    const queryClient = useQueryClient();

    return useMutation(postIncidente, {
        onSuccess: () => {
            queryClient.invalidateQueries('incidentes');
            message.success('Incidente registrado');

        },
        onError: (error) => {
            message.error('Error al registrar el nuevo incidente: ' + error.message);
        }
    });
};

///////////////////////////////// PUT /////////////////////////////////
const putIncidente = async (id, formValues) => {
    try {
        const accessToken = getAccessToken();

        const response = await incidenteAPI.put(`http://127.0.0.1:8000/MRAP/incidente/tipo_incidente/${id}/`, formValues, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;
    } catch (error) {
        console.log('Error en putIncidente:', error);
        message.error('Error al actualizar el incidente: ' + error.message);
    }
};

export const usePutIncidente = () => {
    const queryClient = useQueryClient();

    return useMutation(({ id, formValues }) => putIncidente(id, formValues), {
        onSuccess: () => {
            queryClient.invalidateQueries('incidentes');
            message.success('Incidente actualizado con éxito');
        },
        onError: (error) => {
            message.error('Error al actualizar el incidente: ' + error.message);
        }
    });
};

///////////////////////////////// DELETE /////////////////////////////////
const deleteIncidente = async (id) => {
    try {

        const accessToken = getAccessToken(); // Asegúrate de que esta función retorne un token válido
        if (!accessToken) {
            throw new Error('Access token no disponible');
        }

        // Verifica que la URL del endpoint sea correcta
        const response = await axios.delete(`http://127.0.0.1:8000/MRAP/incidente/tipo_incidente/${id}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}` // Token para la autorización
            }
        });

        return response; // Si no necesitas `response.data`, el return está bien
    } catch (error) {
        console.log('Error en deleteIncidente:', error); // Para debugging
        message.error(`Error al eliminar el incidente: ${error?.message || 'Error desconocido'}`); // Mejora en el manejo de errores
    }
};

export const useDeleteIncidente = () => {
    const queryClient = useQueryClient();

    return useMutation(deleteIncidente, {
        onSuccess: () => {
            message.success('Incidente eliminado'); // Mensaje cuando se elimina correctamente
            queryClient.invalidateQueries('incidentes'); // Invalida el cache de la query 'incidentes' para refrescar los datos
        },
        onError: (error) => {
            message.error(`Error al eliminar el incidente: ${error?.message || 'Error desconocido'}`);
        }
    });
};

///////////////////////////////// ADICIONALES /////////////////////////////////
export const getTipoIncidentesOpcion = async () => {
    try {
        const accessToken = getAccessToken(); // Asegúrate de que esta función retorne un token válido
        if (!accessToken) {
            throw new Error('Access token no disponible');
        }

        const data = []
        const tipos_incidentes = await axios.get(`http://127.0.0.1:8000/MRAP/incidente/tipo_incidente/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        // console.log(tipos_incidentes.data)

        for (let reg of tipos_incidentes.data) {
            data.push({
                value: reg.id,
                label: reg.descripcion_tipo_incidente
            })
        }

        // console.log(data)
        return data
    } catch (error) {
        console.log('Error en getTipoIncidentesOpcion')
        throw new Error(error)
    }
}