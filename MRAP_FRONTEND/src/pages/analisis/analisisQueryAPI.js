import axios from 'axios';
import { message } from 'antd';
import { useUserStore } from '../../store/userStore'; // Asegúrate de importar tu store correctamente
import { useQueryClient, useMutation } from '@tanstack/react-query';

// Configuración de la API
const analisisAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/MRAP/' // Cambia la base URL según sea necesario
});

// Función auxiliar para obtener el token de acceso
const getAccessToken = () => {
    const { userInfo } = useUserStore.getState();
    const accessToken = userInfo?.accessToken;
    if (!accessToken) {
        throw new Error("Token de acceso no disponible");
    }
    return accessToken;
};

// Función para obtener todos los análisis
export const getAnalisis = async () => {
    try {
        const accessToken = getAccessToken();

        const response = await analisisAPI.get('/analisis/analisis/', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response?.data) {
            const data = response.data.map(reg => ({
                key: reg.id,
                nombre: reg.nombre,
                tipo_control: reg.tipo_control.tipo_control
            }));
            return data;
        }
    } catch (error) {
        console.log('Error en getAnalisis:', error);
        message.error('Error al obtener los análisis: ' + error.message);
    }
};

export const getAnalisisLikeOptions = async (controlId) => {
    try {
        const accessToken = getAccessToken();

        const response = await analisisAPI.get(`/analisis/control/${controlId}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const data = response.data.map(reg => ({
            value: reg.id,
            label: reg.nombre
        }))

        return data
    } catch (error) {
        console.log('Error en getAnalisisLikeOptions:');
        message.error('Error al obtener los análisis como opciones');
    }
}

// Función para obtener un análisis específico
export const getAnalisisById = async (id) => {
    try {
        const accessToken = getAccessToken();
        const response = await analisisAPI.get(`/analisis/analisis/${id}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.log('Error en getAnalisisById:', error);
        message.error('Error al obtener el análisis: ' + error.message);
    }
};

// Función para crear un nuevo análisis
const postAnalisis = async (data) => {
    try {
        const accessToken = getAccessToken();

        const { nombre, parametros, tipo_control } = data

        const payload = {
            nombre: nombre,
            parametros: parametros,
            tipo_control: tipo_control
        }

        const response = await analisisAPI.post('/analisis/analisis/', payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;
    } catch (error) {
        console.log('Error en postAnalisis:', error.response.data);
        message.error('Error al registrar el análisis: ' + error.message);
    }
};

// Hook para crear un nuevo análisis
export const usePostAnalisis = () => {
    const queryClient = useQueryClient();

    return useMutation(postAnalisis, {
        onSuccess: () => {
            queryClient.invalidateQueries('analisis');
            message.success('Análisis registrado con éxito');
        },
        onError: (error) => {
            message.error('Error al registrar el nuevo análisis: ' + error.message);
        }
    });
};

// Función para actualizar un análisis existente
const putAnalisis = async (formValues) => {
    try {
        const accessToken = getAccessToken()

        const { id, data } = formValues

        console.log('id:', id)
        console.log('data:', data)

        const response = await analisisAPI.put(`/analisis/analisis/${id}/`,
            {
                nombre: data.nombre,
                parametros: data.parametros,
                tipo_control: data.tipo_control
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        return response.data;
    } catch (error) {
        console.log('Error en putAnalisis:', error);
        message.error('Error al actualizar el análisis: ' + error.message);
    }
};

// Hook para actualizar un análisis existente
export const usePutAnalisis = () => {
    const queryClient = useQueryClient();

    return useMutation((formValues) => putAnalisis(formValues), {
        onSuccess: () => {
            queryClient.invalidateQueries('analisis');
            message.success('Análisis actualizado con éxito');
        },
        onError: (error) => {
            message.error('Error al actualizar el análisis: ' + error.message);
        }
    });
};

// Función para eliminar un análisis
const deleteAnalisis = async (id) => {
    try {
        const accessToken = getAccessToken();
        const response = await analisisAPI.delete(`/analisis/analisis/${id}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response;
    } catch (error) {
        console.log('Error en deleteAnalisis:', error);
        message.error('Error al eliminar el análisis: ' + error.message);
    }
};

// Hook para eliminar un análisis
export const useDeleteAnalisis = () => {
    const queryClient = useQueryClient();

    return useMutation(deleteAnalisis, {
        onSuccess: () => {
            queryClient.invalidateQueries('analisis');
            queryClient.invalidateQueries('periodicidades_analisis');
            message.success('Análisis eliminado con éxito');
        },
        onError: (error) => {
            message.error('Error al eliminar el análisis: ' + error.message);
        }
    });
};

export const parametrosAsignadosForTransfer = async (id) => {
    try {
        const accessToken = getAccessToken();
        const response = await analisisAPI.get(`/analisis/${id}/parametros_sin_asignar/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const parametros_sin_asociar = response.data.parametros_sin_asociar.map((reg) => ({
            key: reg.id,
            title: `(${reg.parametro_codigo}) ${reg.nombre_parametro}`,
            description: `(${reg.parametro_codigo}) ${reg.nombre_parametro}`,
        }));

        const parametros_asociados = response.data.parametros_asociados.map((reg) => ({
            key: reg.id, // Solo necesita "key"
        }));

        const parametros_totales = [
            ...parametros_sin_asociar,
            ...response.data.parametros_asociados.map((reg) => ({
                key: reg.id,
                title: `(${reg.parametro_codigo}) ${reg.nombre_parametro}`,
                description: `(${reg.parametro_codigo}) ${reg.nombre_parametro}`,
            })),
        ];

        const data = {
            id: response.data.analisis.id,
            nombre: response.data.analisis.nombre,
            parametros_totales,
            parametros_asociados: parametros_asociados.map((p) => p.key), // Solo las claves
        };

        return data;
    } catch (error) {
        console.error('Error en parametrosAsignados:', error);
        message.error('Error al obtener los parámetros asignados: ' + error.message);
    }
};

export const getPeriodosAnalisisElementos = async () => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken)
            throw new Error('Token de acceso no disponible')

        const response = await analisisAPI.get(`/analisis/periodos_analisis/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const data = response.data.map(reg => {
            return {
                key: reg.id,
                tipo_elemento: reg.tipo_elemento.nombre_tipo_de_elemento,
                analisisId: reg.analisis.id,
                analisis: reg.analisis.nombre,
                periodicidad: `(${reg.periodo.periodicidad_codigo}) ${reg.periodo.periodicidad_nombre}`
            }
        })

        return data;
    } catch (error) {
        console.log('Error en getPeriodosAnalisisElementos:', error);
        message.error('Error al obtener los periodos de los elementos correspondientes a los analisis: ' + error.message);
    }
}

export const getPeriodoAnalisisElemento = async (id) => {
    const accessToken = getAccessToken();

    const response = await analisisAPI.get(`/analisis/periodos_analisis/${id}/`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    return response.data
}

const postAnalisisPeriodicidad = async (data) => {
    const accessToken = getAccessToken();

    const { analisis, tipo_elemento, periodo } = data

    const response = await analisisAPI.post('/analisis/periodos_analisis/', data, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    return response.data
}

export const usePostAnalisisPeriodicidad = () => {
    const queryClient = useQueryClient()

    return useMutation(postAnalisisPeriodicidad, {
        onSuccess: () => {
            queryClient.invalidateQueries('periodicidades_analisis')
            queryClient.invalidateQueries('analisis')
            message.success('Periodicidad de analisis registrada')
        },
        onError: () => {
            message.error('Error al registrar la periodicidad del analisis')
        }
    })
}

const deleteAnalisisPeriodicidad = async (id) => {
    const accessToken = getAccessToken();

    const response = await analisisAPI.delete(`/analisis/periodos_analisis/${id}/`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    return response.data
}

export const useDeleteAnalisisPeriodicidad = () => {
    const queryClient = useQueryClient()

    return useMutation(deleteAnalisisPeriodicidad, {
        onSuccess: () => {
            queryClient.invalidateQueries('periodicidades_analisis')
            message.success('Periodicidad de analisis eliminada')
        },
        onError: () => {
            message.success('Error al eliminar la periodicidad del analisis')
        }
    })
}

const putPeriodoAnalsisElemento = async (formValues) => {
    const accessToken = getAccessToken();
    const { tipo_elemento, analisis, periodo, id } = formValues

    const payload = {
        tipo_elemento: tipo_elemento,
        analisis: analisis,
        periodo: periodo
    }

    // console.log('payload', payload)

    const response = await analisisAPI.put(`/analisis/periodos_analisis/${id}/`, payload, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    return response.data
}

export const usePutPeriodoAnalsisElemento = () => {
    const queryClient = useQueryClient();

    return useMutation((formValues) => putPeriodoAnalsisElemento(formValues), {
        onSuccess: () => {
            queryClient.invalidateQueries('periodicidades_analisis');

            message.success('Periodicidad de analisis actualizada');
        },
        onError: (error) => {
            message.error('Error al modificar la periodicidad del analisis: ' + error.message);
        }
    });
};