import './FormCreateBateria.css'
import { Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { usePostBateria } from '../../pages/bateria/bateriaQueryAPI';

export const FormCreateBateria = () => {

    const { mutate: postBateria, isLoading: loadingPostBateria } = usePostBateria()

    const [formValues, setFormValues] = useState({
        nombre_bateria: '',
        tipo_elemento: 2,
        latitud: '',
        longitud: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Enviar los valores al postCopa
        postBateria(formValues);
        setFormValues({
            nombre_bateria: '',
            tipo_elemento: 2,
            latitud: '',
            longitud: ''
        })
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
                    style={{ width: '95px' }}
                    icon={<PlusOutlined />}
                    loading={loadingPostBateria}
                >
                    CREAR
                </Button>
            </div>
        </form>
    )
}