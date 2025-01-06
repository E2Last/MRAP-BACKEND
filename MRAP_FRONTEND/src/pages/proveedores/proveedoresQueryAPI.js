import axios from 'axios';
import { message } from 'antd';
import { useUserStore } from '../../store/userStore'; // Asegúrate de importar tu store correctamente
import { useMutation, useQueryClient } from '@tanstack/react-query';

const proveedorAPI = axios.create({
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



///////////////////////////////// GET ALL /////////////////////////////////
export const getProveedores = async () => {
    try {
        const accessToken = getAccessToken();

        const response = await proveedorAPI.get('/proveedor/', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response?.data) {
            return response.data.map(reg => ({
                key: reg.id,
                codigo_proveedor: reg.codigo_proveedor,
                nombre_proveedor: reg.nombre_proveedor,
            }));
        }
    } catch (error) {
        console.log('Error en getProveedores:', error);
        message.error('Error al obtener proveedores: ' + error.message);
    }
};

export const getProveedoresLikeOptions = async () => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo?.accessToken;
        
        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await proveedorAPI.get('/proveedor/', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const data = response.data.map(reg=> ({
            value: reg.id,
            label: `(${reg.codigo_proveedor}) ${reg.nombre_proveedor}`
        }))

        return data
    } catch (error) {
        console.log('Error en getProveedoresLikeOptions')
        message.error('Error al obtener los proveedores como opciones')
    }
}

///////////////////////////////// GET ONE /////////////////////////////////
export const getProveedor = async (id) => {
    try {
        const accessToken = getAccessToken();

        const response = await proveedorAPI.get(`/proveedor/${id}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;
    } catch (error) {
        console.log('Error en getProveedor:', error);
        message.error('Error al obtener el proveedor: ' + error.message);
    }
};

///////////////////////////////// POST /////////////////////////////////
const postProveedor = async (formValues) => {
    try {
        const accessToken = getAccessToken();

        const { codigo_proveedor, nombre_proveedor } = formValues;

        const response = await proveedorAPI.post('/proveedor/', {
            codigo_proveedor,
            nombre_proveedor
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        console.log('respuesta: ', response.data);
        return response.data;
    } catch (error) {
        console.log('Error en postProveedor:', error);
        message.error('Error al registrar el proveedor: ' + error.message);
    }
};

export const usePostProveedor = () => {
    const queryClient = useQueryClient();

    return useMutation(postProveedor, {
        onSuccess: () => {
            queryClient.invalidateQueries('proveedores');
            message.success('Proveedor registrado');
        },
        onError: (error) => {
            message.error('Error al registrar el nuevo proveedor: ' + error.message);
        }
    });
};

///////////////////////////////// PUT /////////////////////////////////
const putProveedor = async (id, formValues) => {
    try {
        console.log('formValues prueba:', formValues);
        const accessToken = getAccessToken();

        // Asegúrate de que el objeto que envías tenga las propiedades correctas
        const { codigo_proveedor, nombre_proveedor } = formValues;

        const response = await proveedorAPI.put(`/proveedor/${id}/`, {
            codigo_proveedor,
            nombre_proveedor
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;
    } catch (error) {
        console.log('Error en put Proveedor:', error);
        message.error('Error al actualizar el proveedor: ' + error.message);
    }
};

// En proveedoresQueryAPI.js
export const usePutProveedor = () => {
    return useMutation(async ({ id, formValues }) => {
        const accessToken = getAccessToken();
        const { codigo_proveedor, nombre_proveedor } = formValues;

        const response = await proveedorAPI.put(`/proveedor/${id}/`,
            { codigo_proveedor, nombre_proveedor },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        return response.data;
    });
};



///////////////////////////////// DELETE /////////////////////////////////
const deleteProveedor = async (id) => {
    try {
        const accessToken = getAccessToken();

        const response = await proveedorAPI.delete(`/proveedor/${id}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response; // No es necesario devolver response.data
    } catch (error) {
        console.log('Error en deleteProveedor:', error);
        message.error('Error al eliminar el proveedor: ' + error.message);
    }
};

export const useDeleteProveedor = () => {
    const queryClient = useQueryClient();

    return useMutation(deleteProveedor, {
        onSuccess: () => {
            message.success('Proveedor eliminado');
            queryClient.invalidateQueries('proveedores');
        },
        onError: (error) => {
            message.error('Error al eliminar el proveedor: ' + error.message);
        }
    });
};
