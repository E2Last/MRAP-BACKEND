import './FormPutPuntoInterno.css';
// Iconos
import { EditOutlined } from '@ant-design/icons';
// Hooks
import { useState, useEffect } from 'react';
// Componentes
import { Input, Select, Button, message } from 'antd';
// Custom hooks y funcionalidades
import { getEstados } from '../../pages/estado/useQueryEstado';
import { getPuntoInterno } from '../../pages/punto_interno/PuntoInternoQueryAPI';
// React Query
import { useQuery } from '@tanstack/react-query';
import { usePutPuntoInterno } from '../../pages/punto_interno/PuntoInternoQueryAPI';

export const FormPutPuntoInterno = ({ recordKey }) => {
    const { mutate: updatePuntoInterno, isLoading: putLoading } = usePutPuntoInterno();

    const { isLoading: getEstadosLoading, data: dataEstados } = useQuery(['estados'], getEstados);

    const [formValues, setFormValues] = useState({
        nombre_punto_interno: '',
        tipo_elemento: 6,
        latitud: '',
        longitud: '',
        estado: null,
    });

    useEffect(() => {
        const getInitialFormValues = async () => {
            try {
                const punto_interno = await getPuntoInterno(recordKey);
                console.log('Punto interno de useEffect', punto_interno);
                if (punto_interno) {
                    setFormValues({
                        nombre_punto_interno: punto_interno.nombre_punto_interno,
                        tipo_elemento: punto_interno.tipo_elemento.id,
                        latitud: punto_interno.latitud,
                        longitud: punto_interno.longitud,
                        estado: punto_interno.estado.id
                    });
                }
                console.log('valores del formulario: ', formValues)
            } catch (error) {
                console.error('Error al obtener la copa a modificar:', error);
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

    const handleSelectChange = (value, label) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [label]: Number(value), // Convertir a número si es necesario
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Valores del formulario al enviar: ", formValues);
        updatePuntoInterno({ id: recordKey, formValues });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='container-inputs'>
                <Input
                    className="input-ant"
                    size="large"
                    placeholder="Nombre del punto interno"
                    id="nombre_punto_interno"
                    name="nombre_punto_interno"
                    value={formValues.nombre_punto_interno}
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

                <Select
                    className='input-ant'
                    placeholder='Estado'
                    value={formValues.estado}
                    size='large'
                    onChange={(value) => handleSelectChange(value, 'estado')}
                    options={dataEstados}
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
