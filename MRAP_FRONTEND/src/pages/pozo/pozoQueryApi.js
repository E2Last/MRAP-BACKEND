import axios from 'axios'
import { message } from 'antd';
import { useUserStore } from '../../store/userStore'; // Asegúrate de importar tu store correctamente
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getBaterias } from '../bateria/bateriaQueryAPI';
import { getBombas } from '../bomba/bombaQueryAPI';

const pozoAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/MRAP/'
})

///////////////////////////////// GET ALL /////////////////////////////////
export const getPozos = async () => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await pozoAPI.get('/pozo/',
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
                    nombre_pozo: reg.nombre_pozo,
                    tipo_elemento: reg.tipo_elemento.nombre_tipo_de_elemento,
                    latitud: reg.latitud,
                    longitud: reg.longitud,
                    estado: reg.estado.descripcion,
                    nombre_bateria: (reg.bateria.nombre_bateria) + (` (${reg.bateria.id}) `),
                    nombre_bomba: (reg.bomba.nombre_bomba) + (` (${reg.bomba.id}) `),
                }
                data.push(registro)
            }
            return data
        }

    } catch (error) {
        console.log('Error en getPozos')
        console.log(error)
    }
}
///////////////////////////////// GET POZO INCIDENTES /////////////////////////////////
export const getPozoIncidentes = async (id) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        // Asegúrate de que el token esté presente
        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await pozoAPI.get(`/pozo/${id}/incidentes_pozo/`, {
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
export const getPozo = async (id) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const pozo = await pozoAPI.get(`/pozo/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return pozo.data

    } catch (error) {
        console.log('Error en getPozo')
        console.log(error)
    }
}
///////////////////////////////// DELETE /////////////////////////////////
const deletePozo = async (id) => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken) {
            throw new Error('Token de acceso no disponible')
        }

        const response = await pozoAPI.delete(`/pozo/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response.data

    } catch (error) {
        console.log('Error en deletePozo')
        console.log(error)
    }
}

export const useDeletePozo = () => {
    const queryClient = useQueryClient()

    return useMutation(deletePozo,
        {
            onSuccess: () => {
                message.success('Pozo eliminado')
                queryClient.invalidateQueries('pozos')
            },
            onError: () => {
                message.error('Error al eliminar el registro')
            }
        }
    )
}

///////////////////////////////// POST /////////////////////////////////
const postPozo = async (formValues) => {
    //console.log('VALORES DEL FORMULARIO: ', formValues)

    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken) {
            throw new Error('Token no disponible')
        }

        const { nombre_pozo, tipo_elemento, estado, nombre_bateria, nombre_bomba, latitud, longitud } = formValues

        const response = await pozoAPI.post('/pozo/',
            {
                nombre_pozo,
                tipo_elemento,
                estado,
                bateria: nombre_bateria,
                bomba: nombre_bomba,
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
        console.log('Error en postPozo')
        console.log(error)
    }
}

export const usePostPozo = () => {
    const queryClient = useQueryClient()

    return useMutation(postPozo, {
        onSuccess: () => {
            queryClient.invalidateQueries('pozos')
            message.success('Pozo registrado')
        },
        onError: () => {
            message.error('Error al registrar el nuevo Pozo')
        }
    })
}

///////////////////////////////// PUT /////////////////////////////////
const putPozo = async (id, formValues) => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        const { nombre_pozo, tipo_elemento, estado, nombre_bateria, nombre_bomba, latitud, longitud } = formValues

        const response = await pozoAPI.put(`/pozo/${id}/`,
            {
                nombre_pozo,
                tipo_elemento,
                estado,
                bateria: nombre_bateria,
                bomba: nombre_bomba,
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
        console.log('Error en putPozo')
        console.log(error)
    }
}

export const usePutPozo = () => {
    const queryClient = useQueryClient()

    return useMutation(
        ({ id, formValues }) => putPozo(id, formValues),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('pozos')
                message.success('Pozo actualizado con exito')
            },
            onError: () => {
                message.success('Error al actualizar el pozo')
            }
        }
    )
}

///////////////////////////////// ADICIONALES /////////////////////////////////
export const getBateriasLikeOptions = async () => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const baterias = await getBaterias()
        const data = []

        if (!baterias || baterias.length === 0) {
            throw new Error("No se encontraron baterias")
        }

        for (let reg of baterias) {
            data.push(
                {
                    value: reg.key,
                    label: (reg.nombre_bateria) + (` (${reg.key}) `)
                }
            )
        }

        return data

    } catch (error) {
        console.log('Error al obtener las baterias')
        console.log(error)
    }
}

export const getBombasLikeOptions = async () => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const bombas = await getBombas()
        const data = []

        if (!bombas || bombas.length === 0) {
            throw new Error("No se encontraron baterias")
        }

        for (let reg of bombas) {
            data.push(
                {
                    value: reg.key,
                    label: (reg.nombre_bomba) + (` (${reg.key}) `)
                }
            )
        }

        return data

    } catch (error) {
        console.log('Error al obtener las bombas')
        console.log(error)
    }
}

export const getPozosLikeOption = async () => {
    const { userInfo } = useUserStore.getState();
    const accessToken = userInfo.accessToken;

    if (!accessToken) {
        throw new Error("Token de acceso no disponible");
    }

    const data = []
    const pozos = await pozoAPI.get('/pozo/',
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    )

    for (let reg of pozos.data) {
        data.push({
            value: reg.id,
            label: reg.nombre_pozo
        })
    }

    return data
}