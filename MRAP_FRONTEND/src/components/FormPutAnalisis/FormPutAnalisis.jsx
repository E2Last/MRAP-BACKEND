import './FormPutAnalisis.css';
import React, { useState, useEffect } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Input, Transfer, Button, Form, Spin, Select } from "antd";
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { parametrosAsignadosForTransfer } from '../../pages/analisis/analisisQueryAPI';
import { usePutAnalisis } from '../../pages/analisis/analisisQueryAPI';
import { getTipoControlLikeOptions } from '../../pages/controles/controlesQueryAPI';

export const FormPutAnalisis = ({ recordKey }) => {
    const { mutate: putAnalisis, isLoading: putLoading } = usePutAnalisis();

    const [parametrosTotales, setParametrosTotales] = useState([]);
    const [parametrosAsociados, setParametrosAsociados] = useState([]);
    const [nombre, setNombre] = useState('');

    const { data: tipos_control, isLoading: loading_tipos_control, isError: error_tipos_control } = useQuery({
        queryKey: ['tipos_de_control'],
        queryFn: getTipoControlLikeOptions
    })

    const { data: analisis, isLoading: loadingAnalisis } = useQuery({
        queryKey: ['analisis', recordKey],
        queryFn: () => parametrosAsignadosForTransfer(recordKey),
        onSuccess: (analisis) => {
            if (analisis) {
                setParametrosTotales(analisis.parametros_totales);
                setParametrosAsociados(analisis.parametros_asociados);
                setNombre(analisis.nombre);
                // Aquí usamos `reset` de react-hook-form para actualizar el formulario
                reset({
                    nombre: analisis.nombre,
                    parametros: analisis.parametros_asociados,
                });
            }
        }
    });

    const { control, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm({
        defaultValues: {
            nombre: '', // El valor predeterminado se establecerá después en onSuccess
            parametros: [] // El valor predeterminado se establecerá después en onSuccess
        }
    });

    const handleChange = (newTargetKeys) => {
        setParametrosAsociados(newTargetKeys);
        setValue('parametros', newTargetKeys); // Actualizar valores del formulario
    };

    const onSubmit = (data) => {
        const payload = {
            id: recordKey,
            data: { ...data, parametros: parametrosAsociados } // Enviar parámetros asociados correctamente
        };
        putAnalisis(payload);
    };

    return (
        ((!loadingAnalisis) && (analisis.parametros_asociados) && (analisis.parametros_totales)) ? (
            <Form layout='vertical' onFinish={handleSubmit(onSubmit)}>
                {/* Campo de nombre */}
                <Form.Item
                    label='Nombre'
                    validateStatus={errors.nombre ? 'error' : ''}
                    help={errors.nombre ? errors.nombre.message : ''}
                >
                    <Controller
                        name='nombre'
                        control={control}
                        rules={{
                            required: {
                                value: nombre ? false : true,
                                message: 'El análisis debe tener un nombre identificatorio asignado'
                            }
                        }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Nombre del análisis"
                                size='large'
                                style={{ width: 400 }}
                                defaultValue={nombre || 'Cargando nombre...'}
                            />
                        )}
                    />
                </Form.Item>

                {/* Campo tipo de control */}
                <Form.Item
                    label='Tipo de control'
                    validateStatus={errors.tipo_control ? 'error' : ''}
                    help={errors.tipo_control ? errors.tipo_control.message : ''}
                >
                    <Controller
                        name='tipo_control'
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: 'El analisis debe tener un tipo de control asociado'
                            }
                        }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                placeholder='Tipo de control'
                                size='large'
                                loading={loading_tipos_control}
                                disabled={loading_tipos_control}
                                options={tipos_control}
                            />
                        )}
                    />
                </Form.Item>

                {/* Transfer para parámetros */}
                <Form.Item
                    label='Parámetros de análisis'
                    required={true}
                >
                    <Transfer
                        listStyle={{ width: '500px', height: '400px' }}
                        dataSource={parametrosTotales || []} // Asegura que `dataSource` tenga un valor por defecto
                        targetKeys={parametrosAsociados || []} // Usa el estado sincronizado
                        onChange={handleChange}
                        showSearch
                        filterOption={(inputValue, option) =>
                            option.title.toLowerCase().includes(inputValue.toLowerCase()) ||
                            option.description.toLowerCase().includes(inputValue.toLowerCase())
                        }
                        render={(item) => item.title}
                    />
                </Form.Item>

                {/* Botón de guardar */}
                <Form.Item>
                    <Button
                        htmlType="submit"
                        color='primary'
                        variant='filled'
                        size='large'
                        loading={putLoading}
                        icon={<EditOutlined />}
                    >
                        Guardar
                    </Button>
                </Form.Item>

                <pre>
                    {JSON.stringify(watch(), null, 2)}
                </pre>
            </Form>
        ) : (
            <Spin size='large' />
        )

    );
};
