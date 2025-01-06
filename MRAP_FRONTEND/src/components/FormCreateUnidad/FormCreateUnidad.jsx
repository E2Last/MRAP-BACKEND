import './FormCreateUnidad.css'
import { Input, Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { usePostUnidad } from '../../pages/unidades/unidadesQueryAPI';

export const FormCreateUnidad = () => {

    const { mutate: postUnidad, isLoading: postLoading } = usePostUnidad()

    const { handleSubmit, control, formState: { errors }, watch } = useForm();

    const onSubmit = (data) => {
        //console.log(data);
        postUnidad(data)
    };

    return (
        <Form onFinish={handleSubmit(onSubmit)} layout='vertical'>
            <div className='container-inputs'>
                <Form.Item
                    label='Codigo de la unidad'
                    validateStatus={errors.codigo_unidad ? 'error' : ''} // solo sirve para poner el campo en rojo con 'error'
                    help={errors.codigo_unidad ? errors.codigo_unidad.message : ''}
                >
                    <Controller
                        name='codigo_unidad'
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: 'La nueva unidad debe tener un codigo identificatorio asociado'
                            }
                        }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Nombre"
                                size="large"
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item
                    label='Nombre de la unidad'
                >
                    <Controller
                        name='nombre_unidad'
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: 'La nueva unidad requiere un nombre asociado'
                            }
                        }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder='Nombre'
                                size='large'
                            />
                        )}
                    />

                </Form.Item>

            </div>

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
                    Registrar
                </Button>
            </Form.Item>

            {/* la funcion watch sirve para mostrar los datos del formulario en tiempo real
            <pre>
                {JSON.stringify(watch(), null, 2)}
            </pre>
            */}
        </Form>
    )
}