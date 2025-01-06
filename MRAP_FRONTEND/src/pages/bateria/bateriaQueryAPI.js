import axios from 'axios'
import { message } from 'antd';
import { useUserStore } from '../../store/userStore'; // Asegúrate de importar tu store correctamente
import { useMutation, useQueryClient } from '@tanstack/react-query';

const bateriaAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/MRAP/'
})

///////////////////////////////// GET ALL /////////////////////////////////
export const getBaterias = async () => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        // Asegúrate de que el token esté presente
        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await bateriaAPI.get('/bateria/',
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
                    nombre_bateria: reg.nombre_bateria,
                    tipo_elemento: reg.tipo_elemento.nombre_tipo_de_elemento,
                    latitud: reg.latitud,
                    longitud: reg.longitud
                }
                data.push(registro)
            }
            //console.log('Data de getBaterias: ', data)
            return data
        }

    } catch (error) {
        console.log('Error en gerBaterias')
    }
}
///////////////////////////////// GET BATTERY INCIDENTS /////////////////////////////////
export const getBateriaIncidentes = async (id) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        // Asegúrate de que el token esté presente
        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await bateriaAPI.get(`/bateria/${id}/incidentes_bateria/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        if (response) {
            const data = [];
            for (let reg of response.data) {
                const registro = {
                    incidente_id: reg.id,
                    titulo: reg.titulo,

                    bateria_id: reg.bateria.id,
                    nombre_bateria: reg.bateria.nombre_bateria,

                    estado_incidente: reg.estado_incidente.descripcion_operacion,
                    fecha_incidente: reg.fecha_incidente,
                    fecha_de_registro: reg.fecha_de_registro,
                    gravedad: reg.gravedad.descripcion,
                    tipo_incidente: reg.tipo_incidente.descripcion_tipo_incidente,
                    descripcion: reg.descripcion,
                    usuario: reg.usuario.alias
                };
                data.push(registro);
            }
            return data;
        }

    } catch (error) {
        console.log('Error en getBateriaIncidentes:', error);
        throw error; // Lanza el error para manejarlo en el componente
    }
}

///////////////////////////////// GET ONE /////////////////////////////////
export const getBateria = async (id) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const bateria = await bateriaAPI.get(`/bateria/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return bateria.data

    } catch (error) {
        console.log('Error en getBateria')
    }
}

///////////////////////////////// DELETE /////////////////////////////////
const deleteBateria = async (id) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        // Asegúrate de que el token esté presente
        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await bateriaAPI.delete(`/bateria/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        if (response) {
            return response.data
        }

    } catch (error) {
        console.log('Error en deleteBateria')
    }
}

export const useDeleteBateria = () => {
    const queryClient = useQueryClient()

    return useMutation(deleteBateria,
        {
            onSuccess: () => {
                message.success('Bateria eliminada')
                queryClient.invalidateQueries('baterias')
            },
            onError: () => {
                message.error('Error al eliminar el registro de la bateria')
            }
        }
    )
}

///////////////////////////////// POST /////////////////////////////////
const postBateria = async (formValues) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const { nombre_bateria, latitud, longitud, tipo_elemento } = formValues

        const response = await bateriaAPI.post('/bateria/',
            {
                nombre_bateria,
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
        console.log('error el postBateria')
    }
}

export const usePostBateria = () => {
    const queryClient = useQueryClient()

    return useMutation(postBateria,
        {
            onSuccess: () => {
                message.success('Nueva bateria registrada con exito')
                queryClient.invalidateQueries('baterias')
            },
            onError: () => {
                message.error('Error al registrar la nueva bateria')
            }
        }
    )
}

///////////////////////////////// PUT /////////////////////////////////
const putBateria = async (id, formValues) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const { nombre_bateria, latitud, longitud, tipo_elemento } = formValues

        const response = await bateriaAPI.put(`/bateria/${id}/`,
            {
                nombre_bateria,
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
        console.log('Error en putBateria')
    }
}

export const usePutBateria = () => {
    const queryClient = useQueryClient()

    return useMutation(
        ({ id, formValues }) => putBateria(id, formValues),
        {
            onSuccess: () => {
                message.success('Nueva bateria registrada con exito')
                queryClient.invalidateQueries('baterias')
            },
            onError: () => {
                message.error('Error el registrar la nueva bateria')
            }
        }
    )
}

///////////////////////////////// ADICIONALES /////////////////////////////////
export const getBateriasLikeOptions = async () => {
    const data = []
    
    const baterias = await getBaterias()
    
    for(let reg of baterias) {
        data.push(
            {
                value: reg.key,
                label: reg.nombre_bateria
            }
        )
    }

    return data
}