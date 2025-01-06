import { Input, Spin, Select, Button, Form } from "antd";
import { FullscreenExitOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query"
import { useForm, Controller } from 'react-hook-form';
import { getPeriodicidadesLikeOptions } from "../../pages/periodicidades/periodicidadesQueryAPI";
import { getTiposDeElementosLikeOptions } from "../../pages/punto_de_control/puntoDeControlQueryApi";
import { getAnalisisById } from "../../pages/analisis/analisisQueryAPI";
import { usePostAnalisisPeriodicidad } from "../../pages/analisis/analisisQueryAPI";

export const FormAsignarPeriodicidad = ({ recordKey: analisisId }) => {
    const { control, handleSubmit, setValue, formState: { errors } } = useForm();

    const { data: periodicidades, isLoading: loadingPeriodicidades, isError: errorPeriodicidades } = useQuery({
        queryKey: ['periodos'],
        queryFn: getPeriodicidadesLikeOptions
    })

    const { data: tiposDeElementos, isLoading: loadingTiposDeElementos, isError: errorTiposDeElementos } = useQuery({
        queryKey: ['tipos_de_elementos'],
        queryFn: getTiposDeElementosLikeOptions
    })

    const { data: analisis, isLoading: loadingAnalisis, isError: errorAnalisis } = useQuery({
        queryKey: ['analisis', analisisId],
        queryFn: () => getAnalisisById(analisisId)
    })

    const { mutate: post, isLoading: loadingPost, isError: errorPost } = usePostAnalisisPeriodicidad()

    const onSubmit = (data) => {
        data = {
            tipo_elemento: data.tipo_elemento,
            periodo: data.periodo,
            analisis: analisisId
        }
        // console.log(data)
        post(data)
    };

    return (
        <Form layout='vertical' onFinish={handleSubmit(onSubmit)}>

            <Form.Item
                label='Analisis'
                validateStatus={errors.analisis ? 'error' : ''}
                help={errors.analisis ? errors.analisis.message : ''}
                required={true}
            >
                <Controller
                    name='analisis'
                    control={control}
                    rules={{
                        required: {
                            value: analisis ? false : true,
                            message: 'Para asignar una periodicidad se debe elegir un analisis'
                        }
                    }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            placeholder='Analisis'
                            size="large"
                            disabled
                            value={analisis ? analisis.nombre : 'Cargando'}
                            loading={loadingAnalisis}
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
                            message: 'La periodicidad debe asignarse a un tipo de elemento'
                        }
                    }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            placeholder='Tipo de elemento'
                            size='large'
                            options={tiposDeElementos}
                            loading={loadingTiposDeElementos}
                            disabled={loadingTiposDeElementos}
                        />
                    )}
                />
            </Form.Item>

            <Form.Item
                label='Perido del analisis'
                validateStatus={errors.periodo ? 'error' : ''}
                help={errors.periodo ? errors.periodo.message : ''}
                required={true}
            >
                <Controller
                    name='periodo'
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: 'Se debe asignar una periodicidad al analisis del tipo de elemento'
                        }
                    }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            placeholder='Periodo'
                            size='large'
                            options={periodicidades}
                            loading={loadingPeriodicidades}
                            disabled={loadingPeriodicidades}
                        />
                    )}
                />
            </Form.Item>

            <Form.Item>
                <Button
                    htmlType="submit"
                    color='primary'
                    variant='filled'
                    size='large'
                    icon={<FullscreenExitOutlined />}
                    loading={loadingPost}
                >
                    ASIGNAR
                </Button>
            </Form.Item>
        </Form>
    )
}