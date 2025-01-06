import axios from 'axios'
import { message } from 'antd';
import { useUserStore } from '../../store/userStore'; // Asegúrate de importar tu store correctamente
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

///////////////////////////////// GET ALL /////////////////////////////////
const periodicidadesAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/MRAP/analisis/'
})

export const getPeriodicidades = async () => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken)
            throw new Error('Token de acceso no disponible')

        const response = await periodicidadesAPI.get('/periodicidad/',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        const data = response.data.map((registro) => (
            {
                key: registro.id,
                periodicidad_codigo: registro.periodicidad_codigo,
                periodicidad_nombre: registro.periodicidad_nombre,
                numero_dias: registro.numero_dias,
                retraso_dias: registro.retraso_dias,
                muy_retrasado_dias: registro.muy_retrasado_dias
            }
        ))

        return data

    } catch (error) {
        console.log('Error en getPeriodicidades')
        throw new Error(error.message || 'Error al obtener el listado de periodicidades')
    }
}

///////////////////////////////// GET ONE /////////////////////////////////
export const getPeriocididad = async (id) => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken)
            throw new Error('Token de acceso no disponible')

        const response = await periodicidadesAPI.get(`/periodicidad/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response.data

    } catch (error) {
        console.log('Error en getPeriodicidad')
        throw new Error(error.message || 'Error al editar la periodicidad')
    }
}

///////////////////////////////// POST /////////////////////////////////
const postPeriodicidad = async (data) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error('Token de acceso no disponible');
        }

        const response = await periodicidadesAPI.post('/periodicidad/',
            data,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response.data

    } catch (error) {
        console.log('Error en postPeriodicidad:', error.message || error);
        throw new Error(error.message || 'Error al registrar la nueva periodicidad');
    }
}

export const usePostPeriodicidad = () => {
    const queryClient = useQueryClient()

    return useMutation(postPeriodicidad,
        {
            onSuccess: () => {
                queryClient.invalidateQueries()
                message.success('Periodicidad nueva registrada')
            },
            onError: () => {
                message.error(error.message || 'Error al registrar la nueva periodicidad')
            }
        }
    )
}

///////////////////////////////// DELETE /////////////////////////////////
const deletePeriodicidad = async (id) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error('Token de acceso no disponible');
        }

        const response = await periodicidadesAPI.delete(`/periodicidad/${id}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;

    } catch (error) {
        console.log('Error en deletePeriodicidad:', error.message || error);
        throw new Error(error.message || 'Error al eliminar la periodicidad');
    }
};

export const useDeletePeriodicidad = () => {
    const queryClient = useQueryClient();

    return useMutation(deletePeriodicidad, {
        onSuccess: () => {
            queryClient.invalidateQueries('periodicidades');
            message.success('Periodicidad eliminada');
        },
        onError: (error) => {
            message.error(error.message || 'Error al eliminar la periodicidad');
        },
    });
};

///////////////////////////////// PUT /////////////////////////////////
const putPeriodicidad = async (id, data) => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken)
            throw new Error('Token de acceso no disponible')

        const response = await periodicidadesAPI.put(`/periodicidad/${id}/`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response.data

    } catch (error) {
        console.log('Error en putPeriodicidad')
        throw new Error(error.message || 'Error al modificar la periodicidad')
    }
}

export const usePutPeriodicidad = () => {
    const queryClient = useQueryClient()

    return useMutation(
        ({ id, data }) => putPeriodicidad(id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('periodicidades')
                message.success('Periodicidad modificada')
            },
            onError: () => {
                message.error('Error al modificar la periodicidad')
            }
        }
    )
}

///////////////////////////////// ADICIONALES /////////////////////////////////
export const getPeriodicidadesLikeOptions = async () => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken)
            throw new Error('Token de acceso no disponible')

        const response = await periodicidadesAPI.get('/periodicidad/',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        // const data = []

        // for(const reg of response.data){
        //     data.push({
        //         value: reg.id,
        //         label: `${reg.periodicidad_codigo} | ${reg.periodicidad_nombre}` 
        //     })
        // }

        // console.log(data)

        const data = response.data.map( (reg) => (
            {
                value: reg.id,
                label: `${reg.periodicidad_codigo} | ${reg.periodicidad_nombre}` 
            }
        ) )

        return data

    } catch (error) {
        console.log('Error en getPeriodicidadesLikeOptions')
        throw new Error(error.message || 'Error al obtener las periodicidades como opciones')
    }
}