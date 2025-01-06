import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { usePostIntervalo } from '../../pages/analisis_intervalo_referencia/analisis_intervalo_referenciaQueryAPI';
import { getElementos } from '../../pages/punto_de_control/puntoDeControlQueryApi';
import { getTiposDeElementosLikeOptions } from '../../pages/punto_de_control/puntoDeControlQueryApi';


export const FormCreateIntervalo = () => {
    const { mutate: createIntervalo, isLoading } = usePostIntervalo();

    const { handleSubmit, control, formState: { errors } } = useForm();

    const onFinish = (values) => {
        createIntervalo(values);
    };

    const { data: dataTiposElementos, isLoading: loadingTiposElementos } = useQuery({
        queryKey: ['tipos_de_elementos'],
        queryFn: getTiposDeElementosLikeOptions
    });

    const [tipoElementoId, setTipoElementoId] = useState(null)
    const { data: dataElementos, isLoading: loadingElementos } = useQuery({
        queryKey: ['elementos', tipoElementoId],
        queryFn: () => getElementos(tipoElementoId),
        enabled: tipoElementoId != null ? true : false
    })

    return (
        <Form layout="vertical" onFinish={handleSubmit(onFinish)}>
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
                            // loading={loadingTiposDeElementos} // Muestra un spinner si está cargando
                            // disabled={loadingTiposDeElementos} // Desactiva el selector si está cargando
                            onSelect={(value) => {
                                setTipoElementoId(value)
                            }}
                        />
                    )}
                />
            </Form.Item>

            <Form.Item
                label="Parámetro"
                validateStatus={errors.parametro ? 'error' : ''}
                help={errors.parametro ? errors.parametro.message : ''}
            >
                <Controller
                    name="parametro"
                    control={control}
                    rules={{ required: 'Por favor ingresa el parámetro' }}
                    render={({ field }) => <Input {...field} />}
                />
            </Form.Item>

            <Form.Item
                label="Muy Bajo"
                validateStatus={errors.muyBajo ? 'error' : ''}
                help={errors.muyBajo ? errors.muyBajo.message : ''}
            >
                <Controller
                    name="muyBajo"
                    control={control}
                    rules={{ required: 'Por favor ingresa el valor para Muy Bajo' }}
                    render={({ field }) => <Input {...field} />}
                />
            </Form.Item>

            <Form.Item
                label="Bajo"
                validateStatus={errors.bajo ? 'error' : ''}
                help={errors.bajo ? errors.bajo.message : ''}
            >
                <Controller
                    name="bajo"
                    control={control}
                    rules={{ required: 'Por favor ingresa el valor para Bajo' }}
                    render={({ field }) => <Input {...field} />}
                />
            </Form.Item>

            <Form.Item
                label="Alto"
                validateStatus={errors.alto ? 'error' : ''}
                help={errors.alto ? errors.alto.message : ''}
            >
                <Controller
                    name="alto"
                    control={control}
                    rules={{ required: 'Por favor ingresa el valor para Alto' }}
                    render={({ field }) => <Input {...field} />}
                />
            </Form.Item>

            <Form.Item
                label="Muy Alto"
                validateStatus={errors.muyAlto ? 'error' : ''}
                help={errors.muyAlto ? errors.muyAlto.message : ''}
            >
                <Controller
                    name="muyAlto"
                    control={control}
                    rules={{ required: 'Por favor ingresa el valor para Muy Alto' }}
                    render={({ field }) => <Input {...field} />}
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    Crear Intervalo
                </Button>
            </Form.Item>
        </Form>
    );
};
