import './FormCreatePuntoInterno'
import { Input, Select, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { usePostPuntoInterno } from '../../pages/punto_interno/PuntoInternoQueryAPI';
import { getEstados } from '../../pages/estado/useQueryEstado';
import { useQuery } from '@tanstack/react-query';

export const FormCreatePuntoInterno = () => {
    const { mutate: postPuntoInterno, isLoading: postLoading } = usePostPuntoInterno()

    const { isLoading: getEstadosLoading, data: dataEstados, isError: errorEstados } = useQuery({
        queryKey: ['estados'],
        queryFn: getEstados
    })

    const [formValues, setFormValues] = useState({
        nombre_punto_interno: '',
        tipo_elemento: 6,
        latitud: '',
        longitud: '',
        estado: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    // Maneja los cambios en los select
    const handleSelectChange = (value, field) => {
        setFormValues({
            ...formValues,
            [field]: Number(value),  // Convierte el valor a número si es necesario
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Enviar los valores al postCisterna
        postPuntoInterno(formValues);
        setFormValues({
            nombre_punto_interno: '',
            tipo_elemento: 6,
            latitud: '',
            longitud: '',
            estado: null,
        })
        console.log(formValues)
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
                    required
                />

                <Input
                    className="input-ant"
                    size="large"
                    placeholder="Latitud"
                    id="latitud"
                    name="latitud"
                    type='number'
                    value={formValues.latitud}
                    onChange={handleInputChange}
                    required
                />

                <Input
                    className="input-ant"
                    size="large"
                    placeholder="Longitud"
                    id="longitud"
                    name="longitud"
                    type='number'
                    value={formValues.longitud}
                    onChange={handleInputChange}
                    required
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
                    style={{ width: '95px' }}
                    icon={<PlusOutlined />}
                    loading={postLoading}
                >
                    CREAR
                </Button>
            </div>
        </form>
    );
}