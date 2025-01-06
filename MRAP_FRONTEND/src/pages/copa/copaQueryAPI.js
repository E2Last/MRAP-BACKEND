import axios from 'axios'
import { message } from 'antd';
import { useUserStore } from '../../store/userStore'; // Asegúrate de importar tu store correctamente
import { useMutation, useQueryClient } from '@tanstack/react-query';

const copasAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/MRAP/'
})
///////////////////////////////// GET ALL /////////////////////////////////
export const getCopas = async () => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        // Asegúrate de que el token esté presente
        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await copasAPI.get('copa',
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
                    nombre_copa: reg.nombre_copa,
                    tipo_elemento: reg.tipo_elemento.nombre_tipo_de_elemento,
                    latitud: reg.latitud,
                    longitud: reg.longitud,
                    estado: reg.estado.descripcion,
                    localidad: reg.localidad.nombre
                }
                data.push(registro)
            }
            //console.log(data)
            return data
        }

    } catch (error) {
        console.log('Error al obtener las copas')
        throw error
    }
}
///////////////////////////////// GET COPA INCIDENTES /////////////////////////////////
export const getCopaIncidentes = async (id) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        // Asegúrate de que el token esté presente
        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await copasAPI.get(`/copa/${id}/incidentes_copa/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const incidentes = response.data.map((reg) => ({
            incidente_id: reg.id,
            titulo: reg.titulo,
            
            copa_id: reg.copa.id, // Asegúrate de que este campo exista
            nombre_copa: reg.copa.nombre_copa, // Asegúrate de que este campo exista

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
        console.log("Error al obtener los incidentes de la copa:", error);
        throw error;
    }
}


///////////////////////////////// GET ONE /////////////////////////////////
export const getCopa = async (id) => {
    console.log('id en getCopa: ', id)
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const copa = await copasAPI.get(`/copa/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        console.log('datos de la copa a editar: ', copa.data)
        return copa.data

    } catch (error) {
        console.log('Error al obtener la copa en getCopa')
        throw error
    }
}

///////////////////////////////// PUT COPA /////////////////////////////////
const updateCopa = async (id, formValues) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        const { nombre_copa, tipo_elemento, latitud, longitud, estado, localidad } = formValues

        const response = await copasAPI.put(`/copa/${id}/`,
            {
                nombre_copa,
                tipo_elemento,
                latitud,
                longitud,
                estado,
                localidad
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

    } catch (error) {
        console.log('Error en updateCopa')
        throw error
    }
}

export const usePutCopa = () => {
    const queryClient = useQueryClient()
    return useMutation(
        ({ id, formValues }) => updateCopa(id, formValues),
        {
            onSuccess: () => {
                message.success('Cisterna modificada exitosamente');
                queryClient.invalidateQueries('cisternas');
            },
            onError: () => {
                message.error('Error al modificar la cisterna');
            }
        }
    )
}

///////////////////////////////// POST /////////////////////////////////
const postCopa = async (formValues) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        // Valores del nuevo registro de la copa
        const { nombre_copa, tipo_elemento, latitud, longitud, estado, localidad } = formValues

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await copasAPI.post('/copa/',
            {
                nombre_copa,
                tipo_elemento,
                latitud,
                longitud,
                estado,
                localidad
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

    } catch (error) {
        console.log('Error al crear el nuevo registro post de la copa en postCopa')
        throw error
    }
}

export const usePostCopa = () => {
    const queryClient = useQueryClient()
    return useMutation(postCopa,
        {
            onSuccess: () => {
                message.success('Copa creada correctamente')
                queryClient.invalidateQueries('copas')
            },
            onError: () => {
                message.error('Error al crear la copa')
            }
        }
    )
}

///////////////////////////////// DELETE //////////////////////////////
const deleteCopa = async (id) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await copasAPI.delete(`/copa/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        if (response) {
            console.log('cisterna borrada en deleteCopa')
            return response.data
        }

    } catch (error) {
        console.log('error al borrar la copa en deleteCopa')
        throw error
    }
}

export const useDeleteCopa = () => {
    const queryClient = useQueryClient()

    return useMutation(deleteCopa,
        {
            onSuccess: () => {
                message.success('Copa borrada correctamente')
                queryClient.invalidateQueries('copas')
            },
            onError: () => {
                message.error('Error al borrar el registro de la copa')
            }
        }
    )
}

///////////////////////////////// ADICIONALES //////////////////////////////
export const getCopasLikeOptions = async () => {

    const { userInfo } = useUserStore.getState();
    const accessToken = userInfo.accessToken;

    if (!accessToken) {
        throw new Error("Token de acceso no disponible");
    }

    const data = []
    const copas = await copasAPI.get('/copa/',
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    )

    for (let reg of copas.data) {
        data.push({
            value: reg.id,
            label: reg.nombre_copa
        })
    }

    return data
}