import { useState } from "react";
import { getBombasLikeOptions } from "../bomba/bombaQueryAPI";
import { getBateriasLikeOptions } from "../bateria/bateriaQueryAPI";
import { getCisternasLikeOptions } from "../cisterna/cisternaQueryAPI";
import { getCopasLikeOptions } from "../copa/copaQueryAPI";
import { getPozosLikeOption } from "../pozo/pozoQueryApi";
import { getPuntosInternosLikeOptiones } from "../punto_interno/PuntoInternoQueryAPI";

export const useGetElementos = () => {

    const [elementos, setElementos] = useState([])

    const get_elementos = async (tipo_elemento_id) => {
        // BOMBAS
        if (tipo_elemento_id == 1) {
            setElementos(await getBombasLikeOptions())
        }
        // BATERIAS
        else if (tipo_elemento_id == 2)
            setElementos(await getBateriasLikeOptions())
        // CISTERNAS
        else if (tipo_elemento_id == 3)
            setElementos(await getCisternasLikeOptions())
        // COPAS
        else if (tipo_elemento_id == 4)
            setElementos(await getCopasLikeOptions())
        // POZOS
        else if (tipo_elemento_id == 5)
            setElementos(await getPozosLikeOption())
        // PUNTOS INTERNOS
        else if (tipo_elemento_id == 6)
            setElementos(await getPuntosInternosLikeOptiones())
    }

    return { get_elementos }
}