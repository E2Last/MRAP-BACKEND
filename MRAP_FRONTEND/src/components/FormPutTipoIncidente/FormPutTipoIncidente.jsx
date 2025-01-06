// src/components/FormPutIncidente/FormPutIncidente.jsx
import { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { usePutIncidente, getIncidente } from '../../pages/tipos_de_incidentes/tipos_de_incidentesQueryAPI'; // Asegúrate de ajustar el path

export const FormPutTipoIncidente = ({ recordKey }) => {
    const [form] = Form.useForm();
    const { mutate: updateIncidente, isLoading } = usePutIncidente();

    const [formValues, setFormValues] = useState({
        id: '',
        descripcion_tipo_incidente: '',
        inhabilitar_elemento: '',
    });

    useEffect(() => {
        if (recordKey) {
            getIncidente(recordKey).then((data) => {
                form.setFieldsValue({
                    codigo_incidente: data.codigo_incidente,
                    descripcion_tipo_incidente: data.descripcion_tipo_incidente,
                    inhabilitar_elemento : data.inhabilitar_elemento
                });
            });
        }
    }, [recordKey, form]);

    const onFinish = (values) => {
        updateIncidente({ id: recordKey, formValues: values });
    };

    return (
        <Form form={form} layout='vertical' onFinish={onFinish}>
            <Form.Item
                name='codigo_incidente'
                label='Código del Incidente'
                rules={[{ required: true, message: 'Por favor ingrese un código' }]}
            >
                <Input placeholder='Ingrese el código' />
            </Form.Item>
            
            <Form.Item
                name='descripcion_tipo_incidente'
                label='Descripción'
                rules={[{ required: true, message: 'Por favor ingrese una descripción' }]}
            >
                <Input placeholder='Ingrese la descripción' />
            </Form.Item>

            <Form.Item>
                <Button type='primary' htmlType='submit' loading={isLoading}>
                    Actualizar Incidente
                </Button>
            </Form.Item>
        </Form>
    );
};
