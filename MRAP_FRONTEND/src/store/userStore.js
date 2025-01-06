import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(persist(
    (set) => ({
        // Estado inicial del usuario
        userInfo: {
            userId: null,
            username: null,
            accessToken: null,
            refreshToken: null,
            isLoged: false,
        },

        loginUser: (userId, username, accesToken, refreshToken) => set({
            userInfo: {
                userId: userId,
                username: username,
                accessToken: accesToken,
                refreshToken: refreshToken,
                isLoged: true,
            }
        }),

        logoutUser: () => set({
            userInfo: {
                userId: null,
                username: null,
                accessToken: null,
                refreshToken: null,
                isLoged: false,
            }
        }),
    }),
    {
        name: 'userSesion', // Nombre de la clave en el almacenamiento
        getStorage: () => localStorage, // persistencia en localStorage
    }
));
