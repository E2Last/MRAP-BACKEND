import axios from 'axios'
import { message } from 'antd';
import { useUserStore } from '../../store/userStore'; // Asegúrate de importar tu store correctamente
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const parametroAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/MRAP/analisis/'
})

///////////////////////////////// GET ALL /////////////////////////////////
export const getParametros = async () => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken)
            throw new Error('Token de acceso no disponible')

        const response = await parametroAPI.get('/parametro/',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        const data = response.data.map(reg => {
            return {
                key: reg.id,
                parametro_codigo: reg.parametro_codigo,
                nombre_parametro: reg.nombre_parametro,
                codigo_unidad: reg.unidad.codigo,
                texto: reg.texto,
                nombre_unidad: reg.unidad.nombre_unidad,
                numero: reg.numero,
                decimales: reg.decimales
            };
        });

        return data

    } catch (error) {
        console.log('Error en getParametros')
        throw new Error(error.message)
    }
}

///////////////////////////////// GET ONE /////////////////////////////////
export const getParametro = async (id) => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken)
            throw new Error('Token de acceso no disponible')

        const response = await parametroAPI.get(`/parametro/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response.data

    } catch (error) {
        console.log('Error en getParametros')
        throw new Error(error.message)
    }
}

///////////////////////////////// POST /////////////////////////////////
const postParametro = async (data) => {
    try {

        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken)
            throw new Error('Token de acceso no disponible')

        const { parametro_codigo, nombre_parametro, unidad, texto, numero, decimales } = data

        const response = await parametroAPI.post('/parametro/',
            { parametro_codigo, nombre_parametro, unidad, texto, numero, decimales },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response.data

    } catch (error) {
        console.log('Error en postParametro')
        throw new Error(error.message)
    }
}

export const usePostParametro = () => {
    const queryClient = useQueryClient()

    return useMutation(postParametro, {
        onSuccess: () => {
            queryClient.invalidateQueries()
            message.success('Parametro registrado')
        },
        onError: () => {
            message.error('Error al registrar el nuevo parametro')
        }
    })
}

///////////////////////////////// DELETE /////////////////////////////////
const deleteParametro = async (id) => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken)
            throw new Error('Token de acceso no disponible')

        const response = await parametroAPI.delete(`/parametro/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response.data

    } catch (error) {
        console.log('Error en deleteParametro')
        throw new Error(error.message)
    }
}

export const useDeleteParametro = () => {
    const queryClient = useQueryClient()

    return useMutation(deleteParametro, {
        onSuccess: () => {
            queryClient.invalidateQueries()
            message.success('Parametro eliminado')
        },
        onError: () => {
            message.error('Error al eliminar el parametro')
        }
    })
}
///////////////////////////////// PUT /////////////////////////////////
const putParametro = async (id, data) => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken)
            throw new Error('Token de acceso no disponible')

        const response = await parametroAPI.put(`/parametro/${id}/`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response.data

    } catch (error) {
        console.log('Error en putParametro')
        throw new Error(error)
    }
}

export const usePutParametro = () => {
    const queryClient = useQueryClient()

    return useMutation(
        ({ id, data }) => putParametro(id, data), {
        onSuccess: () => {
            queryClient.invalidateQueries()
            message.success('Parametro modificado')
        },
        onError: () => {
            message.error(error)
        }
    })
}

///////////////////////////////// ADICIONALES /////////////////////////////////
export const getParametrosLikeOptions = async () => {
    const { userInfo } = useUserStore.getState();
    const accessToken = userInfo.accessToken;

    if (!accessToken) {
        throw new Error("Token de acceso no disponible");
    }

    const data = []

    const parametros = await parametroAPI.get('/parametro/',
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    )

    for (let reg of parametros.data) {
        data.push({
            value: reg.id,
            label: `${reg.parametro_codigo} | ${reg.nombre_parametro}`
        })
    }

    return data
}

const asignarParametroAnalisis = async ({ parametro_id, analisis_id }) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await parametroAPI.patch(`/parametro/${parametro_id}/`, { analisis: analisis_id },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response.data

    } catch (error) {
        console.log('Error en asignarParametroAnalisis')
        throw new Error(error)
    }
}

export const useAsignarParametro = () => {
    const queryClient = useQueryClient()

    return useMutation(
        (campos) => asignarParametroAnalisis(campos), {
        onSuccess: () => {
            queryClient.invalidateQueries()
            message.success('Parametro asignado')
        },
        onError: () => {
            message.error('Error al asignar el parametro')
        }
    })
}

export const getParametrosForTransfer = async () => {
    const { userInfo } = useUserStore.getState();
    const accessToken = userInfo.accessToken;

    if (!accessToken) {
        throw new Error("Token de acceso no disponible");
    }

    const parametros = await parametroAPI.get('/parametro/',
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    )

    const data = parametros.data.map( reg => {
        return {
            key: reg.id,
            title: `(${reg.parametro_codigo}) ${reg.nombre_parametro}`,
            description: `(${reg.parametro_codigo}) ${reg.nombre_parametro}`,
            chosen: false
        }
    } ) 

    return data
}