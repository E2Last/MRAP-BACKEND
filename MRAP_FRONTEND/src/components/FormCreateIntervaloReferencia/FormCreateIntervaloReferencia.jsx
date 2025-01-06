import React, { useState } from 'react';
import './FormCreateIntervaloRefernecia.css'
import { useForm, Controller } from 'react-hook-form';
import { Input, Select, Form, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { usePostIntervalo } from '../../pages/analisis_intervalo_referencia/analisis_intervalo_referenciaQueryAPI';
import { getUnidadesLikeOptiones } from '../../pages/unidades/unidadesQueryAPI';
import { getTiposDeElementosLikeOptions } from '../../pages/punto_de_control/puntoDeControlQueryApi';
import { getElementos } from '../../pages/punto_de_control/puntoDeControlQueryApi';
import { getParametros } from '../../pages/parametro/parametroQueryAPI';



export const FormCreateIntervaloReferencia = ({ onClose, onSuccess }) => {
    const { mutate: postIntervalo, isLoading: postLoading } = usePostIntervalo();
    const { data: parametros, isLoading, isError } = useQuery(['parametros'], getParametros);

    const { data: dataTiposElementos, isLoading: loadingTiposDeElementos } = useQuery({
        queryKey: ['tipos_de_elementos'],
        queryFn: getTiposDeElementosLikeOptions,
    });
    const [tipoElementoId, setTipoElementoId] = useState(null);
    const { data: dataElementos, isLoading: loadingElementos } = useQuery({
        queryKey: ['elementos', tipoElementoId],
        queryFn: () => getElementos(tipoElementoId),
        enabled: tipoElementoId != null ? true : false
    });

    const { data: unidades, isLoading: loadingUnidades, isError: errorUnidades } = useQuery({
        queryKey: ['unidades'],
        queryFn: getUnidadesLikeOptiones,
    });

    const { handleSubmit, control, formState: { errors }, watch } = useForm({
        defaultValues: {
            tipo_elemento: '',
            parametro: '',
            muy_bajo: '',
            bajo: '',
            muy_alto: '',
            muy_bajo_regex: '',
            bajo_regex: '',
            alto_regex: '',
            muy_alto_regex: '',
        }
    });

    const onSubmit = (data) => {
        const formattedValues = {
            tipo_elemento: data.tipo_elemento,
            parametro: data.parametro,
            muy_bajo: data.muy_bajo,
            bajo: data.bajo,
            alto: data.alto,
            muy_alto: data.muy_alto,
            muy_bajo_regex: data.muy_bajo_regex,
            bajo_regex: data.bajo_regex,
            alto_regex: data.alto_regex,
            muy_alto_regex: data.muy_alto_regex,
        };
        postIntervalo(formattedValues);
        if (onSuccess) onSuccess(); // Acción después de la creación exitosa

    };

    return (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <div className='container-inputs-intervalo-referencia'>
                {/* Tipo de Elemento */}
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

                {/* Parámetro */}
                <Form.Item
                    label="Parámetro"
                    validateStatus={errors.parametro ? 'error' : ''}
                    help={errors.parametro ? errors.parametro.message : ''}
                    required={true}
                >
                    <Controller
                        name="parametro"
                        control={control}
                        rules={{ required: 'El parámetro es obligatorio' }}
                        defaultValue={null}  // Esto asegura que no haya un valor predeterminado, permitiendo que el placeholder se muestre
                        render={({ field }) => (
                            <Select
                                size="large"
                                {...field}
                                placeholder='Parámetro'
                                value={field.value || undefined} // Asegúrate de que sea undefined cuando no haya valor seleccionado
                                options={parametros?.map(param => ({
                                    label: `${param.nombre_parametro} | ${param.nombre_unidad}`,
                                    value: param.key,
                                }))}
                                loading={isLoading}
                                disabled={isLoading || isError}
                            />
                        )}
                    />
                </Form.Item>


                {/* Muy Bajo y Muy Bajo Regex en una sola fila */}
                <div className="input-group">
                    <Form.Item
                        label="Muy Bajo"
                        validateStatus={errors.muy_bajo ? 'error' : ''}
                        help={errors.muy_bajo ? errors.muy_bajo.message : ''}
                    >
                        <Controller
                            name="muy_bajo"
                            control={control}
                            render={({ field }) => <Input {...field} size="large" />}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Muy Bajo Regex"
                        validateStatus={errors.muy_bajo_regex ? 'error' : ''}
                        help={errors.muy_bajo_regex ? errors.muy_bajo_regex.message : ''}
                    >
                        <Controller
                            name="muy_bajo_regex"
                            control={control}
                            render={({ field }) => <Input {...field} size="large" />}
                        />
                    </Form.Item>
                </div>

                {/* Bajo y Bajo Regex en una sola fila */}
                <div className="input-group">
                    <Form.Item
                        label="Bajo"
                        validateStatus={errors.bajo ? 'error' : ''}
                        help={errors.bajo ? errors.bajo.message : ''}
                    >
                        <Controller
                            name="bajo"
                            control={control}
                            render={({ field }) => <Input {...field} size="large" />}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Bajo Regex"
                        validateStatus={errors.bajo_regex ? 'error' : ''}
                        help={errors.bajo_regex ? errors.bajo_regex.message : ''}
                    >
                        <Controller
                            name="bajo_regex"
                            control={control}
                            render={({ field }) => <Input {...field} size="large" />}
                        />
                    </Form.Item>
                </div>

                {/* Muy Alto y Muy Alto Regex en una sola fila */}
                <div className="input-group">
                    <Form.Item
                        label="Muy Alto"
                        validateStatus={errors.muy_alto ? 'error' : ''}
                        help={errors.muy_alto ? errors.muy_alto.message : ''}
                    >
                        <Controller
                            name="muy_alto"
                            control={control}
                            render={({ field }) => <Input {...field} size="large" />}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Muy Alto Regex"
                        validateStatus={errors.muy_alto_regex ? 'error' : ''}
                        help={errors.muy_alto_regex ? errors.muy_alto_regex.message : ''}
                    >
                        <Controller
                            name="muy_alto_regex"
                            control={control}
                            render={({ field }) => <Input {...field} size="large" />}
                        />
                    </Form.Item>
                </div>
                {/* Alto y Alto Regex en una sola fila */}
                <div className="input-group">
                    <Form.Item
                        label="Alto"
                        validateStatus={errors.alto ? 'error' : ''}
                        help={errors.alto ? errors.alto.message : ''}
                    >
                        <Controller
                            name="alto"
                            control={control}
                            render={({ field }) => <Input {...field} size="large" />}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Alto Regex"
                        validateStatus={errors.alto_regex ? 'error' : ''}
                        help={errors.alto_regex ? errors.alto_regex.message : ''}
                    >
                        <Controller
                            name="alto_regex"
                            control={control}
                            render={({ field }) => <Input {...field} size="large" />}
                        />
                    </Form.Item>
                </div>


            </div>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                    size="large"
                    loading={postLoading}
                >
                    Crear Intervalo
                </Button>
            </Form.Item>
        </Form>
    );
};
