import './FormCreateParametro.css'
// REACT HOOK FORM
import { useForm, Controller } from 'react-hook-form';
// ANT DESIGN
import { Input, Select, Form, Button, Checkbox, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// REACT QUERY
import { useQuery } from '@tanstack/react-query';
import { usePostParametro } from '../../pages/parametro/parametroQueryAPI';
import { getUnidades } from '../../pages/unidades/unidadesQueryAPI';
import { getUnidadesLikeOptiones } from '../../pages/unidades/unidadesQueryAPI';

export const FormCreateParametro = () => {
    const { mutate: post, isLoading: postLoading } = usePostParametro()

    const { data: unidades, isLoading: loadingUnidades, isError: errorUnidades } = useQuery({
        queryKey: ['unidades'],
        queryFn: getUnidadesLikeOptiones
    })

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

    const onSubmit = (data) => {
        //console.log(data)
        post(data)
    }

    return (
        <Form layout='vertical' onFinish={handleSubmit(onSubmit)}>
            <div className='container-inputs'>
                <Form.Item
                    label='Codigo del parametro'
                    validateStatus={errors.parametro_codigo ? 'error' : ''}
                    help={errors.parametro_codigo ? errors.parametro_codigo.message : ''}
                    required={true}
                >
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
                    loading={postLoading}
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