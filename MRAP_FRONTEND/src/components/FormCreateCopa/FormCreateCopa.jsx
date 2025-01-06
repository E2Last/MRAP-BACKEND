import './FormCreateCopa.css';
import { Input, Select, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { usePostCopa } from '../../pages/copa/copaQueryAPI';
import { getLocalidades } from '../../pages/localidad/useQueryLocalidad';
import { getEstados } from '../../pages/estado/useQueryEstado';
import { useQuery } from '@tanstack/react-query';

export const FormCreateCopa = () => {

    const { mutate: postCopa, isLoading: postLoading } = usePostCopa()

    const { isLoading: getLocalidadesLoading, data: dataLocalidades, isError: errorLocalidades } = useQuery({
        queryKey: ['localidades'],
        queryFn: getLocalidades
    })

    const { isLoading: getEstadosLoading, data: dataEstados, isError: errorEstados } = useQuery({
        queryKey: ['estados'],
        queryFn: getEstados
    })

    const [formValues, setFormValues] = useState({
        nombre_copa: '',
        tipo_elemento: 4,
        latitud: '',
        longitud: '',
        estado: null,
        localidad: null,
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
        // Enviar los valores al postCopa
        postCopa(formValues);
        setFormValues({
            nombre_copa: '',
            tipo_elemento: 4,
            latitud: '',
            longitud: '',
            estado: null,
            localidad: null,
        })
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
                    style={{ width: '95px' }}
                    icon={<PlusOutlined />}
                    loading={postLoading}
                >
                    CREAR
                </Button>
            </div>
        </form>
    );
};
