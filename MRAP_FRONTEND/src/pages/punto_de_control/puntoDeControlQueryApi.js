import axios from 'axios'
import { message } from 'antd';
import { useUserStore } from '../../store/userStore'; // Asegúrate de importar tu store correctamente
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from "react";
import { getBombasLikeOptions } from "../bomba/bombaQueryAPI";
import { getBateriasLikeOptions } from "../bateria/bateriaQueryAPI";
import { getCisternasLikeOptions } from "../cisterna/cisternaQueryAPI";
import { getCopasLikeOptions } from "../copa/copaQueryAPI";
import { getPozosLikeOption } from "../pozo/pozoQueryApi";
import { getPuntosInternosLikeOptiones } from "../punto_interno/PuntoInternoQueryAPI";

const puntoDeControlAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/MRAP/'
})

///////////////////////////////// GET ALL /////////////////////////////////
export const getPuntosDeControl = async () => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken
        const data = []
        const data_response = []

        if (!accessToken) {
            throw new Error('Token no disponible')
        }

        const response = await puntoDeControlAPI.get('/punto_de_control/',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        const validKeys = await getTiposDeElementos()

        for (let registro of response.data) {
            const punto_de_control = {};

            for (let key in registro) {
                if (registro[key] != null) {
                    //console.log(key)
                    // trim elimina espacios y toLowerCase convierte la key a minuscula
                    //['punto interno', 'pozo', 'copa', 'cisterna', 'bateria', 'bomba'];
                    if (validKeys.includes(key.trim().toLowerCase())) {
                        punto_de_control['elemento'] = registro[key];
                    }
                    else if (key == 'punto_interno') {
                        punto_de_control['elemento'] = registro[key];
                    }
                    else {
                        punto_de_control[key] = registro[key];
                    }
                }
            }

            for (let atributo in punto_de_control['elemento']) {
                if (atributo !== 'id' && atributo !== 'tipo_elemento' && !atributo.startsWith('nombre')) {
                    delete punto_de_control['elemento'][atributo]; // Eliminar el atributo
                } else if (atributo.startsWith('nombre')) {
                    // Renombrar clave de 'nombreX' a 'nombre'
                    punto_de_control['elemento']['nombre'] = punto_de_control['elemento'][atributo];
                    delete punto_de_control['elemento'][atributo]; // Eliminar la clave original
                }
            }

            data.push(punto_de_control);
        }

        for (let reg of data) {
            const registro = {
                key: reg.id,
                estado: reg.estado.descripcion,
                nombre_punto_de_control: reg.nombre_punto_de_control,
                tipo_elemento: reg.elemento.tipo_elemento.nombre_tipo_de_elemento,
                elemento: (`#${reg.elemento.id} `) + reg.elemento.nombre,
                estado_retrasos: reg.estado_retrasos
            }
            data_response.push(registro)
        }

        return data_response

    } catch (error) {
        console.log('Error en getPuntosDeControl')
        console.log(error)
    }
}

export const getPuntosDeControlLikeOptions = async () => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken
        const data = []

        const response = await puntoDeControlAPI.get('/punto_de_control/',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        const validKeys = await getTiposDeElementos()
        // const validKeys = ['bomba', 'bateria', 'cisterna', 'copa', 'pozo', 'punto_interno', 'cisterna(e)', 'cisterna(s)', 'copa(e)', 'copa(s)']
        // console.log(validKeys)
        // console.log(response.data)
        for (let registro of response.data) {
            for (let tipo_elemento of validKeys) {
                if (registro[tipo_elemento] != null) {
                    data.push({
                        value: registro.id,
                        label: (`[#${registro.id}] ${registro.nombre_punto_de_control} (${tipo_elemento.split('_').join(' ')})`)
                    })
                }
            }
        }

        return data
    } catch (error) {
        console.log('Error en getPuntosDeControlLikeOptions')
        message.error('Error al obtener los puntos de control como opciones')
    }
}
///////////////////////////////// GET ONE /////////////////////////////////
export const getPuntoDeControl = async (id) => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await puntoDeControlAPI.get(`/punto_de_control/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        const punto_de_control = Object.entries(response.data)
            // Evaluo si para cada atributo corresponde un valor no nulo
            .filter(([key, valor]) => valor !== null)
            // Creo un objeto con los atributos con valores no nulos
            .reduce((registro, [key, valor]) => {
                registro[key] = valor
                return registro
            }, {}) // los {} indican que reduce debe retornar un objeto, sin ellos retornaria una lista
        //console.log(punto_de_control)

        const registro = {
            id: punto_de_control.id,
            nombre_punto_de_control: punto_de_control.nombre_punto_de_control,
            tipo_de_elemento: null,
            elemento: null,
            estado: null,
            estado_retrasos: punto_de_control.estado_retrasos
        }

        if (punto_de_control.pozo) {
            registro.tipo_de_elemento = punto_de_control.pozo.tipo_elemento.id
            registro.elemento = punto_de_control.pozo.id
            registro.estado = punto_de_control.pozo.estado.id
        }

        if (punto_de_control.bomba) {
            registro.tipo_de_elemento = punto_de_control.bomba.tipo_elemento.id
            registro.elemento = punto_de_control.bomba.id
            registro.estado = punto_de_control.estado.id
        }

        if (punto_de_control.bateria) {
            registro.tipo_de_elemento = punto_de_control.bateria.tipo_elemento.id
            registro.elemento = punto_de_control.bateria.id
            registro.estado = punto_de_control.estado.id
        }

        if (punto_de_control.cisterna) {
            registro.tipo_de_elemento = punto_de_control.cisterna.tipo_elemento.id
            registro.elemento = punto_de_control.cisterna.id
            registro.estado = punto_de_control.cisterna.estado.id
        }

        if (punto_de_control.copa) {
            registro.tipo_de_elemento = punto_de_control.copa.tipo_elemento.id
            registro.elemento = punto_de_control.copa.id
            registro.estado = punto_de_control.estado.id
        }

        if (punto_de_control.punto_interno) {
            registro.tipo_de_elemento = punto_de_control.punto_interno.tipo_elemento.id
            registro.elemento = punto_de_control.punto_interno.id
            registro.estado = punto_de_control.punto_interno.estado.id
        }

        //console.log('registro: ', registro)

        return registro

    } catch (error) {
        console.log('Error en getPuntoDeControl')
        console.log(error)
    }
}

///////////////////////////////// POST /////////////////////////////////
const postPuntoDeControl = async (data) => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken) {
            throw new Error('Token no disponible')
        }

        const { estado, nombre_punto_de_control, elemento, tipo_de_elemento, estado_retrasos } = data

        const nuevo_registro = {
            pozo: null,
            copa: null,
            cisterna: null,
            bateria: null,
            bomba: null,
            punto_interno: null,
            estado: estado,
            nombre_punto_de_control: nombre_punto_de_control,
            estado_retrasos: estado_retrasos
        }

        // BOMBA
        if (tipo_de_elemento === 1)
            nuevo_registro['bomba'] = elemento
        // BATERIA
        else if (tipo_de_elemento === 2)
            nuevo_registro['bateria'] = elemento
        // CISTERNA
        else if (tipo_de_elemento === 3)
            nuevo_registro['cisterna'] = elemento
        // COPA
        else if (tipo_de_elemento === 4)
            nuevo_registro['copa'] = elemento
        // POZO
        else if (tipo_de_elemento === 5)
            nuevo_registro['pozo'] = elemento
        // PUNTO INTERNO
        else if (tipo_de_elemento === 6)
            nuevo_registro['punto_interno'] = elemento

        const response = await puntoDeControlAPI.post('/punto_de_control/',
            nuevo_registro, // Enviar el objeto completo
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );


        return response.data

    } catch (error) {
        console.log('error en postPuntoDeControl')
        throw new Error(error)
    }
}

export const usePostPuntoDeControl = () => {
    const queryClient = useQueryClient()

    return useMutation(postPuntoDeControl,
        {
            onSuccess: () => {
                queryClient.invalidateQueries('puntos_de_control')
                message.success('Punto de control registrado')
            },
            onError: () => {
                message.error('Error al registrar el nuevo punto de control')
            }
        }
    )
}

///////////////////////////////// DELETE /////////////////////////////////
const deletePuntoDeControl = async (id) => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken) {
            throw new Error('Token de acceso no disponible')
        }

        const response = await puntoDeControlAPI.delete(`/punto_de_control/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return response.data

    } catch (error) {
        console.log('Error en deletePuntoDeControl')
        console.log(error)
    }
}

export const useDeletePuntoDeControl = () => {
    const queryClient = useQueryClient()

    return useMutation(deletePuntoDeControl,
        {
            onSuccess: () => {
                queryClient.invalidateQueries('puntos_de_control')
                message.success('Punto de control eliminado')
            },
            onError: () => {
                message.error('Error al eliminar el punto de control')
            }
        }
    )
}

///////////////////////////////// PUT /////////////////////////////////
const putPuntoDeControl = async (formValues) => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken) {
            throw new Error('Token de acceso no disponible')
        }

        const { id, data } = formValues

        const {
            elemento,
            estado,
            estado_retrasos,
            nombre_punto_de_control,
            tipo_de_elemento
        } = data

        const payload = {
            pozo: null,
            copa: null,
            cisterna: null,
            bateria: null,
            bomba: null,
            punto_interno: null,
            estado: estado,
            nombre_punto_de_control: nombre_punto_de_control,
            estado_retrasos: estado_retrasos
        }

        switch (tipo_de_elemento) {
            case 1:
                payload.bomba = elemento;
                break;
            case 2:
                payload.bateria = elemento;
                break;
            case 3:
                payload.cisterna = elemento;
                break;
            case 4:
                payload.copa = elemento;
                break;
            case 5:
                payload.pozo = elemento;
                break;
            case 6:
                payload.punto_interno = elemento;
                break;
            default:
                throw new Error(`Tipo de elemento ${tipo_de_elemento} no reconocido`);
        }

        console.log(payload)

        const response = await puntoDeControlAPI.put(`/punto_de_control/${id}/`, payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        return response.data

    } catch (error) {
        console.log('Error en putPuntoDeControl')
        throw new Error(error)
    }
}

export const usePutPuntoDeControl = () => {
    const queryClient = useQueryClient()

    return useMutation(
        (formValues) => putPuntoDeControl(formValues),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('puntos_de_control')
                message.success('Punto de control modificado')
            },
            onError: () => {
                message.error('Error al modificar el punto de control')
            }
        }
    )
}

///////////////////////////////// ADICIONALES /////////////////////////////////
const getTiposDeElementos = async () => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken
        const data = []

        if (!accessToken) {
            throw new Error('Token de acceso no disponible')
        }

        const response = await axios.get('http://127.0.0.1:8000/MRAP/tipo_de_elemento/', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        for (let tipo_elemento of response.data) {
            data.push(tipo_elemento.nombre_tipo_de_elemento.toLowerCase())
        }
        // console.log(data)
        return data

    } catch (error) {
        console.log('Error en getTiposDeElementos')
        console.log(error)
    }
}

export const getTiposDeElementosLikeOptions = async () => {
    try {
        const { userInfo } = useUserStore.getState()
        const accessToken = userInfo.accessToken

        if (!accessToken) {
            throw new Error('Token de acceso no disponible')
        }

        const data = []

        const response = await axios.get('http://127.0.0.1:8000/MRAP/tipo_de_elemento/',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        for (let reg of response.data) {
            data.push(
                {
                    value: reg.id,
                    label: reg.nombre_tipo_de_elemento
                }
            )
        }

        return data

    } catch (error) {
        console.log('Error en getTiposDeElementosLikeOptions')
        console.log(error)
    }
}

export const getElementos = async (tipo_elemento_id) => {
    //BOMBAS
    if (tipo_elemento_id == 1) {
        const bombas = await getBombasLikeOptions()
        return bombas
    }
    // BATERIAS
    else if (tipo_elemento_id == 2)
        return (await getBateriasLikeOptions())
    // CISTERNAS
    else if (tipo_elemento_id == 3)
        return (await getCisternasLikeOptions())
    // COPAS
    else if (tipo_elemento_id == 4)
        return (await getCopasLikeOptions())
    // POZOS
    else if (tipo_elemento_id == 5)
        return (await getPozosLikeOption())
    // PUNTOS INTERNOS
    else if (tipo_elemento_id == 6)
        return (await getPuntosInternosLikeOptiones())
}
