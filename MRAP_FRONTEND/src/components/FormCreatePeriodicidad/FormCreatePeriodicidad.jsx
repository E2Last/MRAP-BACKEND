import './FormCreatePeriodicidad.css'
// REACT HOOK FORM
import { useForm, Controller } from 'react-hook-form';
// ANT DESIGN
import { Input, Select, Form, Button, Checkbox } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// REACT QUERY
import { useQuery } from '@tanstack/react-query';
import { usePostPeriodicidad } from '../../pages/periodicidades/periodicidadesQueryAPI';

export const FormCreatePeriodicidad = () => {

    const { mutate: post, isLoading: postLoading } = usePostPeriodicidad()

    const { handleSubmit, control, formState: { errors }, watch, reset } = useForm()

    const onSubmit = (data) => {
        //console.log(data)
        post(data)
    }

    return (
        <Form layout='vertical' onFinish={handleSubmit(onSubmit)}>
            <div className='container-inputs'>
                <Form.Item
                    label='Codigo de la periodicidad'
                    validateStatus={errors.periodicidad_codigo ? 'error' : ''}
                    help={errors.periodicidad_codigo ? errors.periodicidad_codigo.message : ''}
                    required = {true}
                >
                    <Controller
                        name='periodicidad_codigo'
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: 'La periodicidad debe tener un codigo asociado'
                            }
                        }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Codigo de periocidad"
                                size="large"
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item
                    label='Periodicidad nombre'
                    validateStatus={errors.periodicidad_nombre ? 'error' : ''}
                    help={errors.periodicidad_nombre ? errors.periodicidad_nombre.message : ''}
                    required = {true}
                >
                    <Controller
                        name='periodicidad_nombre'
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: 'La periocidad debe tener un nombre asociado'
                            }
                        }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder='Nombre de la periocidad'
                                size='large'
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item
                    label='Dias'
                    validateStatus={errors.numero_dias ? 'error' : ''}
                    help={errors.numero_dias ? errors.numero_dias.message : ''}
                    required = {true}
                >
                    <Controller
                        name='numero_dias'
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: 'Es necesario especificar los dias de retraso del nuevo periodo'
                            }
                        }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder='Dias'
                                size='large'
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item
                    label='Dias de retraso'
                    validateStatus={errors.retraso_dias ? 'error' : ''}
                    help={errors.retraso_dias ? errors.retraso_dias.message : ''}
                    required = {true}
                >
                    <Controller
                        name='retraso_dias'
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: 'Es necesario especificar la cantidad de dias de retrasos del periodo'
                            }
                        }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder='Cantidad de dias de retraso'
                                size='large'
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item
                    label='Muy retrasado'
                    validateStatus={errors.muy_retrasado_dias ? 'error' : ''}
                    help={errors.muy_retrasado_dias ? errors.muy_retrasado_dias.message : ''}
                    required = {true}
                >
                    <Controller
                        name='muy_retrasado_dias'
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: 'Es necesario especificar la cantidad de dias que se consideran como muy retrasado'
                            }
                        }}
                        render={({ field }) => (
                            <Input
                                {...field}  
                                placeholder='Cantidad de dias muy retrasado'
                                size='large'
                            />
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
                        Registrar
                    </Button>
                </Form.Item>
            </div>

            <pre>
                {JSON.stringify(watch(), null, 2)}
            </pre>
        </Form>
    )
}