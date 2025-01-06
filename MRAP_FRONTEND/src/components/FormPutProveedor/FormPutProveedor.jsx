import './FormPutProveedor.css';
import React, { useState, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import { getProveedor } from '../../pages/proveedores/proveedoresQueryAPI';
import { usePutProveedor } from '../../pages/proveedores/proveedoresQueryAPI';

export const FormPutProveedor = ({ recordKey }) => {
    const { mutate: updateProveedor, isLoading: putLoading } = usePutProveedor();

    const [formValues, setFormValues] = useState({
        id: '',
        codigo_proveedor: '',
        nombre_proveedor: '',
    });

    useEffect(() => {
        const getInitialFormValues = async () => {
            try {
                const proveedor = await getProveedor(recordKey);
                if (proveedor) {
                    setFormValues({
                        id: proveedor.id,
                        codigo_proveedor: proveedor.codigo_proveedor,
                        nombre_proveedor: proveedor.nombre_proveedor,
                    });
                }
            } catch (error) {
                console.error('Error al obtener el proveedor:', error);
            }
        };

        getInitialFormValues();
    }, [recordKey]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { id, codigo_proveedor, nombre_proveedor } = formValues;
    
        if (!codigo_proveedor || !nombre_proveedor) {
            message.error('Por favor, completa todos los campos requeridos');
            return;
        }
    
        try {
            // Enviar id y formValues en un solo objeto
            await updateProveedor({ id, formValues: { codigo_proveedor, nombre_proveedor } });
            message.success('Proveedor modificado con éxito');
        } catch (error) {
            message.error('Error al modificar el proveedor');
            console.error('Error al modificar el proveedor:', error);
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <div className='container-inputs'>
                <Input
                    className="input-ant"
                    size="large"
                    placeholder="ID del Proveedor"
                    name="id"
                    value={formValues.id}
                    onChange={handleInputChange}
                    disabled
                />

                <Input
                    className="input-ant"
                    size="large"
                    placeholder="Código del Proveedor"
                    name="codigo_proveedor"
                    value={formValues.codigo_proveedor}
                    onChange={handleInputChange}
                    required
                />

                <Input
                    className="input-ant"
                    size="large"
                    placeholder="Nombre del Proveedor"
                    name="nombre_proveedor"
                    value={formValues.nombre_proveedor}
                    onChange={handleInputChange}
                    required
                />

                <Button
                    size="middle"
                    htmlType="submit"
                    color='primary'
                    variant='filled'
                    style={{ width: '120px' }}
                    loading={putLoading}
                >
                    MODIFICAR
                </Button>
            </div>
        </form>
    );
};
