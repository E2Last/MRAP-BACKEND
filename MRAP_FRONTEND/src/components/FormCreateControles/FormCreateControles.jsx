import './FormCreateControles.css'
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { Form, Input, Button, Select, Checkbox, Spin, Card, DatePicker, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getTiposControlesLikeOptions } from '../../pages/controles/controlesQueryAPI';
import { getPuntosDeControlLikeOptions } from '../../pages/punto_de_control/puntoDeControlQueryApi';
import { getProveedoresLikeOptions } from '../../pages/proveedores/proveedoresQueryAPI';
import { getAnalisisLikeOptions } from '../../pages/analisis/analisisQueryAPI';
import { useUserStore } from '../../store/userStore';
import { getParametrosAnalisis } from '../../pages/controles/controlesQueryAPI';
// import { postControl } from '../../pages/controles/controlesQueryAPI';
import { usePostControl } from '../../pages/controles/controlesQueryAPI';

export const FormCreateControl = () => {
    const { userInfo } = useUserStore.getState()
    const userId = userInfo.userId

    const { handleSubmit, control, formState: { errors }, watch, reset } = useForm(
        {
            defaultValues: {
                tipo_control: '',
                punto_de_control: null,
                fecha: '',
                proveedor: null,
                analisis: null,
                // aprobado: false,
                usuario: userId
            }
        }
    )

    const { data: tipos_de_controles, isLoading: loadingTiposDeControles, isError: errorTiposDeControles } = useQuery({
        queryKey: ['tipos_de_controles'],
        queryFn: getTiposControlesLikeOptions
    })

    const { data: puntos_de_control, isLoading: loadingPuntosControl, isError: errorPuntosDeControl } = useQuery({
        queryKey: ['puntos_de_control'],
        queryFn: getPuntosDeControlLikeOptions
    })

    const { data: proveedores, isLoading: loadingProveedores, isError: errorProveedores } = useQuery({
        queryKey: ['proveedores'],
        queryFn: getProveedoresLikeOptions
    })

    const { mutate: postControl, isLoading: postLoading } = usePostControl()

    const { data: analisis, isLoading: loadingAnalisis, isError: errorAnalisis } = useQuery({
        enabled: !!watch('tipo_control'),
        queryKey: ['analisis', watch('tipo_control') ? watch('tipo_control') : null],
        queryFn: () => getAnalisisLikeOptions(watch('tipo_control'))
    })

    const { data: parametros_asociados, loading: loading_parametros_asociados, error: error_parametros_asociados } = useQuery({
        queryKey: ['parametros_analisis', watch('analisis')],
        queryFn: () => getParametrosAnalisis(watch('analisis')),
        enabled: !!watch('analisis')
    })

    const onSubmit = (data) => {
        // console.log(data); // Aquí puedes procesar los datos del formulario.
        const FormData = {
            data_control: data,
            data_inputs: watch()
        }
        
        postControl(FormData)

        reset({
            tipo_control: '',
            punto_de_control: null,
            fecha: '',
            proveedor: null,
            analisis: null,
            usuario: userId
        })

    }

    const onSearch = (value) => {
        return puntos_de_control?.filter((punto) =>
            punto.label.toLowerCase().includes(value.toLowerCase())
        );
    };

    if (loadingTiposDeControles) return <Spin size='large'></Spin>
    if (errorTiposDeControles) return <h3>Error al obtener los tipos de controles</h3>

    return (
        <div className='container-principal'>
            <div className='container-formularios'>
                <Card className='form'>
                    {
                        (loadingTiposDeControles || loadingPuntosControl || loadingProveedores) ? (
                            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Spin size='large' />
                            </div>
                        ) : (
                            <Form layout='vertical' className='form'>
                                <div className='container-formulario'>
                                    <Form.Item
                                        label='Tipo de control'
                                        required={true}
                                    >
                                        <Controller
                                            name='tipo_control'
                                            control={control}
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message: 'Se debe especificar el tipo de control'
                                                }
                                            }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    placeholder='Tipo de control'
                                                    size='large'
                                                    // loading={loadingTiposDeControles}
                                                    // disabled={loadingTiposDeControles}
                                                    options={tipos_de_controles}
                                                />
                                            )}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label='Punto de control'
                                        required={true}
                                    >
                                        <Controller
                                            name='punto_de_control'
                                            control={control}
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message: 'El control debe tener un punto de control asignado'
                                                }
                                            }}
                                            render={({ field }) => {
                                                const [filteredOptions, setFilteredOptions] = useState(puntos_de_control || []);
                                                return (
                                                    <Select
                                                        {...field}
                                                        showSearch
                                                        placeholder="Punto de control"
                                                        size="large"
                                                        disabled={loadingPuntosControl}
                                                        onSearch={(value) => {
                                                            const filtered = onSearch(value);
                                                            setFilteredOptions(filtered);
                                                        }}
                                                        options={filteredOptions.length > 0 ? filteredOptions : puntos_de_control?.map((punto) => ({
                                                            label: (
                                                                <Space>
                                                                    <span role="img" aria-label={punto.label}>
                                                                        {punto.value}
                                                                    </span>
                                                                    {punto.label}
                                                                </Space>
                                                            ),
                                                            value: punto.value,
                                                        }))}
                                                        optionLabelProp="label"
                                                    />
                                                );
                                            }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label='Fecha del control'
                                        required={true}
                                    >
                                        <Controller
                                            name='fecha'
                                            control={control}
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message: 'El control debe tener una fecha de creacion asignada'
                                                }
                                            }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    size='large'
                                                    type='date'
                                                    placeholder='Fecha'
                                                />
                                            )}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label='Proveedores'
                                        required={true}
                                    >
                                        <Controller
                                            name='proveedor'
                                            control={control}
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message: 'El control debe tener un proveedor asignado'
                                                }
                                            }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    placeholder='Proveedor'
                                                    size='large'
                                                    options={proveedores}
                                                />
                                            )}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label='Analisis'
                                        required={true}
                                    >
                                        <Controller
                                            name='analisis'
                                            control={control}
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message: 'El control debe tener un analisis asignado'
                                                }
                                            }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    placeholder='Analisis'
                                                    size='large'
                                                    options={analisis}
                                                />
                                            )}
                                        />
                                    </Form.Item>
                                </div>
                            </Form>
                        )
                    }

                    {/* <pre>
                        {JSON.stringify(watch(), null, 2)}
                    </pre> */}
                </Card>

                {
                    parametros_asociados ? (
                        loading_parametros_asociados ? (
                            <Spin size='large' />
                        ) : (
                            <Card title="Parámetros Asociados" className="form">
                                {loading_parametros_asociados ? (
                                    <Spin size="large" />
                                ) : (
                                    <div className="container-formulario">
                                        {parametros_asociados?.map((parametro) => {
                                            const {
                                                id,
                                                nombre_parametro,
                                                texto,
                                                numero,
                                            } = parametro;

                                            return (
                                                <Form.Item
                                                    key={id}
                                                    label={nombre_parametro}
                                                    name={`parametro_${id}`}
                                                >
                                                    <Controller
                                                        name={`parametro_${id}`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                placeholder={nombre_parametro}
                                                                type={numero != null ? "number" : "text"}
                                                                size='large'
                                                            />
                                                        )}
                                                    />
                                                </Form.Item>
                                            );
                                        })}
                                    </div>
                                )}
                            </Card>
                        )

                    ) : null
                }
            </div>
            <div className='container-footer-modal-button'>
                <Button
                    color="primary"
                    variant="filled"
                    icon={<PlusOutlined />}
                    loading={postLoading}
                    size="large"
                    onClick={handleSubmit(onSubmit)} // Agregar esto si se desea usar un botón fuera del formulario.
                >
                    CARGAR CONTROL
                </Button>
            </div>
        </div>
    )
};
