import axios from 'axios'
import { message } from 'antd';
import { useUserStore } from '../../store/userStore'; // Asegúrate de importar tu store correctamente
import { useMutation, useQueryClient } from '@tanstack/react-query';

const PuntoInternoAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/MRAP/'
})

///////////////////////////////// GET ALL /////////////////////////////////
export const getPuntosInternos = async () => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await PuntoInternoAPI.get('/punto_interno/',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        if (response) {
            const data = []
            for (let reg of response.data) {
                const registro = {
                    key: reg.id,
                    estado: reg.estado.descripcion,
                    nombre_punto_interno: reg.nombre_punto_interno,
                    tipo_elemento: reg.tipo_elemento.nombre_tipo_de_elemento,
                    latitud: reg.latitud,
                    longitud: reg.longitud
                }
                data.push(registro)
            }
    
            return data
        }

    } catch (error) {
        console.log('Error en getPuntosInternos')
    }
}
///////////////////////////////// GET PUNTO INTERNO INCIDENTES /////////////////////////////////
export const getPuntoInternoIncidentes = async (id) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        // Asegúrate de que el token esté presente
        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await PuntoInternoAPI.get(`/punto_interno/${id}/incidentes_punto_interno/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const incidentes = response.data.map((reg) => ({
            incidente_id: reg.id,
            titulo: reg.titulo,
            
            pozo_id: reg.pozo.id, // Asegúrate de que este campo exista
            nombre_pozo: reg.pozo.nombre_pozo, // Asegúrate de que este campo exista

            estado_incidente: reg.estado_incidente.descripcion_operacion,
            fecha_incidente: reg.fecha_incidente,
            fecha_de_registro: reg.fecha_de_registro,
            gravedad: reg.gravedad.descripcion,
            tipo_incidente: reg.tipo_incidente.descripcion_tipo_incidente,
            descripcion: reg.descripcion,
            usuario: reg.usuario.alias
        }));

        return incidentes;

    } catch (error) {
        console.log("Error al obtener los incidentes del pozo:", error);
        throw error;
    }
}

///////////////////////////////// GET ONE /////////////////////////////////
export const getPuntoInterno = async (id) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await PuntoInternoAPI.get(`/punto_interno/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response.data

    } catch (error) {
        console.log('Error en getPuntoInterno')
    }
}

///////////////////////////////// DELETE /////////////////////////////////
const deletePuntoInterno = async (id) => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await PuntoInternoAPI.delete(`/punto_interno/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response.data

    } catch (error) {
        console.log('Error en deletePuntoInterno')
    }
}

export const useDeletePuntoInterno = () => {
    const queryClient = useQueryClient()

    return useMutation(deletePuntoInterno,
        {
            onSuccess: () => {
                message.success('Punto interno eliminado')
                queryClient.invalidateQueries('puntos_internos')
            },
            onError: () => {
                message.error('Error al eliminar el punto interno')
            }
        }
    )
}

///////////////////////////////// POST /////////////////////////////////
const postPuntoInterno = async (formValues) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const { nombre_punto_interno, estado, tipo_elemento, latitud, longitud } = formValues

        const response = await PuntoInternoAPI.post('/punto_interno/',
            {
                estado,
                nombre_punto_interno,
                tipo_elemento,
                latitud,
                longitud
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response.data

    } catch (error) {
        console.log('Error en postPuntoInterno')
    }
}

export const usePostPuntoInterno = () => {
    const queryClient = useQueryClient()

    return useMutation(postPuntoInterno,
        {
            onSuccess: () => {
                message.success('Nuevo punto interno registrado')
                queryClient.invalidateQueries('puntos_internos')
            },
            onError: () => {
                message.error('Error el registrar el nuevo punto interno')
            }
        }
    )
}

///////////////////////////////// PUT /////////////////////////////////
const putPuntoInterno = async (id, formValues) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const { estado, nombre_punto_interno, tipo_elemento, latitud, longitud } = formValues

        const response = await PuntoInternoAPI.put(`/punto_interno/${id}/`,
            {
                estado,
                nombre_punto_interno,
                tipo_elemento,
                latitud,
                longitud
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response.data

    } catch (error) {
        console.log('Error en putPuntoInterno')
        console.log(error)
    }
}

export const usePutPuntoInterno = () => {
    const queryClient = useQueryClient()

    return useMutation(
        ({ id, formValues }) => putPuntoInterno(id, formValues),
        {
            onSuccess: () => {
                message.success('Punto interno actualiado')
                queryClient.invalidateQueries('puntos_internos')
            },
            onError: () => {
                message.error('Error al actualizar el punto interno')
            }
        }
    )
}

///////////////////////////////// ADICIONALES /////////////////////////////////
export const getPuntosInternosLikeOptiones = async () => {

    const { userInfo } = useUserStore.getState();
    const accessToken = userInfo.accessToken;

    if (!accessToken) {
        throw new Error("Token de acceso no disponible");
    }

    const data = []
    const response = await PuntoInternoAPI('/punto_interno/',
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    )

    for (let reg of response.data) {
        data.push({
            value: reg.id,
            label: reg.nombre_punto_interno
        })
    }

    return data
}