import React from 'react';
// HOOKS REACT
import { useState, useEffect } from 'react';
// ANT DESIGN
import { Input, Select, Form, Button, Checkbox, Alert, Spin } from 'antd';
const { TextArea } = Input
import { EditOutlined } from '@ant-design/icons';
// REACT HOOK FORM
import { useForm, Controller } from 'react-hook-form';
// REACT QUERY
import { useQuery } from '@tanstack/react-query';
import { getTipoIncidentesOpcion } from '../../pages/tipos_de_incidentes/tipos_de_incidentesQueryAPI';
import { getGravedadesLikeOptions } from '../../pages/incidentes/incidentesQueryAPI';
import { getTiposDeElementosLikeOptions } from '../../pages/incidentes/incidentesQueryAPI';
import { getElementos } from '../../pages/incidentes/incidentesQueryAPI';
import { getIncidente } from '../../pages/incidentes/incidentesQueryAPI';
import { usePutIncidente } from '../../pages/incidentes/incidentesQueryAPI';

export const FormPutIncidente = ({ recordKey }) => {

    const { mutate: put, loading: putLoading } = usePutIncidente()

    const { handleSubmit, control, formState: { errors }, watch, reset } = useForm({
        defaultValues: {
            titulo: '',
            descripcion: '',
            tipo_incidente: null,
            fecha_incidente: '',
            estado_incidente: null,
            gravedad: null,
            usuario: null,
            elemento: null,
            tipo_elemento: null
        }
    })

    const { data: incidente, isLoading: loadingIncidente } = useQuery({
        queryKey: ['incidente', recordKey],
        queryFn: ({ queryKey }) => getIncidente(queryKey[1]),
        onSuccess: (incidente) => {
            reset({
                titulo: incidente.titulo,
                descripcion: incidente.descripcion,
                tipo_incidente: incidente.tipo_incidente.id,
                fecha_incidente: incidente.fecha_incidente,
                estado_incidente: incidente.estado_incidente.id,
                gravedad: incidente.gravedad.id,
                usuario: incidente.usuario.id,
                elemento: incidente.elemento.id,
                tipo_elemento: incidente.elemento.tipo_elemento.id
            })

            setTipoElementoId(incidente.elemento.tipo_elemento.id)
        }
    })

    const { data: tipoIncidente, isLoading: loadingTipoIncidente } = useQuery({
        queryKey: ['tipos_de_incidentes'],
        queryFn: getTipoIncidentesOpcion
    })

    const { data: gravedadIncidente, isLoading: loadingGravedadIncidente } = useQuery({
        queryKey: ['gravedad'],
        queryFn: getGravedadesLikeOptions
    })

    const { data: tipoElemento, isLoading: loadingTipoElemento } = useQuery({
        queryKey: ['tipos_de_elementos'],
        queryFn: getTiposDeElementosLikeOptions
    })

    const [tipoElementoId, setTipoElementoId] = useState(null)
    const { data: elementos, isLoading: loadingElementos } = useQuery({
        queryKey: ['elementos', tipoElementoId],
        queryFn: () => getElementos(tipoElementoId),
        enabled: tipoElementoId != null ? true : false
    })

    const onSubmit = (data) => {
        const formData = {
            id: recordKey,
            data: data
        }
        put(formData)
        // console.log(data)
    }

    if (loadingIncidente) {
        return (
            <Spin />
        )
    }

    return (
        <Form layout='vertical' onFinish={handleSubmit(onSubmit)}>
            <Form.Item
                label='Titulo del incidente'
                validateStatus={errors.titulo ? 'error' : ''}
                help={errors.titulo ? errors.titulo.message : ''}
                required={true}
            >
                <Controller
                    name='titulo'
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: 'El incidente debe tener un titulo asociado'
                        }
                    }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder='Titulo'
                            size='large'
                        />
                    )}
                />
            </Form.Item>

            <Form.Item
                label='Fecha en que ocurrio el incidente'
                validateStatus={errors.fecha_incidente ? 'error' : ''}
                help={errors.fecha_incidente ? errors.fecha_incidente.message : ''}
                required={true}
            >
                <Controller
                    name='fecha_incidente'
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: 'El incidente debe tener una fecha asociada'
                        }
                    }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder='Fecha del incidente'
                            size='large'
                            type='date'
                        />
                    )}
                />
            </Form.Item>

            <Form.Item
                label='Tipo de incidente'
                validateStatus={errors.tipo_incidente ? 'error' : ''}
                help={errors.tipo_incidente ? errors.tipo_incidente.message : ''}
                required={true}
            >
                <Controller
                    name='tipo_incidente'
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: 'El incidente debe tener un tipo de incidente asoaciado'
                        }
                    }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            placeholder='Tipo de incidente'
                            options={tipoIncidente}
                            loading={loadingTipoIncidente}
                            disabled={loadingTipoIncidente}
                            size='large'
                        />
                    )}
                />
            </Form.Item>

            <Form.Item
                label='Gravedad del incidente'
                validateStatus={errors.gravedad ? 'error' : ''}
                help={errors.gravedad ? errors.gravedad.message : ''}
                required={true}
            >
                <Controller
                    name='gravedad'
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: 'El incidente debe tener un tipo de gravedad asociada'
                        }
                    }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            placeholder='Gravedad'
                            options={gravedadIncidente}
                            loading={loadingGravedadIncidente}
                            disabled={loadingGravedadIncidente}
                            size='large'
                        />
                    )}
                />
            </Form.Item>

            <Form.Item
                label='Tipo de elemento'
                validateStatus={errors.tipo_elemento ? 'error' : ''}
                help={errors.tipo_elemento ? errors.tipo_elemento.message : ''}
                required={true}
            >
                <Controller
                    name='tipo_elemento'
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: 'El incidente debe tener un tipo de elemento asoaciado'
                        }
                    }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            placeholder='Tipo de elemento'
                            options={tipoElemento}
                            loading={loadingTipoElemento}
                            disabled={loadingTipoElemento}
                            size='large'
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
                required={true}
            >
                <Controller
                    name="elemento"
                    control={control}
                    rules={{ required: 'El incidente debe tener un elemento asociado' }}
                    render={({ field }) => (
                        <Select
                            size='large'
                            {...field}
                            options={elementos}
                            loading={loadingTipoElemento}
                            disabled={loadingElementos}
                            placeholder='Elemento'
                        />
                    )}
                />
            </Form.Item>

            <Form.Item
                label='Descripcion del incidente (opcional)'
                validateStatus={errors.descripcion ? 'error' : ''}
                help={errors.descripcion ? errors.descripcion.message : ''}
                required={false}
            >
                <Controller
                    name='descripcion'
                    control={control}
                    rules={{
                        required: false
                    }}
                    render={({ field }) => (
                        <TextArea
                            {...field}
                            // onChange={(e) => setValue(e.target.value)}
                            placeholder="Descripcion del incidente"
                            size='large'
                        />
                    )}
                />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    icon={<EditOutlined />}
                    size="large"
                    color='primary'
                    variant='filled'
                    loading={putLoading}
                >
                    Actualizar incidente
                </Button>
            </Form.Item>
            
            {/* <pre>
                {JSON.stringify(watch(), null, 2)}
            </pre> */}
        </Form>
    )
}