import './FormPutPozo.css';
// Iconos
import { EditOutlined } from '@ant-design/icons';
// Hooks
import { useState, useEffect } from 'react';
// Componentes
import { Input, Select, Button, message } from 'antd';
// Custom hooks y funcionalidades
import { getEstados } from '../../pages/estado/useQueryEstado';
import { getBateriasLikeOptions } from '../../pages/pozo/pozoQueryApi';
import { getBombasLikeOptions } from '../../pages/pozo/pozoQueryApi';
import { getPozo } from '../../pages/pozo/pozoQueryApi';
// React Query
import { useQuery } from '@tanstack/react-query';
import { usePutPozo } from '../../pages/pozo/pozoQueryApi';

export const FormPutPozo = ({ recordKey }) => {

    const { mutate: updatePozo, isLoading: putLoading } = usePutPozo()

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
        nombre_bateria: null,
        nombre_bomba: null,
    });

    useEffect(() => {
        const getInitialFormValues = async () => {
            try {
                const pozo = await getPozo(recordKey);
                //console.log('Pozo de useEffect', pozo);
                if (pozo) {
                    console.log('Pozo: ',pozo)
                    
                    setFormValues({
                        nombre_pozo: pozo.nombre_pozo,
                        tipo_elemento: pozo.tipo_elemento.id,
                        latitud: pozo.latitud,
                        longitud: pozo.longitud,
                        estado: pozo.estado.id,
                        nombre_bateria: pozo.bateria.id,
                        nombre_bomba: pozo.bomba.id
                    });
                }
                //console.log('valores del formulario: ', formValues)
            } catch (error) {
                console.error('Error al obtener el pozo a modificar:', error);
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
        updatePozo({ id: recordKey, formValues });
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
