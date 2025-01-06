import axios from 'axios'
import { message } from 'antd';
import { useUserStore } from '../../store/userStore'; // Asegúrate de importar tu store correctamente
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

///////////////////////////////// GET ALL /////////////////////////////////
const unidadesAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/MRAP/analisis/'
})

export const getUnidades = async () => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible")
        }

        const response = await unidadesAPI.get('/unidad/',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        const data = response.data.map((reg) => ({
            key: reg.id,
            codigo: reg.codigo,
            nombre_unidad: reg.nombre_unidad
        }))

        return data
    }
    catch (error) {
        console.log('Error en getUnidades: ', error)
        message.error("Error al obtener las unidades")
        throw Error("Error al obtener las unidades")
    }
}

///////////////////////////////// GET ONE /////////////////////////////////
export const getUnidad = async (id) => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken)
            throw new Error('Token de acceso no disponible')

        const response = await unidadesAPI.get(`/unidad/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        //console.log(response.data)

        return response.data
    } catch (error) {
        console.log('Error en getUnidad')
    }
}

///////////////////////////////// POST /////////////////////////////////
const postUnidad = async (data) => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken) {
            throw new Error('Token de acceso no disponible')
        }

        const { codigo_unidad, nombre_unidad } = data

        const response = await unidadesAPI.post('/unidad/',
            {
                codigo: codigo_unidad,
                nombre_unidad: nombre_unidad
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response.data

    } catch (error) {
        console.log('error en post unidad')
        throw new Error(error)
    }
}

export const usePostUnidad = () => {
    const queryClient = useQueryClient()

    return useMutation(postUnidad,
        {
            onSuccess: () => {
                queryClient.invalidateQueries('unidades')
                message.success('Nueva unidad registrada')
            },
            onError: () => {
                message.error(error)
            }
        }
    )
}

///////////////////////////////// DELETE /////////////////////////////////
const deleteUnidad = async (id) => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken) {
            throw new Error('Token de acceso no disponible')
        }

        const response = await unidadesAPI.delete(`/unidad/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response.data

    } catch (error) {
        console.log('Error en deleteUnidad')
        throw new Error(error)
    }
}

export const useDeleteUnidad = () => {
    const queryClient = useQueryClient()

    return useMutation(deleteUnidad, {
        onSuccess: () => {
            queryClient.invalidateQueries('unidades')
            message.success('Unidad eliminada exitosamente')
        },
        onError: () => {
            message.error('Error al eliminar la unidad')
        }
    })
}
///////////////////////////////// PUT /////////////////////////////////
const putUnidad = async (id, data) => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken)
            throw new Error('Token de acceso no disponible')

        const { codigo_unidad, nombre_unidad } = data

        const response = await unidadesAPI.put(`/unidad/${id}/`,
            {
                codigo: codigo_unidad,
                nombre_unidad: nombre_unidad
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response.data

    } catch (error) {
        console.log('Error en putUnidad')
        message.error(error.message || 'Error al editar la unidad') // Mostrar el mensaje de error
    }
}

export const usePutUnidad = () => {
    const queryClient = useQueryClient()

    return useMutation(
        ({ id, data }) => putUnidad(id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('unidades')
                message.success('Unidad editada')
            },
            onError: (error) => {
                message.error(error.message || 'Error al editar la unidad') // Pasar el error correctamente
            }
        }
    )
}

///////////////////////////////// ADICIONALES /////////////////////////////////
export const getUnidadesLikeOptiones = async () => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible")
        }

        const response = await unidadesAPI.get('/unidad/',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        const unidades = response.data.map( (reg) => (
            {
                value: reg.id,
                label: ` #${reg.id} | ${reg.nombre_unidad} (${reg.codigo})`
            }
        ))

        return unidades

    } catch (error) {
        console.log('Error en getUnidadesLikeOptiones')
        throw new Error("Error al obtener las unidades")
    }
}