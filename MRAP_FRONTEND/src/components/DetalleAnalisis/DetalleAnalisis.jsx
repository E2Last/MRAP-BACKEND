import { Input, Button, Form, Transfer, Spin } from 'antd';
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from 'react-hook-form';
import { parametrosAsignadosForTransfer } from '../../pages/analisis/analisisQueryAPI';

export const DetalleAnalisis = ({ recordKey }) => {
    const { control, handleSubmit, setValue, formState: { errors } } = useForm();

    const { data: detalle, isLoading: loadingDetalle, isError: errorDetalle } = useQuery({
        queryKey: ['analisis_parametros', recordKey],
        queryFn: () => parametrosAsignadosForTransfer(recordKey),
    });

    if(loadingDetalle){
        return (
            <Spin size='large'/>
        )
    }

    if(errorDetalle){
        return (
            <h1>error</h1>
        )
    }

    return (
        <Form layout='vertical'>
            <Form.Item
                label='Nombre'
                validateStatus={errors.nombre ? 'error' : ''}
                help={errors.nombre ? errors.nombre.message : ''}
                required={true}
            >
                <Controller
                    name='nombre'
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: 'El análisis debe tener un nombre asociado',
                        },
                    }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Nombre del análisis"
                            size='large'
                            style={{ width: 400 }}
                            disabled={true}
                            value={detalle.nombre}
                        />
                    )}
                />
            </Form.Item>

            <Form.Item
                label='Parámetros de análisis'
                required={true}
            >
                <Controller
                    name='parametros'
                    control={control}
                    defaultValue={detalle.parametros_asociados}
                    render={({ field }) => (
                        <Transfer
                            {...field}
                            listStyle={{ width: '500px', height: '400px' }}
                            dataSource={detalle.parametros_totales}
                            targetKeys={detalle.parametros_asociados}
                            showSearch
                            filterOption={(inputValue, option) =>
                                option.title.toLowerCase().includes(inputValue.toLowerCase()) ||
                                option.description.toLowerCase().includes(inputValue.toLowerCase())
                            }
                            render={(item) => item.title}
                            disabled
                        />
                    )}
                />
            </Form.Item>

            <Button type="primary" htmlType="submit">
                Guardar
            </Button>
        </Form>
    );
};
