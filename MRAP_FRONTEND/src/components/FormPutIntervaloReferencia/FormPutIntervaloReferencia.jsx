import React, { useState, useEffect } from 'react';
import './FormPutIntervaloReferencia.css';
import { useForm, Controller } from 'react-hook-form';
import { Input, Select, Form, Button } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useGetIntervalo, usePutIntervalo } from '../../pages/analisis_intervalo_referencia/analisis_intervalo_referenciaQueryAPI';
import { getTiposDeElementosLikeOptions, getElementos } from '../../pages/punto_de_control/puntoDeControlQueryApi';
import { getParametros } from '../../pages/parametro/parametroQueryAPI';

export const FormPutIntervaloReferencia = ({ onClose, onSuccess, recordKey }) => {
    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [tipoElementoId, setTipoElementoId] = useState(null);

    // Query para obtener los datos de la fila seleccionada
    const { data: intervaloReferencia, isLoading: loadingIntervalo } = useGetIntervalo(recordKey);

    // Query para obtener parámetros
    const { data: parametros, isLoading: loadingParametros, isError: errorParametros } = useQuery(['parametros'], getParametros);

    // Query para obtener tipos de elementos
    const { data: dataTiposElementos, isLoading: loadingTiposDeElementos } = useQuery({
        queryKey: ['tipos_de_elementos'],
        queryFn: getTiposDeElementosLikeOptions,
    });

    // Query para obtener elementos asociados al tipo seleccionado
    const { data: dataElementos, isLoading: loadingElementos } = useQuery({
        queryKey: ['elementos', tipoElementoId],
        queryFn: () => getElementos(tipoElementoId),
        enabled: !!tipoElementoId,
    });

    // Mutación para actualizar datos
    const { mutate: putIntervalo, isLoading: putLoading } = usePutIntervalo();

    // Efecto para cargar los valores iniciales en el formulario
    useEffect(() => {
        if (intervaloReferencia) {
            reset({
                tipo_elemento: intervaloReferencia.tipo_elemento.id || '',
                parametro: intervaloReferencia.parametro.id || '',
                muy_bajo: intervaloReferencia.muy_bajo || '',
                bajo: intervaloReferencia.bajo || '',
                alto: intervaloReferencia.alto || '',
                muy_alto: intervaloReferencia.muy_alto || '',
                muy_bajo_regex: intervaloReferencia.muy_bajo_regex || '',
                bajo_regex: intervaloReferencia.bajo_regex || '',
                alto_regex: intervaloReferencia.alto_regex || '',
                muy_alto_regex: intervaloReferencia.muy_alto_regex || '',
            });
            setTipoElementoId(intervaloReferencia.tipo_elemento || null);
        }
    }, [intervaloReferencia, reset]);

    // Handler para el envío del formulario
    const onSubmit = (data) => {
        putIntervalo({ id: recordKey, data }, {
            onSuccess: () => {
                if (onSuccess) onSuccess();
                if (onClose) onClose();
            },
        });
    };

    return (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <div className='container-inputs-intervalo-referencia'>
                <Form.Item
                    label="Tipo de elemento"
                    validateStatus={errors.tipo_elemento ? 'error' : ''}
                    help={errors.tipo_elemento ? errors.tipo_elemento.message : ''}
                >
                    <Controller
                        name='tipo_elemento'
                        control={control}
                        rules={{ required: "El punto de control debe tener un tipo de elemento asociado" }}
                        render={({ field }) => (
                            <Select
                                size='large'
                                {...field}
                                placeholder='Tipo de elemento'
                                value={field.value || undefined}
                                options={dataTiposElementos}
                                loading={loadingTiposDeElementos}
                                disabled={loadingTiposDeElementos}
                                onSelect={(value) => setTipoElementoId(value)}
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
                        rules={{ required: 'El parámetro es obligatorio' }}
                        render={({ field }) => (
                            <Select
                                size="large"
                                {...field}
                                placeholder='Parámetro'
                                value={field.value || undefined}
                                options={parametros?.map(param => ({
                                    label: `${param.nombre_parametro} | ${param.nombre_unidad}`,
                                    value: param.key,
                                }))}
                                loading={loadingParametros}
                                disabled={loadingParametros || errorParametros}
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item label="Muy Bajo">
                    <Controller
                        name="muy_bajo"
                        control={control}
                        render={({ field }) => <Input {...field} size="large" />}
                    />
                </Form.Item>
                <Form.Item label="Bajo">
                    <Controller
                        name="bajo"
                        control={control}
                        render={({ field }) => <Input {...field} size="large" />}
                    />
                </Form.Item>
                <Form.Item label="Muy Bajo Regex">
                    <Controller
                        name="muy_bajo_regex"
                        control={control}
                        render={({ field }) => <Input {...field} size="large" />}
                    />
                </Form.Item>
                <Form.Item label="Bajo Regex">
                    <Controller
                        name="bajo_regex"
                        control={control}
                        render={({ field }) => <Input {...field} size="large" />}
                    />
                </Form.Item>
                <Form.Item label="Muy Alto">
                    <Controller
                        name="muy_alto"
                        control={control}
                        render={({ field }) => <Input {...field} size="large" />}
                    />
                </Form.Item>
                <Form.Item label="Alto">
                    <Controller
                        name="alto"
                        control={control}
                        render={({ field }) => <Input {...field} size="large" />}
                    />
                </Form.Item>
                <Form.Item label="Muy Alto Regex">
                    <Controller
                        name="muy_alto_regex"
                        control={control}
                        render={({ field }) => <Input {...field} size="large" />}
                    />
                </Form.Item>
                <Form.Item label="Alto Regex">
                    <Controller
                        name="alto_regex"
                        control={control}
                        render={({ field }) => <Input {...field} size="large" />}
                    />
                </Form.Item>
            </div>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    size="large"
                    loading={putLoading}
                >
                    Guardar Cambios
                </Button>
            </Form.Item>
        </Form>
    );
};
