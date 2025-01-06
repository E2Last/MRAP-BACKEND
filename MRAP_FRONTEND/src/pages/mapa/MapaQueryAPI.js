// ELEMENTOS
import { message } from 'antd';
import { getCisternas } from '../cisterna/cisternaQueryAPI';
import { getCopas } from '../copa/copaQueryAPI';
import { getPozos } from '../pozo/pozoQueryApi'
import { getBaterias } from '../bateria/bateriaQueryAPI';
import { getPuntosInternos } from '../punto_interno/PuntoInternoQueryAPI';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

///////////////////////////////// CISTERNAS /////////////////////////////////
export const getPosicionesCisternas = async () => {
    const data = await getCisternas()
    const cisternas = []

    try {
        for (let reg of data) {
            cisternas.push(
                {
                    id: reg.key,
                    nombre: reg.nombre,
                    tipo_elemento: reg.tipo_elemento,
                    latitud: reg.latitud,
                    longitud: reg.longitud,
                    mostrar: true
                }
            )
        }

        return cisternas

    } catch (error) {
        console.log('Error en getPosicionesCisternas')
        throw new Error(error)
    }
}

const ocultarCisternas = (cisternas) => {
    cisternas.map(cisterna => {
        cisterna.mostrar ? cisterna.mostrar = false : cisterna.mostrar = true
    })

    return cisternas
}

export const useShowCisternas = () => {
    const queryClient = useQueryClient()

    return useMutation(ocultarCisternas, {
        onSuccess: (cisternas) => {
            //console.log(cisternas)
            queryClient.setQueryData(['cisternas'], cisternas)
        }
    })
}

///////////////////////////////// COPAS /////////////////////////////////
export const getPosicionesCopas = async () => {
    const data = await getCopas()
    const copas = []

    try {
        for (let reg of data) {
            copas.push(
                {
                    id: reg.key,
                    nombre: reg.nombre_copa,
                    tipo_elemento: reg.tipo_elemento,
                    latitud: reg.latitud,
                    longitud: reg.longitud,
                    mostrar: true
                }
            )
        }

        return copas

    } catch (error) {
        console.log('Error en getPosicionesCopas')
        throw new Error(error)
    }
}

const ocultarCopas = (copas) => {
    copas.map(copas => {
        copas.mostrar ? copas.mostrar = false : copas.mostrar = true
    })

    return copas
}

export const useShowCopas = () => {
    const queryClient = useQueryClient()
    // ocultarCopas retorna la variable "copas", es la misma variable que estoy utilizando para actualizar la querydata de copas
    return useMutation(ocultarCopas, {
        onSuccess: (copas) => {
            queryClient.setQueryData(['copas'], copas)
        }
    })
}

///////////////////////////////// POZOS /////////////////////////////////
export const getPosicionesPozos = async () => {
    const data = await getPozos()
    const pozos = []

    try {
        for (let reg of data) {
            pozos.push(
                {
                    id: reg.key,
                    nombre: reg.nombre_pozo,
                    tipo_elemento: reg.tipo_elemento,
                    latitud: reg.latitud,
                    longitud: reg.longitud,
                    mostrar: true
                }
            )
        }

        return pozos

    } catch (error) {
        console.log('Error en getPosicionesPozos')
        throw new Error(error)
    }
}

const ocultarPozos = (pozos) => {
    pozos.map(pozos => {
        pozos.mostrar ? pozos.mostrar = false : pozos.mostrar = true
    })

    return pozos
}

export const useShowPozos = () => {
    const queryClient = useQueryClient()

    return useMutation(ocultarPozos, {
        onSuccess: (pozos) => {
            queryClient.setQueryData(['pozos'], pozos)
        }
    })
}

///////////////////////////////// BATERIA /////////////////////////////////
export const getPosicionesBaterias = async () => {
    const data = await getBaterias()
    const baterias = []

    for (let reg of data) {
        baterias.push({
            id: reg.key,
            nombre: reg.nombre_bateria,
            tipo_elemento: reg.tipo_elemento,
            latitud: reg.latitud,
            longitud: reg.longitud,
            mostrar: true
        })
    }

    return baterias
}

const ocultarBaterias = (baterias) => {
    baterias.map(baterias => {
        baterias.mostrar ? baterias.mostrar = false : baterias.mostrar = true
    })
}

export const useShowBaterias = () => {
    const queryClient = useQueryClient()

    return useMutation(ocultarBaterias, {
        onSuccess: (baterias) => {
            queryClient.setQueryData(['baterias'], baterias)
        }
    })
}

///////////////////////////////// PUNTO INTERNO /////////////////////////////////
export const getPosicionesPuntosInternos = async () => {
    const data = await getPuntosInternos()
    const puntos_internos = []

    for (let reg of data) {
        puntos_internos.push({
            id: reg.key,
            nombre: reg.nombre_punto_interno,
            tipo_elemento: reg.tipo_elemento,
            latitud: reg.latitud,
            longitud: reg.longitud,
            mostrar: true
        })
    }

    return puntos_internos
}

const ocultarPuntosInternos = (puntos_internos) =>{
    puntos_internos.map(punto_interno => {
        punto_interno.mostrar ? punto_interno.mostrar = false : punto_interno.mostrar = true
    })

    return puntos_internos
}

export const useShowPuntosInternos = () => {
    const queryClient = useQueryClient()

    return useMutation(ocultarPuntosInternos, {
        onSuccess: (puntos_internos) => {
            queryClient.setQueryData(['puntos_internos'], puntos_internos)
        }
    })
}