import { Input, Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getPeriocididad } from '../../pages/periodicidades/periodicidadesQueryAPI';
import { usePutPeriodicidad } from '../../pages/periodicidades/periodicidadesQueryAPI';

export const FormPutPeriodicidad = ({ recordKey }) => {

    const { data: periodicidad, isLoading: loaginPeriodicidad, isError: errorPeriodicidad } = useQuery({
        queryKey: ['periodicidad', recordKey],
        queryFn: ({ queryKey }) => getPeriocididad(queryKey[1])
    })

    const { mutate: put, isLoading: putLoading } = usePutPeriodicidad()

    const { handleSubmit, control, formState: { errors }, watch, reset } = useForm({
        defaultValues: {
            periodicidad_codigo: '',
            periodicidad_nombre: '',
            numero_dias: null,
            retraso_dias: null,
            muy_retrasado_dias: null
        }
    })

    useEffect(() => {
        if (periodicidad) {
            reset({
                periodicidad_codigo: periodicidad.periodicidad_codigo,
                periodicidad_nombre: periodicidad.periodicidad_nombre,
                numero_dias: periodicidad.numero_dias,
                retraso_dias: periodicidad.retraso_dias,
                muy_retrasado_dias: periodicidad.muy_retrasado_dias
            })
        }
    }, [periodicidad, reset])

    const onSubmit = (data) => {
        const formData = {
            id: recordKey,
            data: data
        };
        //console.log(formData)
        put(formData)
    }

    return (
        <Form layout='vertical' onFinish={handleSubmit(onSubmit)}>
            <div className='container-inputs'>
                <Form.Item
                    label='Codigo de la periodicidad'
                    validateStatus={errors.periodicidad_codigo ? 'error' : ''}
                    help={errors.periodicidad_codigo ? errors.periodicidad_codigo.message : ''}
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
                        loading={putLoading}
                    >
                        Registrar
                    </Button>
                </Form.Item>
            </div>
            {/* 
            <pre>
                {JSON.stringify(watch(), null, 2)}
            </pre>
            */}
        </Form>
    )
}