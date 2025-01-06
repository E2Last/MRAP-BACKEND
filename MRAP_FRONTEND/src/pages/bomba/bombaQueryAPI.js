import axios from 'axios'
import { message } from 'antd';
import { useUserStore } from '../../store/userStore'; // Asegúrate de importar tu store correctamente
import { useMutation, useQueryClient } from '@tanstack/react-query';

const bombaAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/MRAP/'
})

///////////////////////////////// GET ALL /////////////////////////////////
export const getBombas = async () => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        // Asegúrate de que el token esté presente
        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await bombaAPI.get('/bomba/',
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
                    nombre_bomba: reg.nombre_bomba,
                    tipo_elemento: reg.tipo_elemento.nombre_tipo_de_elemento
                }
                data.push(registro)
            }
            // BORRAR
            //console.log('data bombas: ', data)

            return data
        }

    } catch (error) {
        throw error
    }
}

///////////////////////////////// GET ONE /////////////////////////////////
export const getBomba = async (id) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const bomba = await bombaAPI.get(`/bomba/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return bomba.data

    } catch (error) {
        console.log('Error en getBomba')
    }
}

/////////////////////////////////// GET USOS DE BOMBA /////////////////////////////////

export const getUsosBomba = async (id) => {
    try {
        const { userInfo } = useUserStore.getState(); // Suponiendo que usas este método para manejar autenticación
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await bombaAPI.get(`/bomba/${id}/usos_registrados/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data; // Aquí se devuelve el JSON de respuesta
    } catch (error) {
        console.error("Error en getUsosBomba:", error);
        throw error;
    }
};


///////////////////////////////// DELETE /////////////////////////////////
const deleteBomba = async (id) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await bombaAPI.delete(`/bomba/${id}/`,
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
        console.log('Error al eliminar bomba en deleteBomba')
        throw (error)
    }
}

export const useDeleteBomba = () => {
    const queryClient = useQueryClient()

    return useMutation(deleteBomba,
        {
            onSuccess: () => {
                message.success('Bomba eliminada correctamente')
                queryClient.invalidateQueries('bombas')
            },
            onError: () => {
                message.error('Error al eliminar la bomba')
            }
        }
    )
}

///////////////////////////////// POST /////////////////////////////////
const postBomba = async (formValues) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const { nombre_bomba, estado, tipo_elemento } = formValues

        const response = await bombaAPI.post('/bomba/',
            {
                estado,
                nombre_bomba,
                tipo_elemento
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response.data

    } catch (error) {
        console.log('Error de post de la bomba en postBomba')
    }
}

export const usePostBomba = () => {
    const queryClient = useQueryClient()

    return useMutation(postBomba,
        {
            onSuccess: () => {
                message.success('Nueva bomba registrada con exito')
                queryClient.invalidateQueries('bombas')
            },
            onError: () => {
                message.error('Error al registrar la nueva bomba')
            }
        }
    )
}

///////////////////////////////// PUT /////////////////////////////////
const putBomba = async (id, formValues) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const { nombre_bomba, tipo_elemento, estado } = formValues

        const response = await bombaAPI.put(`/bomba/${id}/`,
            {
                estado,
                nombre_bomba,
                tipo_elemento
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response.data

    } catch (error) {
        console.log('Error en putBomba')
    }
}

export const usePutBomba = () => {
    const queryClient = useQueryClient()

    return useMutation(
        ({ id, formValues }) => putBomba(id, formValues),
        {
            onSuccess: () => {
                message.success('RegisTro de la bomba modificado correctamente')
                queryClient.invalidateQueries('bombas')
            },
            onError: () => {
                message.error('Error al modificar el registro de la bomba')
            }
        }
    )
}

///////////////////////////////// ADICIONALES /////////////////////////////////
export const getBombasLikeOptions = async () => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if(!accessToken) {
            throw new Error('Token de acceso no disponible')
        }

        const data = []

        const response = await bombaAPI.get('/bomba/',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        for(let reg of response.data) {
            data.push(
                {
                    value: reg.id,
                    label: reg.nombre_bomba
                }
            )
        }

        return data

    } catch (error) {
        console.log('Error en getBombasLikeOptions')
        console.log(error)
    }
}


//////////////////////////////// USOS BOMBA ///////////////////////////////////////////

const postBombaUso = async (formValues) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const { bomba, fecha_de_uso, horas_de_uso } = formValues;

        const response = await bombaAPI.post('/bomba_usos/', 
            {
                bomba,
                fecha_de_uso,
                horas_de_uso
            }, 
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        return response.data;

    } catch (error) {
        console.log('Error en postBombaUso:', error);
        throw error;
    }
};

export const usePostBombaUso = () => {
    const queryClient = useQueryClient();

    return useMutation(postBombaUso, {
        onSuccess: () => {
            message.success('Uso registrado correctamente');
            queryClient.invalidateQueries('bombas'); // Actualiza las bombas si es necesario
        },
        onError: () => {
            message.error('Error al registrar el uso de la bomba');
        }
    });
};
