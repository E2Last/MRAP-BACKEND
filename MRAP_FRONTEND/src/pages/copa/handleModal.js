import { useState } from "react";

// Custom Hook para manejar el estado del modal
export const useModal = () => {
    const [open, setOpen] = useState(false); // Inicialmente el modal está cerrado

    const handleStateModal = () => {
        setOpen((prev) => !prev); // Cambia el estado del modal
    };

    return {
        open,
        handleStateModal,
    };
};