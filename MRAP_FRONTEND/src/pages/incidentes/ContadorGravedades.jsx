import { useState } from 'react';
import axios from 'axios';
import { useUserStore } from '../../store/userStore';

// Configuración de la API
const incidentesAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/MRAP/',
});

const ContadorGravedades = () => {

};

// Función para identificar el nombre del elemento
const identificarElemento = (elemento) => {
    // (El código de identificación de elementos sigue igual)
};

// Función para obtener y contar las gravedades de los incidentes
export const getIncidentesConContador = async () => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) throw new Error('Token de acceso no disponible');

        const response = await incidentesAPI.get('/incidente/', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = response.data.map((reg) => ({
            key: reg.id,
            titulo: reg.titulo,
            elemento_id: reg.elemento.id,
            elemento_nombre: identificarElemento(reg.elemento),
            tipo_elemento: reg.elemento.tipo_elemento.nombre_tipo_de_elemento,
            elemento_inhabilitado: reg.tipo_incidente.inhabilitar_elemento,
            estado_incidente: reg.estado_incidente.descripcion_operacion,
            fecha_incidente: reg.fecha_incidente,
            fecha_de_registro: reg.fecha_de_registro,
            gravedad: reg.gravedad.descripcion,
            tipo_incidente: reg.tipo_incidente.descripcion_tipo_incidente,
            descripcion: reg.descripcion || null,
        }));

        // Contar la cantidad de incidentes por gravedad
        const ContadorGravedades = {
            Alta: 0,
            Media: 0,
            Baja: 0,
        };

        data.forEach((incidente) => {
            if (incidente.gravedad === 'Alta') {
                ContadorGravedades.Alta += 1;
            } else if (incidente.gravedad === 'Media') {
                ContadorGravedades.Media += 1;
            } else if (incidente.gravedad === 'Baja') {
                ContadorGravedades.Baja += 1;
            }
        });

        // Retornar los datos junto con el contador
        return { data, ContadorGravedades };

    } catch (error) {
        console.error('Error en getIncidentesConContador:', error);
        throw new Error(error);
    }
};

// Al final de ContadorGravedades.jsx
export default ContadorGravedades;
