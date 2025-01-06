import axios from 'axios';
import { message } from 'antd';
import { useUserStore } from '../../store/userStore'; // Asegúrate de importar tu store correctamente
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnalisisById } from '../analisis/analisisQueryAPI';

const controlAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/MRAP/' // Cambia la base URL según sea necesario
});

const tipo_elemento_API = axios.create({
    baseURL: 'http://127.0.0.1:8000/MRAP/'
})

// Función auxiliar para obtener el token de acceso
const getAccessToken = () => {
    const { userInfo } = useUserStore.getState();
    const accessToken = userInfo?.accessToken;
    if (!accessToken) {
        throw new Error("Token de acceso no disponible");
    }
    return accessToken;
};

///////////////////////////////// GET ALL /////////////////////////////////
export const obtener_tipo_elemento = (punto_de_control) => {
    const tipo_de_elemento = ['bateria', 'bomba', 'cisterna', 'copa', 'pozo', 'punto_interno']

    for (let elemento of tipo_de_elemento) {
        if (punto_de_control[elemento] != null)
            return elemento
    }
    return '-'
}

export const getControles = async (currentPage = 1) => {
    try {
        const accessToken = getAccessToken();

        const response = await controlAPI.get(`/control/control/?page=${currentPage}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const pages = { pages: Math.ceil(response.data.count) }
        
        const resultados = response.data.results.map(reg => {
            const tipo_elemento = obtener_tipo_elemento(reg.punto_de_control)
            return {
                key: reg.id,
                aprobado: reg.aprobado,
                tipo_control: reg.tipo_control,
                nombre_punto_de_control: reg.punto_de_control.nombre_punto_de_control,

                tipo_elemento: tipo_elemento,

                usuario: reg.usuario,
                fecha: reg.fecha,
                proveedor: reg.proveedor,
                analisis: reg.analisis,
            }
        })

        console.log({
            pages: pages.pages,
            resultados: resultados
        })
        
        return {
            pages,
            resultados
        }

    } catch (error) {
        console.log('Error en getControles:', error);
        message.error('Error al obtener controles: ' + error.message);
    }
};

export const getParametrosAnalisis = async (id) => {
    try {
        const accessToken = getAccessToken();

        const response = await axios.get(`http://127.0.0.1:8000/MRAP/analisis/${id}/parametros_asociados/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        return response.data

    } catch (error) {
        console.log('Error en getParametrosAnalisis')
        message.error(`Error al obtener los parametros asociados al analisis ${id}`)
    }
}

export const getTiposControlesLikeOptions = async () => {
    try {
        const accessToken = getAccessToken()

        const response = await controlAPI.get('/control/tipo_control', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        const data = response.data.map(reg => ({
            value: reg.id,
            label: reg.tipo_control
        }))

        return data
    } catch (error) {
        console.log('Erroe en getTiposControlesLikeOptions')
        message.error('Error al obtener los tipos de controles')
    }
}

///////////////////////////////// GET ONE /////////////////////////////////
export const getControl = async (id) => {
    try {
        const accessToken = getAccessToken();

        const response = await controlAPI.get(`/control/get/${id}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.log('Error en getControl:', error);
        message.error('Error al obtener el control ' + error.message);
    }
};

export const getParametrosAnalisisByID = async (id) => {
    analisis = await getAnalisisById(id)
    return response.data
}

export const getTipoControlLikeOptions = async () => {
    try {
        const accessToken = getAccessToken()

        const response = await controlAPI.get('/control/tipo_control/', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        const data = response.data.map(reg => ({
            value: reg.id,
            label: reg.tipo_control
        }))

        console.log(data)
        return data

    } catch (error) {
        console.log('Error en getTipoControlLikeOptions')
        message.error('Error al obtener los tipos de controles')
    }
}

///////////////////////////////// POST /////////////////////////////////
export const postControl = async ({ data_control, data_inputs }) => {
    try {
        // console.log(data_control.punto_de_control)
        const accessToken = getAccessToken();
        if (!accessToken) {
            console.error('Access token no disponible.');
            message.error('No se puede realizar la solicitud sin un token válido.');
            return;
        }

        const { punto_de_control, fecha, proveedor, analisis, aprobado, usuario, tipo_control } = data_control;
        const parametros = []

        const parametros_ids = Object.keys(data_inputs)
            .filter(key => key.startsWith('parametro'))
            .map(key => key.match(/\d+/g)?.[0])
            .filter(Boolean);

        for (let parametro of parametros_ids) {
            parametros.push({
                analisis: analisis,
                parametro: Number(parametro),
                tipo_control: data_inputs.tipo_control,
                valor: data_inputs[`parametro_${parametro}`]
            })
        }

        let payload = {}

        const responses = [];
        if (punto_de_control.lenght > 1) {
            for (let punto of punto_de_control) {
                payload = {
                    control: {
                        aprobado: aprobado,
                        punto_de_control: punto.id,
                        usuario: usuario,
                        fecha: fecha,
                        proveedor: proveedor,
                        analisis: analisis,
                        tipo_control: tipo_control
                    },
                    valores_control: parametros
                }

                const response = await controlAPI.post('/control/post/', payload, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })

                responses.push(response.data);
            }
            return responses;
        }

        payload = {
            control: {
                aprobado: aprobado,
                punto_de_control: punto_de_control,
                usuario: usuario,
                fecha: fecha,
                proveedor: proveedor,
                analisis: analisis,
                tipo_control: tipo_control
            },
            valores_control: parametros
        }

        const response = await controlAPI.post('/control/post/', payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        return response.data
    } catch (error) {
        console.log('Error en postControl', error);
        message.error('Hubo un error al procesar el control.');
    }
};

export const usePostControl = () => {
    const queryClient = useQueryClient()

    return useMutation(
        (data) => postControl(data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries()
                message.success('Control creado')
            },
            onError: () => {
                message.error('Error al crear el control')
            }
        }
    )
}

///////////////////////////////// PUT /////////////////////////////////
const putControl = async ({ id, data_control, data_inputs }) => {
    try {
        // console.log(data_control)
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken) {
            console.error('Access token no disponible.');
            message.error('No se puede realizar la solicitud sin un token válido.');
            return;
        }

        const parametros = []

        const parametros_ids = Object.keys(data_inputs)
            .filter(key => key.startsWith('parametro'))
            .map(key => key.match(/\d+/g)?.[0])
            .filter(Boolean);

        for (let parametro of parametros_ids) {
            parametros.push({
                control: id,
                analisis: data_control.analisis,
                parametro: Number(parametro),
                tipo_control: data_inputs.tipo_control,
                valor: data_inputs[`parametro_${parametro}`]
            })
        }

        const payload_control = {
            control: {
                id: id,
                aprobado: data_control.aprobado,
                punto_de_control: data_control.punto_de_control,
                usuario: data_control.usuario,
                fecha: data_control.fecha,
                proveedor: data_control.proveedor,
                analisis: data_control.analisis,
                tipo_control: data_control.tipo_control
            },
            valores_control: parametros
        }

        const response = await controlAPI.put(`/control/put/${id}/`, payload_control, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        console.log(payload_control)
        return response.data
    }
    catch (error) {
        console.log('Error en putControl', error)
        message.error('Error al procesar el control')
    }
}

export const usePutControl = () => {
    const queryClient = useQueryClient()

    return useMutation(
        (data) => putControl(data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('controles')
                message.success('Control modificado')
            },
            onError: () => {
                message.error('Error al modificar el control')
            }
        }
    )
}
///////////////////////////////// DELETE /////////////////////////////////
const deleteControl = async (id) => {
    try {
        console.log(`id del contorl ${id}`)

        const accessToken = getAccessToken();

        const response = await controlAPI.delete(`/control/control/${id}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return id;
    } catch (error) {
        console.log('Error en deleteControl:', error);
        message.error('Error al eliminar el control: ' + error.message);
        throw error
    }
};

export const useDeleteControl = () => {
    const queryClient = useQueryClient();

    return useMutation(deleteControl, {
        onSuccess: (id) => {
            queryClient.invalidateQueries(['control_a_editar', null])
            queryClient.removeQueries('controles')
            queryClient.invalidateQueries('controles');
            message.success('Control eliminado');
        },
        onError: (error) => {
            message.error('Error al eliminar el control: ' + error.message);
        }
    });
};