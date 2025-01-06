import axios from "axios";
import { useUserStore } from "../../store/userStore";

const estadoAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/MRAP/'
})

export const getEstados = async () => {
    try {
        const { userInfo } = useUserStore.getState();
        const accessToken = userInfo.accessToken;

        if (!accessToken) {
            throw new Error("Token de acceso no disponible");
        }

        const response = await estadoAPI.get('/estado/',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}` // Asegúrate de incluir 'Bearer '
                }
            }
        )

        if (response) {
            const data = []

            for (let reg of response.data) {
                const registro = {
                    value: reg.id,
                    label: reg.descripcion
                }
                data.push(registro)
            }
            //console.log(data)
            return data
        }
        return response.data

    } catch (error) {
        throw error
    }
}