import './FormPutBomba.css';
// Iconos
import { EditOutlined } from '@ant-design/icons';
// Hooks
import { useState, useEffect } from 'react';
// Componentes
import { Input, Select, Button, message } from 'antd';
// Custom hooks y funcionalidades
import { getEstados } from '../pages/estado/useQueryEstado';
import { getBomba } from '../pages/bomba/bombaQueryAPI';
// React Query
import { useQuery } from '@tanstack/react-query';
import { usePutBomba } from '../pages/bomba/bombaQueryAPI';

export const FormPutBomba = ({ recordKey }) => {
    const { mutate: updateBomba, isLoading: putLoading } = usePutBomba();

    const { isLoading: getEstadosLoading, data: dataEstados } = useQuery(['estados'], getEstados);

    const [formValues, setFormValues] = useState({
        nombre_bomba: '',
        tipo_elemento: 1,
        estado: null,
    });
    
    useEffect(() => {
        const getInitialFormValues = async () => {
            try {
                const bomba = await getBomba(recordKey);
                console.log('Bomba de useEffect', bomba);
                if (bomba) {
                    setFormValues({
                        nombre_bomba: bomba.nombre_bomba,
                        tipo_elemento: bomba.tipo_elemento.id,
                        estado: bomba.estado.id,
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
        updateBomba({ id: recordKey, formValues });
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
