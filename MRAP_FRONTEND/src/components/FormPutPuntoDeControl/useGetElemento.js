import { useState } from "react";
import { getBombasLikeOptions } from '../../pages/bomba/bombaQueryAPI';
import { getBateriasLikeOptions } from '../../pages/bateria/bateriaQueryAPI';

export const useGetElementos = () => {
    const [tipoElemento, setTipoElemento] = useState(null);
    const [elementos, setElementos] = useState([]);

    const getElementos = async (tipo_elemento_id) => {
        // Bombas
        if (tipo_elemento_id === 1) {
            const bombas = await getBombasLikeOptions();
            setElementos(bombas);
        }
        // Baterías
        else if (tipo_elemento_id === 2) {
            const baterias = await getBateriasLikeOptions();
            setElementos(baterias);
        }
        // Otros tipos de elementos
        else if (tipo_elemento_id === 3) {
            console.log('traer cisternas');
        } else if (tipo_elemento_id === 4) {
            console.log('traer copas');
        } else if (tipo_elemento_id === 5) {
            console.log('traer pozos');
        } else if (tipo_elemento_id === 6) {
            console.log('traer puntos internos');
        }
    };

    return {
        elementos,
        getElementos,
        tipoElemento,
        setTipoElemento
    };
};
