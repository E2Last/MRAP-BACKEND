import React from 'react';
import { Input, Button } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { usePostProveedor } from '../../pages/proveedores/proveedoresQueryAPI'; // Asegúrate de importar correctamente tu hook para crear proveedores

export const FormCreateProveedor = () => {
    // Inicialización de React Hook Form
    const { control, handleSubmit, reset, formState: { errors } } = useForm();
    
    const { mutate: postProveedor, isLoading } = usePostProveedor();

    // Manejar el envío del formulario
    const onSubmit = (data) => {
        try {
            postProveedor(data);
            // Limpiar el formulario tras el envío exitoso
            reset();
        } catch (error) {
            console.error("Error al crear proveedor: ", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="container-inputs">
                <Controller
                    name="codigo_proveedor"
                    control={control}
                    rules={{ required: "El código es requerido", valueAsNumber: true }}
                    render={({ field }) => (
                        <Input
                            {...field}  
                            placeholder="Codigo"
                        />
                    )}
                />
                {errors.codigo_proveedor && <span>{errors.codigo_proveedor.message}</span>}

                <Controller
                    name="nombre_proveedor"
                    control={control}
                    rules={{ required: "El nombre es requerido" }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Nombre del Proveedor"
                        />
                    )}
                />
                {errors.nombre_proveedor && <span>{errors.nombre_proveedor.message}</span>}

                <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                >
                    Crear Proveedor
                </Button>
            </div>
        </form>
    );
};