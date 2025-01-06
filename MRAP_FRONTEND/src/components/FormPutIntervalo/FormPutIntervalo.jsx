import React, { useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, message } from 'antd';
import { useUpdateIntervalo, useGetIntervalo } from '../../pages/analisis_intervalo_referencia/analisis_intervalo_referenciaQueryAPI'; // Asegúrate de tener estas funciones

const { Option } = Select;

export const FormPutIntervalo = ({ recordKey }) => {
    const [form] = Form.useForm();
    const { data: intervaloData } = useGetIntervalo(recordKey); // Obtener datos del intervalo
    const { mutate: updateIntervalo, isLoading } = useUpdateIntervalo(); // Actualizar intervalo

    useEffect(() => {
        if (intervaloData) {
            form.setFieldsValue(intervaloData); // Cargar los datos en el formulario
        }
    }, [intervaloData, form]);

    const onFinish = (values) => {
        updateIntervalo({ ...values, key: recordKey }, {
            onSuccess: () => {
                message.success('Intervalo actualizado con éxito');
            },
            onError: () => {
                message.error('Error al actualizar el intervalo');
            },
        });
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item label="Nombre del Intervalo" name="nombre_intervalo" rules={[{ required: true, message: 'Por favor ingresa el nombre del intervalo' }]}>
                <Input />
            </Form.Item>

            <Form.Item label="Unidad" name="unidad" rules={[{ required: true, message: 'Por favor selecciona la unidad' }]}>
                <Select placeholder="Selecciona una unidad">
                    <Option value="mg/dL">mg/dL</Option>
                    <Option value="mmol/L">mmol/L</Option>
                    <Option value="g/dL">g/dL</Option>
                </Select>
            </Form.Item>

            <Form.Item label="Valor Mínimo" name="valor_minimo" rules={[{ required: true, message: 'Por favor ingresa el valor mínimo' }]}>
                <Input type="number" />
            </Form.Item>

            <Form.Item label="Valor Máximo" name="valor_maximo" rules={[{ required: true, message: 'Por favor ingresa el valor máximo' }]}>
                <Input type="number" />
            </Form.Item>

            <Form.Item label="Fecha de Registro" name="fecha_registro" rules={[{ required: true, message: 'Por favor selecciona la fecha de registro' }]}>
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    Actualizar Intervalo
                </Button>
            </Form.Item>
        </Form>
    );
};
