import './FormPutPuntoDeControl.css';
import React, { useState, useEffect } from 'react';
// REACT HOOK FORM
import { useForm, Controller } from 'react-hook-form';
// ANT DESIGN
import { Input, Select, Form, Button, Checkbox } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// REACT QUERY
import { getTiposDeElementosLikeOptions } from '../../pages/punto_de_control/puntoDeControlQueryApi';
import { useQuery } from '@tanstack/react-query';
import { getEstados } from '../../pages/estado/useQueryEstado';
import { getElementos } from '../../pages/punto_de_control/puntoDeControlQueryApi';
import { usePutPuntoDeControl } from '../../pages/punto_de_control/puntoDeControlQueryApi';
import { getPuntoDeControl } from '../../pages/punto_de_control/puntoDeControlQueryApi';

export const FormPutPuntoDeControl = ({ recordKey }) => {

    const { mutate: update, isLoading: loadingUpdate } = usePutPuntoDeControl()

    const { data: puntoDeControl, isLoading: loadingPuntoDeControl } = useQuery({
        queryKey: ['punto_de_control', recordKey],
        queryFn: () => getPuntoDeControl(recordKey)
    })

    const { data: dataTiposElementos, isLoading: loadingTiposDeElementos } = useQuery({
        queryKey: ['tipos_de_elementos'],
        queryFn: getTiposDeElementosLikeOptions
    })

    const { data: dataEstados, isLoading: loadingEstados } = useQuery({
        queryKey: ['estados'],
        queryFn: getEstados
    })

    const [tipoElementoId, setTipoElementoId] = useState(null)
    const { data: dataElementos, isLoading: loadingElementos } = useQuery({
        queryKey: ['elementos', tipoElementoId],
        queryFn: () => getElementos(tipoElementoId),
        enabled: tipoElementoId != null ? true : false
    })

    const { handleSubmit, control, formState: { errors }, watch, reset } = useForm(
        {
            defaultValues: {
                estado_retrasos: puntoDeControl?.estado_retrasos || false,
                nombre_punto_de_control: puntoDeControl?.nombre_punto_de_control || "",
                tipo_de_elemento: null,
                elemento: null,
                estado: puntoDeControl?.estado || undefined
            }
        }
    );
    
    useEffect(() => {
        if (puntoDeControl) {
            reset({
                estado_retrasos: puntoDeControl.estado_retrasos || false,
                nombre_punto_de_control: puntoDeControl.nombre_punto_de_control || "",
                tipo_de_elemento: null,
                elemento: null,
                estado: puntoDeControl.estado || null
            });
        }
    }, [puntoDeControl, reset]);
    
    const onSubmit = (data) => {
        const formData = {
            id: recordKey,
            data: data
        };
        update(formData);
        // console.log(formData)
        reset() // Formateo los campos del formulario
    };


    return (
        <Form onFinish={handleSubmit(onSubmit)} layout='vertical'>
            <div className='container-inputs'>
                <Form.Item
                    label="Nombre del punto de control"
                    validateStatus={errors.nombre_punto_de_control ? 'error' : ''}
                    help={errors.nombre_punto_de_control ? errors.nombre_punto_de_control.message : ''}
                >
                    <Controller
                        name="nombre_punto_de_control"
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: "El punto de control debe tener un nombre asociado",
                            },
                            minLength: {
                                value: 2,
                                message: "El nombre debe tener al menos 2 caracteres",
                            },
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
                    label="Tipo de elemento"
                    validateStatus={errors.tipo_de_elemento ? 'error' : ''}
                    help={errors.tipo_de_elemento ? errors.tipo_de_elemento.message : ''}
                >
                    <Controller
                        name='tipo_de_elemento'
                        control={control}
                        rules={{ required: "El punto de control debe tener un tipo de elemento asociado" }}
                        render={({ field }) => (
                            <Select
                                size='large'
                                {...field}
                                placeholder='Tipo de elemento'
                                options={dataTiposElementos}
                                loading={loadingTiposDeElementos} // Muestra un spinner si está cargando
                                disabled={loadingTiposDeElementos} // Desactiva el selector si está cargando
                                onSelect={(value) => {
                                    setTipoElementoId(value)
                                }}
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item
                    label="Elemento"
                    validateStatus={errors.elemento ? 'error' : ''}
                    help={errors.elemento ? errors.elemento.message : ''}
                >
                    <Controller
                        name="elemento"
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: 'El punto de control debe tener un elemento asociado'
                            },
                        }}
                        render={({ field }) => (
                            <Select
                                size='large'
                                {...field}
                                options={dataElementos}
                                //loading={loadingElementos == false ? false : true}
                                disabled={watch('tipo_de_elemento') ? false : true}
                                placeholder='Elemento'
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item
                    label="Estado"
                    validateStatus={errors.estado ? 'error' : ''}
                    help={errors.estado ? errors.estado.message : ''}
                >
                    <Controller
                        name="estado"
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: 'El punto de control debe tener un estado asociado'
                            },
                        }}
                        render={({ field }) => (
                            <Select
                                size='large'
                                {...field}
                                options={dataEstados}
                                loading={loadingEstados}
                                placeholder='Estado'
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item>
                    <Controller
                        name="estado_retrasos"
                        control={control}
                        render={({ field }) => (
                            <Checkbox {...field} checked={field.value}>
                                Pausar retrasos
                            </Checkbox>
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
                    loading={loadingUpdate}
                >
                    Registrar
                </Button>
            </Form.Item>
            
        </Form>
    )
}