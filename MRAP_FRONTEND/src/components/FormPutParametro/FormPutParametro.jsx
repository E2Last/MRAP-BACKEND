// REACT HOOK FORM
import { useForm, Controller } from 'react-hook-form';
// ANT DESIGN
import { Input, Select, Form, Button, Checkbox, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// HOOKS REACT
import { useEffect } from 'react';
// REACT QUERY
import { useQuery } from '@tanstack/react-query';
import { getParametro } from '../../pages/parametro/parametroQueryAPI';
import { getUnidadesLikeOptiones } from '../../pages/unidades/unidadesQueryAPI';
import { usePutParametro } from '../../pages/parametro/parametroQueryAPI';

export const FormPutParametro = ({ recordKey }) => {

    const { data: parametro, isLoading: loadingParamatro } = useQuery({
        queryKey: ['parametro', recordKey],
        queryFn: ({ queryKey }) => getParametro(queryKey[1])
    })

    const { data: unidades, isLoading: loadingUnidades, isError: errorUnidades } = useQuery({
        queryKey: ['unidades'],
        queryFn: getUnidadesLikeOptiones
    })

    const { mutate: put, isLoading: putLoading } = usePutParametro()

    const { handleSubmit, control, formState: { errors }, watch, reset } = useForm({
        defaultValues: {
            parametro_codigo: '',
            nombre_parametro: '',
            unidad: '',
            texto: false,
            numero: false,
            decimales: 0
        }
    })

    useEffect(() => {
        if (parametro) {
            reset({
                parametro_codigo: parametro.parametro_codigo || '',
                nombre_parametro: parametro.nombre_parametro || '',
                unidad: parametro.unidad.id || '',
                texto: parametro.texto || false,
                numero: parametro.numero || false,
                decimales: parametro.decimal || 0
            })
        }
    }, [parametro, reset])

    const onSubmit = (data) => {
        //console.log(data);
        const formData = {
            id: recordKey,
            data: data
        }
        put(formData)
        reset()
    };

    return (
        <Form layout='vertical' onFinish={handleSubmit(onSubmit)}>
            <div className='container-inputs'>
                <Form.Item>
                    <Controller
                        name='parametro_codigo'
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: 'El parametro debe tener un codigo asociado'
                            }
                        }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder='Codigo del parametro'
                                size='large'
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item
                    label='Nombre del parametro'
                    validateStatus={errors.nombre_parametro ? 'error' : ''}
                    help={errors.nombre_parametro ? errors.nombre_parametro.message : ''}
                    required={true}
                >
                    <Controller
                        name='nombre_parametro'
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: 'El parametro debe tener un nombre asociado'
                            }
                        }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder='Nombre del parametro'
                                size='large'
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item
                    label='Unidad del parametro'
                    validateStatus={errors.nombre_parametro ? 'error' : ''}
                    help={errors.nombre_parametro ? errors.nombre_parametro.message : ''}
                    required={true}
                >
                    <Controller
                        name='unidad'
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: 'El parametro debe tener una unidad asociada'
                            }
                        }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                placeholder='Unidad'
                                options={unidades}
                                loading={loadingUnidades}
                                disabled={loadingUnidades}
                                size='large'
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item
                    validateStatus={errors.texto ? 'error' : ''}
                    help={errors.texto ? errors.texto.message : ''}
                >
                    <Controller
                        name='texto'
                        control={control}
                        render={({ field }) => (
                            <Checkbox {...field} checked={field.value}>Texto</Checkbox>
                        )}

                    />
                </Form.Item>

                <Form.Item
                    validateStatus={errors.numero ? 'error' : ''}
                    help={errors.numero ? errors.numero.message : ''}
                >
                    <Controller
                        name='numero'
                        control={control}
                        render={({ field }) => (
                            <Checkbox {...field} checked={field.value}>Numero</Checkbox>
                        )}

                    />
                </Form.Item>

                <Form.Item
                    label='Decimales'
                    validateStatus={errors.decimales ? 'error' : ''}
                    help={errors.decimales ? errors.decimales.message : ''}
                    required={watch('numero') ? true : false}
                >
                    <Controller
                        name='decimales'
                        control={control}

                        rules={{
                            validate: {
                                debeIngresarDecimales: (value) => {
                                    const numeroSeleccionado = watch('numero'); // Obtenemos el valor del campo 'numero'
                                    if (numeroSeleccionado) {
                                        return value ? true : 'Debe ingresar la cantidad de decimales'; // Validamos que el campo 'decimales' no esté vacío
                                    }
                                    return true; // Si 'numero' no está seleccionado, no es necesario validar 'decimales'
                                }
                            }
                        }}

                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder='Decimales'
                                size='large'
                                type='number'
                                disabled={watch('numero') ? false : true}
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