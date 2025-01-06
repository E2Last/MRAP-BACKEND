import './FormPutCopa.css';
// Iconos
import { EditOutlined } from '@ant-design/icons';
// Hooks
import { useState, useEffect } from 'react';
// Componentes
import { Input, Select, Button, message } from 'antd';
// Custom hooks y funcionalidades
import { getLocalidades } from '../../pages/localidad/useQueryLocalidad';
import { getEstados } from '../../pages/estado/useQueryEstado';
import { getCopa } from '../../pages/copa/copaQueryAPI';
// React Query
import { useQuery } from '@tanstack/react-query';
import { usePutCopa } from '../../pages/copa/copaQueryAPI';

export const FormPutCopa = ({ recordKey }) => {
    const { mutate: updateCopa, isLoading: putLoading } = usePutCopa();

    const { isLoading: getLocalidadesLoading, data: dataLocalidades } = useQuery(['localidades'], getLocalidades);
    const { isLoading: getEstadosLoading, data: dataEstados } = useQuery(['estados'], getEstados);

    const [formValues, setFormValues] = useState({
        nombre_copa: '',
        tipo_elemento: 4,
        latitud: '',
        longitud: '',
        estado: null,
        localidad: null,
    });
    
    useEffect(() => {
        const getInitialFormValues = async () => {
            try {
                const copa = await getCopa(recordKey);
                console.log('Copa de useEffect', copa);
                if (copa) {
                    setFormValues({
                        nombre_copa: copa.nombre_copa,
                        tipo_elemento: copa.tipo_elemento.id,
                        latitud: copa.latitud,
                        longitud: copa.longitud,
                        estado: copa.estado.id,
                        localidad: copa.localidad.id,
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
        updateCopa({ id: recordKey, formValues });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='container-inputs'>
                <Input
                    className="input-ant"
                    size="large"
                    placeholder="Nombre de la copa"
                    id="nombre_copa"
                    name="nombre_copa"
                    value={formValues.nombre_copa}
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
