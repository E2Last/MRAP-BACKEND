import axios from 'axios';
import { message } from 'antd';
import { useUserStore } from '../../store/userStore'; // Asegúrate de importar tu store correctamente
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTiposDeElementosLikeOptions } from '../punto_de_control/puntoDeControlQueryApi';
import { getParametrosLikeOptions } from '../parametro/parametroQueryAPI';

// Configuración de la API base
const analisisIntervaloAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/MRAP/analisis/intervalo_referencia/'
});

// ////////////////////////////////////// GET ALL //////////////////////////////////////
export const getIntervalos = async () => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) throw new Error('Token de acceso no disponible');

        // Mueve la declaración de `response` antes de utilizarlo
        const response = await analisisIntervaloAPI.get('/', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const data = response.data.map(reg => ({
            key: reg.id,
            tipo_elemento: reg.tipo_elemento?.nombre_tipo_de_elemento,
            parametro: `${reg.parametro?.nombre_parametro} | ${reg.parametro?.unidad?.nombre_unidad}`,
            muy_bajo: reg.muy_bajo,
            bajo: reg.bajo,
            alto: reg.alto,
            muy_alto: reg.muy_alto,
            muy_bajo_regex: reg.muy_bajo_regex,
            bajo_regex: reg.bajo_regex,
            alto_regex: reg.alto_regex,
            muy_alto_regex: reg.muy_alto_regex
        }));

        return data;

    } catch (error) {
        console.error('Error en getIntervalos:', error.message);
        throw new Error(error.message);
    }
};

// Hook para obtener todos los intervalos
export const useGetIntervalos = () => {
    return useQuery(['intervalos'], getIntervalos, {
        onError: () => {
            message.error('Error al obtener los intervalos');
        }
    });
};



// ////////////////////////////////////// GET ONE //////////////////////////////////////
export const getIntervalo = async (id) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) throw new Error('Token de acceso no disponible');

        const response = await analisisIntervaloAPI.get(`/${id}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;

    } catch (error) {
        console.error('Error en getIntervalo:', error.message);
        throw new Error(error.message);
    }
};

// Hook para obtener un solo intervalo
export const useGetIntervalo = (id) => {
    return useQuery(['intervaloReferencia', id], () => getIntervalo(id), {
        enabled: !!id,
        onError: () => {
            message.error('Error al obtener el intervalo');
        }
    });
};


// ////////////////////////////////////// POST //////////////////////////////////////
const postIntervalo = async (data) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) throw new Error('Token de acceso no disponible');

        console.log(data)

        const response = await axios.post('http://127.0.0.1:8000/MRAP/analisis/intervalo_referencia/', data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        return response.data;

    } catch (error) {
        console.error('Error en postIntervalo:', error.message);
        throw new Error(error.message);
    }
};

export const usePostIntervalo = () => {
    const queryClient = useQueryClient();

    return useMutation(postIntervalo, {
        onSuccess: () => {
            queryClient.invalidateQueries(['intervalos']);
            message.success('Intervalo registrado con éxito');
        },
        onError: (error) => {
            console.error('Error al registrar el intervalo:', error.message);
            message.error('Error al registrar el nuevo intervalo');
        }
    });
};

// ////////////////////////////////////// DELETE //////////////////////////////////////
const deleteIntervalo = async (id) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) throw new Error('Token de acceso no disponible');

        const response = await analisisIntervaloAPI.delete(`/${id}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;

    } catch (error) {
        console.error('Error en deleteIntervalo:', error.message);
        throw new Error(error.message);
    }
};

export const useDeleteIntervalo = () => {
    const queryClient = useQueryClient();

    return useMutation(deleteIntervalo, {
        onSuccess: () => {
            queryClient.invalidateQueries(['intervalos']);
            message.success('Intervalo eliminado con éxito');
        },
        onError: (error) => {
            console.error('Error al eliminar el intervalo:', error.message);
            message.error('Error al eliminar el intervalo');
        }
    });
};

// ////////////////////////////////////// PUT //////////////////////////////////////
const putIntervalo = async (id, data) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;
        console.log('data:', id)
        if (!accessToken) throw new Error('Token de acceso no disponible');

        const response = await analisisIntervaloAPI.put(`http://127.0.0.1:8000/MRAP/analisis/intervalo_referencia/${id}/`, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;

    } catch (error) {
        console.error('Error en putIntervalo:', error.message);
        throw new Error(error.message);
    }
};

export const usePutIntervalo = () => {
    const queryClient = useQueryClient();

    return useMutation(({ id, data }) => putIntervalo(id, data), {
        onSuccess: () => {
            queryClient.invalidateQueries(['intervalos']);
            message.success('Intervalo modificado con éxito');
        },
        onError: (error) => {
            console.error('Error al modificar el intervalo:', error.message);
            message.error('Error al modificar el intervalo');
        }
    });
};
