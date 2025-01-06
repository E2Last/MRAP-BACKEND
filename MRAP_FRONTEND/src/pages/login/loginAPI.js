import axios from "axios";
import { message } from "antd";
import { useUserStore } from "../../store/userStore";
// eliminar
export const getUserData = () => {
    const { userInfo } = useUserStore.getState()
    return userInfo
}

export const handleSubmit = async (e, navigate) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const loginData = Object.fromEntries(formData);
    const { username } = loginData;

    try {
        const data = await handleLogin(loginData); // Espera la respuesta de handleLogin
        
        if (data) {
            // const { access, refresh } = data;

            // console.log(data)

            const loginUser = useUserStore.getState().loginUser; // Obtener la función desde el store
            loginUser(data.userId, username, data.access, data.refresh);

            navigate('/inicio')
        }
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
        const logoutUser = useUserStore.getState().logoutUser; // Obtener la función de logout
        logoutUser(); // Llamar a la función de logout
    }
};

export const handleLogin = async ({ username, password }) => {

    try {
        const response = await axios.post('http://127.0.0.1:8000/MRAP/usuario/login', {
            username,
            password,
        });

        const usuario = await getUserId(response.data.access, username)

        message.success('Usuario verificado');

        return {
            userId: usuario,
            access: response.data.access,
            refresh: response.data.refresh,
        }
    } catch (error) {
        console.error(error.response.data.detail); // Muestra el error en la consola
        message.error('Credenciales inválidas');
        throw new Error(error.response.data.detail); // Lanza el error para manejarlo en handleSubmit
    }
};

export const getUserId = async (token, username) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/MRAP/usuario/username/${username}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data.id; // Asegúrate de que `response.data` tenga la estructura correcta
    } catch (error) {
        console.error('Error al obtener el ID del usuario:', error);
        throw new Error('No se pudo obtener la ID del usuario');
    }
};