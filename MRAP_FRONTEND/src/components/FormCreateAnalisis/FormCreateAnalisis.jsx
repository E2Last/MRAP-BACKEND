import React, { useState } from 'react';
import { Input, Button, Form, Transfer, Spin, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { usePostAnalisis } from '../../pages/analisis/analisisQueryAPI'; // Asegúrate de importar correctamente tu hook para crear análisis
import { useQuery } from '@tanstack/react-query';
import { getParametrosForTransfer } from '../../pages/parametro/parametroQueryAPI';
import { getTipoControlLikeOptions } from '../../pages/controles/controlesQueryAPI';

export const FormCreateAnalisis = () => {
    // Inicialización de React Hook Form
    const { control, handleSubmit, reset, formState: { errors }, setValue } = useForm();

    const { data: parametros, isLoading: loadingParametros } = useQuery({
        queryKey: ['parametro'],
        queryFn: getParametrosForTransfer
    })

    const { data: tipos_control, isLoading: loading_tipos_control, isError: error_tipos_control } = useQuery({
        queryKey: ['tipos_de_control'],
        queryFn: getTipoControlLikeOptions
    })

    const [parametrosAsignados, setParametrosAsignados] = useState([])

    const handleChange = (newTargetKeys) => {
        setParametrosAsignados(newTargetKeys)
        setValue('parametros', newTargetKeys)
    }

    const { mutate: postAnalisis, isLoading: postLoading } = usePostAnalisis()

    const onSubmit = (data) => {
        // console.log(data)
        postAnalisis(data)
    };

    return (
        <Form layout='vertical' onFinish={handleSubmit(onSubmit)}>
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
                            message: 'El analisis debe tener un nombre asociado'
                        }
                    }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Nombre el analisis"
                            size='large'
                            style={{ width: 400 }}
                        />
                    )}
                />
            </Form.Item>

            <Form.Item
                label='Tipo de control'
                validateStatus={errors.tipo_control ? 'error' : ''}
                help={errors.tipo_control ? errors.tipo_control.message : ''}
                required={true}
            >
                <Controller
                    name='tipo_control'
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: 'El analisis debe tener un tipo de control asociado'
                        }
                    }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            placeholder='Tipo de control'
                            size='large'
                            loading={loading_tipos_control}
                            disabled={loading_tipos_control}
                            options={tipos_control}
                        />
                    )}
                />
            </Form.Item>

            <Form.Item
                label='Parametros de analisis'
                validateStatus={errors.parametros ? 'error' : ''}
                help={errors.parametros ? errors.parametros.message : ''}
                required={true}
            >
                <Controller
                    name='parametros'
                    control={control}
                    rules={{
                        required: {
                            value: parametrosAsignados.length == 0 ? true : false,
                            message: 'El analisis debe tener al menos un parametro asociado'
                        }
                    }}
                    render={({ field }) => (
                        loadingParametros ? (
                            <Spin></Spin>
                        ) : (
                            <Transfer
                                {...field}
                                listStyle={{ width: '500px', height: '400px' }}
                                dataSource={parametros}
                                showSearch
                                filterOption={
                                    (inputValue, option) =>
                                        option.title.toLowerCase().includes(inputValue.toLowerCase()) ||
                                        option.description.toLowerCase().includes(inputValue.toLowerCase())
                                }
                                targetKeys={parametrosAsignados}
                                onChange={handleChange}
                                // onChange={(newTargetKeys) => console.log(newTargetKeys)}
                                onSearch={null}
                                render={(item) => item.title} // renderiza los "titles" de cada parametro para que sean visibles en la lista
                            />
                        )
                    )}
                />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                    size="large"
                    color='primary'
                    variant='filled'
                    loading={postLoading}
                >
                    Registrar nuevo tipo de analisis
                </Button>
            </Form.Item>
        </Form>
    );
};
