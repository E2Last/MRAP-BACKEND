import './FormCreateBomba.css'
import { Input, Select, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { usePostBomba } from '../../pages/bomba/bombaQueryAPI';
import { getLocalidades } from '../../pages/localidad/useQueryLocalidad';
import { getEstados } from '../../pages/estado/useQueryEstado';
import { useQuery } from '@tanstack/react-query';

export const FormCreateBomba = () => {

    const { mutate: postBomba, isLoading: loadingPostBomba } = usePostBomba()

    const { isLoading: getLocalidadesLoading, data: dataLocalidades, isError: errorLocalidades } = useQuery({
        queryKey: ['localidades'],
        queryFn: getLocalidades
    })

    const { isLoading: getEstadosLoading, data: dataEstados, isError: errorEstados } = useQuery({
        queryKey: ['estados'],
        queryFn: getEstados
    })

    const [formValues, setFormValues] = useState({
        nombre_bomba: '',
        tipo_elemento: 1,
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
        // Enviar los valores al postCopa
        postBomba(formValues);
        setFormValues({
            nombre_bomba: '',
            tipo_elemento: 1,
            estado: null,
        })
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='container-inputs'>
                <Input
                    className="input-ant"
                    size="large"
                    placeholder="Nombre de la bomba"
                    id="nombre_bomba"
                    name="nombre_bomba"
                    value={formValues.nombre_bomba}
                    onChange={handleInputChange}
                    required={true}
                />

                <Select
                    className='input-ant'
                    placeholder='Estado'
                    value={formValues.estado}
                    size='large'
                    onChange={(value) => handleSelectChange(value, 'estado')}
                    options={dataEstados}
                    required={true}
                />

                <Button
                    size="middle"
                    htmlType="submit"
                    color='primary'
                    variant='filled'
                    style={{ width: '95px' }}
                    icon={<PlusOutlined />}
                    loading={loadingPostBomba}
                >
                    CREAR
                </Button>
            </div>
        </form>
    )
}