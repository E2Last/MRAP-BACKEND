import './FormPutUnidad.css'
import { Input, Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { usePutUnidad } from '../../pages/unidades/unidadesQueryAPI';
import { getUnidad } from '../../pages/unidades/unidadesQueryAPI';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const FormPutUnidad = ({ recordKey }) => {

    const { data: unidad, isLoading: loadingGetUnidad, isError: errorUnidad } = useQuery({
        queryKey: ['unidad', recordKey],
        // queryKey es ['unidad', 5] siendo en este caso el 5 la key y accediendose a el mediante queryKey[1]
        queryFn: ({ queryKey }) => getUnidad(queryKey[1])
    })

    const { mutate: putUnidad, isLoading: putLoading } = usePutUnidad()

    const { handleSubmit, control, formState: { errors }, watch, reset } = useForm({
        defaultValues: {
            codigo_unidad: '',
            nombre_unidad: ''
        }
    })

    useEffect(() => {
        if (unidad) {
            reset({
                codigo_unidad: unidad.codigo || '',
                nombre_unidad: unidad.nombre_unidad || ''
            })
        }
    }, [unidad, reset])

    const onSubmit = (data) => {
        //console.log(data);
        const formData = {
            id: recordKey,
            data: data
        }
        putUnidad(formData)
        reset()
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
                                placeholder="Codigo de la unidad"
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
                                placeholder='Nombre de la unidad'
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
                    loading={putLoading}
                >
                    Registrar
                </Button>
            </Form.Item>
            <pre>
                {JSON.stringify(watch(), null, 2)}
            </pre>
        </Form>
    )
}