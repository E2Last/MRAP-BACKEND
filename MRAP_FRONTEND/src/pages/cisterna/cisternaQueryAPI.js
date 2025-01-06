import axios from 'axios'
import { message } from 'antd';
import { useUserStore } from '../../store/userStore'; // Asegúrate de importar tu store correctamente
import { useMutation, useQueryClient } from '@tanstack/react-query';

const cisternasAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/MRAP/'
})

///////////////////////////////// GET /////////////////////////////////
export const getCisternas = async () => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        // Asegúrate de que el token esté presente
        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await cisternasAPI.get('/cisterna/',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}` // Asegúrate de incluir 'Bearer '
                }
            }
        );

        if (response) {
            const data = []

            //console.log(response.data)
            for (let reg of response.data) {
                const registro = {
                    key: reg.id,
                    nombre: reg.nombre_cisterna,
                    tipo_elemento: reg.tipo_elemento.nombre_tipo_de_elemento,
                    estado: reg.estado.descripcion,
                    latitud: reg.latitud,
                    longitud: reg.longitud,
                    localidad: reg.localidad.nombre,
                }
                data.push(registro)
            }
            return data
        }
        //return response.data;
    } catch (error) {
        console.error("Error al obtener las cisternas:", error);
        throw error;
    }
}

export const getCisterna = async (id) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;
        // Asegúrate de que el token esté presente
        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const cisterna = await cisternasAPI.get(`/cisterna/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        //console.log("get cisterna: ", cisterna.data)
        return cisterna.data

    } catch (error) {
        console.error("Error al obtener la cisterna:", error);
        throw error;
    }
}

export const getCisternasIncidentes = async (id) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;
        // Asegúrate de que el token esté presente
        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await cisternasAPI.get(`/cisterna/${id}/incidentes_cisterna`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        
        const incidentes = response.data.map( (reg) => ({
            incidente_id: reg.id,
            titulo: reg.titulo,
            cisterna_id: reg.cisterna.id,
            nombre_cisterna: reg.cisterna.nombre_cisterna,
            estado_incidente: reg.estado_incidente.descripcion_operacion,
            fecha_incidente: reg.fecha_incidente,
            fecha_de_registro: reg.fecha_de_registro,
            gravedad: reg.gravedad.descripcion,
            tipo_incidente: reg.tipo_incidente.descripcion_tipo_incidente,
            descripcion: reg.descripcion,
            usuario: reg.usuario.alias
        }))

        // console.log(incidentes)
        // return response.data
        return incidentes

    } catch (error) {
        console.error("Error al obtener la cisterna:", error);
        throw error;
    }
}
///////////////////////////////// DELETE /////////////////////////////////
const deleteCisterna = async (id) => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await cisternasAPI.delete(`/cisterna/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        if (response) {
            console.log('Cisterna eliminada correctamente')
            return response.data
        }

    } catch (error) {
        console.log("Error al obtener las cisternas:", error);
        throw error;
    }
}

export const useDeleteCisterna = () => {
    const queryClient = useQueryClient()

    return useMutation(deleteCisterna, {
        onSuccess: () => {
            message.success('Cisterna eliminada correctamente');
            queryClient.invalidateQueries('cisternas');
        },
        onError: () => {
            message.error('Error al eliminar la cisterna');
        }
    })
}
///////////////////////////////// POST /////////////////////////////////
export const postCisterna = async (formValues) => {
    console.log(formValues)
    try {
        // Obtener el token de acceso
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        // Desestructurar los valores del formulario recibidos
        const { nombre_cisterna, tipo_elemento, latitud, longitud, estado, localidad } = formValues;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        // Realizar la solicitud POST a la API
        const response = await cisternasAPI.post('/cisterna/',
            {
                nombre_cisterna,
                tipo_elemento,
                latitud,
                longitud,
                estado,
                localidad
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}` // Incluir el token en los headers
                }
            }
        );

        // Verificar si la respuesta es exitosa
        if (response) {
            console.log('Cisterna creada exitosamente');
            return response.data; // Retornar los datos de la respuesta
        }

    } catch (error) {
        console.error('Error al crear la cisterna:', error);
        message.error('Error al crear la cisterna')
        throw error; // Lanzar el error para manejo externo
    }
};

export const usePostCisterna = () => {
    const queryClient = useQueryClient()

    return useMutation(postCisterna, {
        onSuccess: () => {
            message.success('Cisterna creada correctamente')
            queryClient.invalidateQueries('cisternas')
        },
        onError: () => {
            message.error('Error al crear la nueva cisterna')
        }
    })
}

///////////////////////////////// PUT /////////////////////////////////
const updateCisterna = async (id, formValues) => {
    //console.log("formValues de updateCisterna: ", formValues)
    //console.log("estado formValues de updateCisterna: ", formValues.estado)
    //console.log(formValues)

    try {
        console.log('id: ', id);
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        const { nombre_cisterna, tipo_elemento, latitud, longitud, estado, localidad } = formValues;
        const response = await cisternasAPI.put(`/cisterna/${id}/`,
            {
                nombre_cisterna,
                tipo_elemento,
                latitud,
                longitud,
                estado,
                localidad
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

        if (response) {
            console.log('Cisterna modificada exitosamente');
            return response.data; // Retornar los datos de la respuesta
        }
    } catch (error) {
        console.error('Error al modificar la cisterna:', error);
        throw error;
    }
};

export const usePutCisterna = () => {
    const queryClient = useQueryClient();

    return useMutation(
        ({ id, formValues }) => updateCisterna(id, formValues), // Aquí se pasa la función correctamente
        {
            onSuccess: () => {
                message.success('Cisterna modificada exitosamente');
                queryClient.invalidateQueries('cisternas');
            },
            onError: () => {
                message.error('Error al modificar la cisterna');
            }
        }
    );
};

///////////////////////////////// ADICIONALES /////////////////////////////////
export const getCisternasLikeOptions = async () => {
    const data = []
    const cisternas = await getCisternas()

    for(let reg of cisternas){
        data.push({
            value: reg.key,
            label: reg.nombre
        })
    }

    return data
}