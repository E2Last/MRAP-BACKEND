import './FormPutBateria.css';
// Iconos
import { EditOutlined } from '@ant-design/icons';
// Hooks
import { useState, useEffect } from 'react';
// Componentes
import { Input, Button } from 'antd';
// Custom hooks y funcionalidades
import { getBateria } from '../../pages/bateria/bateriaQueryAPI';
// React Query
import { usePutBateria } from '../../pages/bateria/bateriaQueryAPI';

export const FormPutBateria = ({ recordKey }) => {
    const { mutate: updateBateria, isLoading: putLoading } = usePutBateria();

    const [formValues, setFormValues] = useState({
        nombre_bateria: '',
        tipo_elemento: 2,
        latitud: '',
        longitud: '',
    });
    
    useEffect(() => {
        const getInitialFormValues = async () => {
            try {
                const bateria = await getBateria(recordKey);
                console.log('Bateria de useEffect', bateria);
                if (bateria) {
                    setFormValues({
                        nombre_bateria: bateria.nombre_bateria,
                        tipo_elemento: bateria.tipo_elemento.id,
                        latitud: bateria.latitud,
                        longitud: bateria.longitud,
                    });
                }
            } catch (error) {
                console.error('Error al obtener la cisterna a modificar:', error);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Valores del formulario al enviar: ", formValues);
        updateBateria({ id: recordKey, formValues });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='container-inputs'>
                <Input
                    className="input-ant"
                    size="large"
                    placeholder="Nombre de la bateria"
                    id="nombre_bateria"
                    name="nombre_bateria"
                    value={formValues.nombre_bateria}
                    onChange={handleInputChange}
                />
                <Input
                    className="input-ant"
                    size="large"
                    placeholder="Latitud"
                    id="latitud"
                    name="latitud"
                    value={formValues.latitud}
                    onChange={handleInputChange}
                />
                <Input
                    className="input-ant"
                    size="large"
                    placeholder="Longitud"
                    id="longitud"
                    name="longitud"
                    value={formValues.longitud}
                    onChange={handleInputChange}
                />
                
                <Button
                    size="middle"
                    htmlType="submit"
                    color='primary'
                    variant='filled'
                    style={{ width: '120px' }}
                    icon={<EditOutlined />}
                    loading={putLoading}
                >
                    MODIFICAR
                </Button>
            </div>
        </form>
    );
};
