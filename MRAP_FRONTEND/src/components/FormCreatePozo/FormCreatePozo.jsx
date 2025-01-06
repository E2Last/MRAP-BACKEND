import './FormCreatePozo.css'
import { Input, Select, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { usePostPozo } from '../../pages/pozo/pozoQueryApi';
import { getEstados } from '../../pages/estado/useQueryEstado';
import { getBombas } from '../../pages/bomba/bombaQueryAPI';
import { getBateriasLikeOptions } from '../../pages/pozo/pozoQueryApi';
import { getBombasLikeOptions } from '../../pages/pozo/pozoQueryApi';
import { useQuery } from '@tanstack/react-query';

export const FormCreatePozo = () => {

    const { mutate: postPozo, isLoading: loadingPostPozo } = usePostPozo()

    const { data: dataEstados, isLoading: loadingGetEstados, isError: errorGetEstados } = useQuery({
        queryKey: ['estados'],
        queryFn: getEstados
    })

    const { data: dataBaterias, isLoading: loadingGetBaterias, isError: errorGetBaterias } = useQuery({
        queryKey: ['baterias'],
        queryFn: getBateriasLikeOptions
    })

    const { data: dataBombas, isLoading: loadingGetBombas, isError: errorGetBombas } = useQuery({
        queryKey: ['bombas'],
        queryFn: getBombasLikeOptions
    })

    const [formValues, setFormValues] = useState({
        nombre_pozo: '',
        tipo_elemento: 5,
        latitud: '',
        longitud: '',
        estado: null,
        nombre_bateria: '',
        nombre_bomba: '',
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
        postPozo(formValues);
        setFormValues({
            nombre_pozo: '',
            tipo_elemento: 5,
            latitud: '',
            longitud: '',
            estado: null,
            nombre_bateria: null,
            nombre_bomba: null,
        })
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='container-inputs'>
                <Input
                    className="input-ant"
                    size="large"
                    placeholder="Nombre del pozo"
                    id="nombre_pozo"
                    name="nombre_pozo"
                    value={formValues.nombre_pozo}
                    onChange={handleInputChange}
                    required={true}
                />

                <Input
                    className="input-ant"
                    size="large"
                    placeholder="Latitud"
                    id="latitud"
                    name="latitud"
                    value={formValues.latitud}
                    onChange={handleInputChange}
                    required={true}
                />

                <Input
                    className="input-ant"
                    size="large"
                    placeholder="Longitud"
                    id="longitud"
                    name="longitud"
                    value={formValues.longitud}
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

                <Select
                    className='input-ant'
                    placeholder='Bateria'
                    value={formValues.nombre_bateria || null}
                    size='large'
                    onChange={(value) => handleSelectChange(value, 'nombre_bateria')}
                    options={dataBaterias}
                    required={true}
                    showSearch
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />

                <Select
                    className='input-ant'
                    placeholder='Bomba'
                    value={formValues.nombre_bomba || null}
                    size='large'
                    onChange={(value) => handleSelectChange(value, 'nombre_bomba')}
                    options={dataBombas}
                    required={true}
                    showSearch
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />

                <Button
                    size="middle"
                    htmlType="submit"
                    color='primary'
                    variant='filled'
                    style={{ width: '95px' }}
                    icon={<PlusOutlined />}
                    loading={loadingPostPozo}
                >
                    CREAR
                </Button>
            </div>
        </form>
    )
}