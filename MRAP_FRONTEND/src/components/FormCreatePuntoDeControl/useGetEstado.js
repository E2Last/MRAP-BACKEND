import { useState } from "react";
import { getEstados } from "../../pages/estado/useQueryEstado";

export const useGetEstado = () => {

    const [estados, setEstados] = useState([])

    const get_estados = async () => {
        const estados = await getEstados()
        setEstados(estados)
    }

    return { estados, get_estados }
}