
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
import { usePostControl } from '../../pages/controles/controlesQueryAPI';
import { usePutControl } from '../../pages/controles/controlesQueryAPI';
import { getControl } from '../../pages/controles/controlesQueryAPI';

export const FormPutControl = ({ recordKey }) => {
    const { userInfo } = useUserStore.getState()
    const userId = userInfo.userId

    const { data: dataControl, isLoading: loadingControl } = useQuery({
        queryKey: ['control', recordKey],
        queryFn: () => getControl(recordKey),
        onSuccess: (dataControl) => {
            const obtener_valores = dataControl.valores_control.reduce((acc, parametro) => {
                // Usamos reduce para construir un objeto que contenga los valores de los parámetros
                acc[`parametro_${parametro.parametro.id}`] = parametro.valor;
                return acc;
            }, {});

            reset({
                tipo_control: dataControl.control.tipo_control.id,
                punto_de_control: dataControl.control.punto_de_control.id,
                fecha: dataControl.control.fecha,
                proveedor: dataControl.control.proveedor.id,
                analisis: dataControl.control.analisis.id,
                // aprobado: dataControl.control.aprobado,
                usuario: dataControl.control.usuario.id,
                ...obtener_valores,
            })
        }
    })

    const { handleSubmit, control, formState: { errors }, watch, reset } = useForm(
        {
            defaultValues: {
                tipo_control: null,
                punto_de_control: null,
                fecha: '',
                proveedor: null,
                analisis: null,
                // aprobado: false,
                usuario: null
            } // Solo asignar valores predeterminados si dataControl está disponible
        }
    );


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

    // const { mutate: postControl, isLoading: postLoading } = usePostControl()

    const { mutate: putControl, isLoading: putLoading } = usePutControl()

    const { data: analisis, isLoading: loadingAnalisis, isError: errorAnalisis } = useQuery({
        queryKey: ['analisis', watch('tipo_control') ? watch('tipo_control') : null],
        queryFn: () => getAnalisisLikeOptions(watch('tipo_control')),
        enabled: !!watch('tipo_control')
    })

    const { data: parametros_asociados, loading: loading_parametros_asociados, error: error_parametros_asociados } = useQuery({
        queryKey: ['parametros_analisis', watch('analisis')],
        queryFn: () => getParametrosAnalisis(watch('analisis')),
        enabled: !!watch('analisis')
    })

    const onSubmit = (data) => {
        // console.log(data); // Aquí puedes procesar los datos del formulario.
        const FormData = {
            id: recordKey,
            data_control: data,
            data_inputs: watch()
        }
        putControl(FormData)
        reset({
            tipo_control: '',
            punto_de_control: null,
            fecha: '',
            proveedor: null,
            analisis: null,
            // aprobado: false,
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

    if (loadingControl) {
        console.log(dataControl)
        return (
            <Card title='Control' className='form'>
                <div className='container-formulario'>
                    <Spin size='large'></Spin>
                </div>
            </Card>
        )
    }

    return (
        <div className='container-principal'>
            <div className='container-formularios'>
                <Card title='Control' className='form'>
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
                                            loading={loadingTiposDeControles}
                                            disabled={loadingTiposDeControles}
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
                                        // Asegúrate de que puntos_de_control esté correctamente mapeado y disponible
                                        const puntosDeControlOpciones = puntos_de_control || [];

                                        return (
                                            <Select
                                                {...field}
                                                showSearch
                                                mode='default'
                                                placeholder="Punto de control"
                                                size="large"
                                                loading={loadingPuntosControl}
                                                disabled={loadingPuntosControl}
                                                options={puntosDeControlOpciones}
                                                // Función de búsqueda para filtrar las opciones
                                                onSearch={(value) => {
                                                    const filtered = puntosDeControlOpciones.filter(punto =>
                                                        punto.label.toLowerCase().includes(value.toLowerCase())
                                                    );
                                                    setFilteredOptions(filtered);
                                                }}
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
                                            loading={loadingProveedores}
                                            disabled={loadingProveedores}
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
                                            loading={loadingAnalisis}
                                            disabled={loadingAnalisis}
                                            options={analisis}
                                        />
                                    )}
                                />
                            </Form.Item>

                            {/* <Form.Item>
                                <Controller
                                    name='aprobado'
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox {...field}>Aprobado</Checkbox>
                                    )}
                                />
                            </Form.Item> */}
                        </div>
                    </Form>
                </Card>

                {
                    parametros_asociados ? (
                        loading_parametros_asociados ? (
                            <Spin size='large' />
                        ) : (
                            <div>
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
                                <pre>
                                    {JSON.stringify(watch(), null, 2)}
                                </pre>
                            </div>
                        )

                    ) : null
                }
            </div>
            <div className='container-footer-modal-button'>
                <Button
                    color="primary"
                    variant="filled"
                    icon={<PlusOutlined />}
                    loading={putLoading}
                    size="large"
                    onClick={handleSubmit(onSubmit)} // Agregar esto si se desea usar un botón fuera del formulario.
                >
                    MODIFICAR CONTROL
                </Button>
            </div>
        </div>
    )
};
