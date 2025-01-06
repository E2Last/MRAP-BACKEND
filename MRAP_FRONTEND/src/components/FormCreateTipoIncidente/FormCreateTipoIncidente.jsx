import { useState } from 'react';
import { Button, Form, Input, Switch } from 'antd';
import { usePostIncidente } from '../../pages/tipos_de_incidentes/tipos_de_incidentesQueryAPI'; // Asegúrate de ajustar el path

export const FormCreateTipoIncidente = () => {
    const [form] = Form.useForm();
    const { mutate: createIncidente, isLoading } = usePostIncidente();
    const [isDisabled, setIsDisabled] = useState(false); // Estado para el botón de envío
    const [isInactive, setIsInactive] = useState(false); // Estado booleano para el Switch

    // const onFinish = (values) => {
    //     createIncidente(values);
    //     form.resetFields(); // Resetear el formulario después de enviar
    // };
    const onFinish = (values) => {
        // Aquí recibes el valor booleano de "inhabilitar_elemento" (true o false)
        const incidentData = { ...values, estado: values.inhabilitar_elemento ? 'inactivo' : 'activo' }; 
        setIsDisabled(true); // Deshabilitar el botón al enviar
        createIncidente(values);
        form.resetFields();
    };

    const handleSwitchChange = (checked) => {
        setIsInactive(!checked); // Si el switch está activo, el elemento está activo; si no, está inactivo
    };

    return (
        <Form form={form} layout='vertical' onFinish={onFinish}>
            <Form.Item
                name='descripcion_tipo_incidente'
                label='Nombre'
                rules={[{ required: true, message: 'Por favor ingrese una descripción' }]}
            >
                <Input placeholder='Ingrese el nombre' />
            </Form.Item>

            <Form.Item
                label="Cambiar Estado del elemento de la red a inactivo"
                name="inhabilitar_elemento"
                valuePropName="checked" // Asegura que el valor se guarde como true/false
            >
                <Switch checked={!isInactive} onChange={handleSwitchChange} />
                
            </Form.Item>

            <Form.Item>
                <Button type='primary' htmlType='submit' loading={isLoading} disabled={isLoading}>
                    Crear Incidente
                </Button>
            </Form.Item>
        </Form>
    );
};
