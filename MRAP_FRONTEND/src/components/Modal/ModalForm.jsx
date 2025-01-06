import { useState } from "react";
import { Button, Modal } from "antd";

export const ModalForm = ({ title, form }) => {
    const [modalOpen, setModalOpen] = useState(false); // Cambiar a false para no abrirlo automáticamente

    const showModal = () => {
        setModalOpen(true);
    };

    const handleCancel = () => {
        setModalOpen(false); // Cerrar el modal al hacer clic en la 'X'
    };

    return (
        <>
            <Modal
                title={title}
                open={modalOpen}
                onCancel={handleCancel} // Cierra el modal al hacer clic en la 'X'
                closable // Permite cerrar el modal al hacer clic en la 'X'
                footer={null} // Eliminar botones de Aceptar y Cancelar
                centered
            >
                {form}
            </Modal>
        </>
    );
};
