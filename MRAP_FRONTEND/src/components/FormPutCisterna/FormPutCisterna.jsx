import './FormPutCisterna.css';
// Iconos
import { EditOutlined } from '@ant-design/icons';
// Hooks
import { useState, useEffect } from 'react';
// Componentes
import { Input, Select, Button, message } from 'antd';
// Custom hooks y funcionalidades
import { getLocalidades } from '../../pages/localidad/useQueryLocalidad';
import { getEstados } from '../../pages/estado/useQueryEstado';
import { getCisterna } from '../../pages/cisterna/cisternaQueryAPI';
// React Query
import { useQuery } from '@tanstack/react-query';
import { usePutCisterna } from '../../pages/cisterna/cisternaQueryAPI';

export const FormPutCisterna = ({ recordKey }) => {
    const { mutate: updateCisterna, isLoading: putLoading } = usePutCisterna();

    const { isLoading: getLocalidadesLoading, data: dataLocalidades } = useQuery(['localidades'], getLocalidades);
    const { isLoading: getEstadosLoading, data: dataEstados } = useQuery(['estados'], getEstados);

    const [formValues, setFormValues] = useState({
        nombre_cisterna: '',
        tipo_elemento: 3,
        latitud: '',
        longitud: '',
        estado: null,
        localidad: null,
    });
    
    useEffect(() => {
        const getInitialFormValues = async () => {
            try {
                const cisterna = await getCisterna(recordKey);
                console.log('Cisterna de useEffect', cisterna);
                if (cisterna) {
                    setFormValues({
                        nombre_cisterna: cisterna.nombre_cisterna,
                        tipo_elemento: cisterna.tipo_elemento.id,
                        latitud: cisterna.latitud,
                        longitud: cisterna.longitud,
                        estado: cisterna.estado.id,
                        localidad: cisterna.localidad.id,
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

    const handleSelectChange = (value, label) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [label]: Number(value), // Convertir a número si es necesario
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Valores del formulario al enviar: ", formValues);
        updateCisterna({ id: recordKey, formValues });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='container-inputs'>
                <Input
                    className="input-ant"
                    size="large"
                    placeholder="Nombre de la cisterna"
                    id="nombre_cisterna"
                    name="nombre_cisterna"
                    value={formValues.nombre_cisterna}
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
                <Select
                    className='input-ant'
                    placeholder='Localidad'
                    value={formValues.localidad}
                    size='large'
                    onChange={(value) => handleSelectChange(value, 'localidad')}
                    options={dataLocalidades}
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
