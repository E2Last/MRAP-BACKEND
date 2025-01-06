import axios from 'axios';
import { message } from 'antd';
import { useUserStore } from '../../store/userStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getBombasLikeOptions } from "../bomba/bombaQueryAPI";
import { getBateriasLikeOptions } from "../bateria/bateriaQueryAPI";
import { getCisternasLikeOptions } from "../cisterna/cisternaQueryAPI";
import { getCopasLikeOptions } from "../copa/copaQueryAPI";
import { getPozosLikeOption } from "../pozo/pozoQueryApi";
import { getPuntosInternosLikeOptiones } from "../punto_interno/PuntoInternoQueryAPI";

const incidentesAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/MRAP/'
})

const operacionesAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/MRAP/incidente/'
})
// f
///////////////////////////////// GET ALL /////////////////////////////////
export const getIncidentes = async (currentPage = 1) => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken)
            throw new Error('Token de acceso no disponible')

        let response = await incidentesAPI.get(`/incidente/?page=${currentPage}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        const resultados = response.data.results.map((reg) => ({
            key: reg.id,
            titulo: reg.titulo,
            descripcion: reg.descripcion,

            tipo_incidente: reg.tipo_incidente.descripcion_tipo_incidente,
            elemento_inhabilitado: reg.tipo_incidente.inhabilitar_elemento,

            fecha_incidente: reg.fecha_incidente,
            fecha_de_registro: reg.fecha_de_registro,
            descripcion_operacion: reg.estado_incidente.descripcion_operacion,
            gravedad: reg.gravedad.descripcion,
            usuario: {
                id: reg.usuario.id,
                username: reg.usuario.username,
                nombre: reg.usuario.nombre,
                apellido: reg.usuario.apellido,
                alias: reg.usuario.alias,
                perfil: reg.usuario.perfil
            },
            elemento: `#${reg.elemento.id} ${reg.elemento.nombre}`,
            tipo_elemento: reg.elemento.tipo_elemento.nombre_tipo_elemento
        }))

        const pages = { pages: Math.ceil(response.data.count) }

        console.log({
            pages: pages.pages,
            resultados: resultados
        })

        return {
            pages,
            resultados
        }

    } catch (error) {
        console.log('Error en get incidentes')
        throw new Error(error)
    }
};

///////////////////////////////// GET ONE /////////////////////////////////
export const getIncidente = async (id) => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken)
            throw new Error('Token de acceso no disponible')

        const response = await incidentesAPI.get(`/incidente/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response.data

    } catch (error) {
        console.log('Error en get incidentes')
        throw new Error(error)
    }
}

export const getGravedadesLikeOptions = async () => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken)
            throw new Error('Token de acceso no disponible')

        const response = await axios.get('http://127.0.0.1:8000/MRAP/incidente/gravedad/',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        const data = response.data.map((reg) => (
            {
                value: reg.id,
                label: reg.descripcion
            }
        ))

        return data

    } catch (error) {
        console.log('Error en getGravedadesLikeOptions')
        throw new Error(error)
    }
}

/////////////////////////////// DELETE /////////////////////////////////
const deleteIncidente = async (id) => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken)
            throw new Error('Token de acceso no disponible')

        const response = await axios.delete(`http://127.0.0.1:8000/MRAP/incidente/${id}/delete/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response

    } catch (error) {
        console.log('Error en deleteIncidente')
        throw new Error(error)
    }
}

export const useDeleteIncidente = () => {
    const queryClient = useQueryClient()

    return useMutation(deleteIncidente,
        {
            onSuccess: (_, id) => {
                queryClient.removeQueries({ queryKey: ['incidente'] })
                queryClient.invalidateQueries({ queryKey: ['incidentes'] })
                message.success('Incidente eliminado')
            },
            onError: () => {
                message.error(error.message | 'Error al eliminar el incidente')
            }
        }
    )
}

///////////////////////////////// POST /////////////////////////////////
const postIncidente = async (data) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo?.accessToken;

        if (!accessToken) {
            throw new Error('Token de acceso no disponible');
        }

        const {
            titulo,
            descripcion,
            tipo_incidente,
            fecha_incidente,
            gravedad,
            usuario,
            elemento: elemento_id,
            tipo_elemento
        } = data;

        const elemento = {
            id: elemento_id,
            tipo_elemento
        };

        const payload = {
            titulo,
            descripcion,
            tipo_incidente,
            fecha_incidente,
            gravedad,
            usuario,
            elemento
        };

        // console.log('Payload que se enviará:', JSON.stringify(payload, null, 2)); // <-- Útil para depuración

        // Realizamos la solicitud POST
        const response = await incidentesAPI.post(
            '/incidente/',
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Retornamos la respuesta si es exitosa
        return response.data;

    } catch (error) {
        // Manejo de errores mejorado para obtener más información
        if (error.response) {
            console.error('Error en respuesta del servidor:', error.response.data);
            throw new Error(error.response.data.detail || 'Error en la solicitud');
        } else {
            console.error('Error en postIncidente:', error.message);
            throw new Error(error.message);
        }
    }
};

export const usePostIncidente = () => {
    const queryClient = useQueryClient()

    return useMutation(postIncidente,
        {
            onSuccess: () => {
                queryClient.invalidateQueries('incidentes')
                message.success('Incidente registrado')
            },
            onError: () => {
                message.error(error.message || 'Error al registrar el incidente')
            }
        }
    )
}

///////////////////////////////// POST /////////////////////////////////
const putIncidente = async (id, data) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo?.accessToken;

        if (!accessToken) {
            throw new Error('Token de acceso no disponible');
        }

        const {
            titulo,
            descripcion,
            tipo_incidente,
            fecha_incidente,
            estado_incidente,
            gravedad,
            usuario,
            elemento: elemento_id,
            tipo_elemento
        } = data;

        const elemento = {
            id: elemento_id,
            tipo_elemento
        };

        const payload = {
            titulo,
            descripcion,
            tipo_incidente,
            fecha_incidente,
            estado_incidente,
            gravedad,
            usuario,
            elemento
        };

        console.log(payload)

        const response = await incidentesAPI.put(`/incidente/${id}/update/`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response.data

    } catch (error) {
        console.error('Error en putIncidente:', error.message);
        throw new Error(error.message);
    }
}

export const usePutIncidente = () => {
    const queryClient = useQueryClient()

    return useMutation(
        ({ id, data }) => putIncidente(id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('incidentes')
                message.success('Incidente modificado')
            },
            onError: () => {
                message.error(error.message)
            }
        }
    )
}

///////////////////////////////// ADICIONALES /////////////////////////////////
export const getOperacionesLikeOptions = async () => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken)
            throw new Error('Token de acceso no disponible')

        const response = await operacionesAPI.get('/operaciones/',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        const operaciones = response.data.map((operacion) => (
            {
                value: operacion.id,
                label: operacion.descripcion_operacion
            }
        ))

        return operaciones

    } catch (error) {
        throw new Error(error)
    }
}

export const getTiposDeElementosLikeOptions = async () => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken) {
            throw new Error('Token de acceso no disponible')
        }

        const data = []

        const response = await axios.get('http://127.0.0.1:8000/MRAP/tipo_de_elemento/',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        for (let reg of response.data) {
            data.push(
                {
                    value: reg.id,
                    label: reg.nombre_tipo_de_elemento
                }
            )
        }

        return data

    } catch (error) {
        console.log('Error en getTiposDeElementosLikeOptions')
        console.log(error)
    }
}

export const getElementos = async (tipo_elemento_id) => {
    //BOMBAS
    if (tipo_elemento_id == 1) {
        const bombas = await getBombasLikeOptions()
        return bombas
    }
    // BATERIAS
    else if (tipo_elemento_id == 2)
        return (await getBateriasLikeOptions())
    // CISTERNAS
    else if (tipo_elemento_id == 3)
        return (await getCisternasLikeOptions())
    // COPAS
    else if (tipo_elemento_id == 4)
        return (await getCopasLikeOptions())
    // POZOS
    else if (tipo_elemento_id == 5)
        return (await getPozosLikeOption())
    // PUNTOS INTERNOS
    else if (tipo_elemento_id == 6)
        return (await getPuntosInternosLikeOptiones())
}