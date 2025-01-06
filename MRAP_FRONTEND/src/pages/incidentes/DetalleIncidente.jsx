import './Incidentes.css'
import { Descriptions, Spin, Divider, Input, Card, Button, Timeline } from "antd";
const { TextArea } = Input
import { getIncidente } from "./incidentesQueryAPI";
import { useQuery } from '@tanstack/react-query';
import { ClockCircleOutlined, CheckOutlined, ToolOutlined } from '@ant-design/icons';
import { getHistorial } from './operacionesQueryAPI';
import { useRealizarCambio } from './operacionesQueryAPI';

export const DetalleIncidente = ({ recordKey }) => {
    // const { id } = useParams();

    const { data: incidente, isLoading: loadingIncidente, isError: errorIncidente } = useQuery({
        queryKey: ['incidente', recordKey],
        queryFn: () => recordKey ? getIncidente(recordKey) : null,
    });

    const { data: historial, isLoading: loadingHistorial, isError: errorHistorial } = useQuery({
        queryKey: ['operaciones', recordKey],
        queryFn: () => getHistorial(recordKey)
    })

    const { mutate: trabajando, isLoading: loadingTrabajando } = useRealizarCambio()
    const { mutate: solucionado, isLoading: loadingSolucionado } = useRealizarCambio()

    if (loadingIncidente) return <Spin size="large" />;
    if (errorIncidente) return <p>Hubo un error al cargar el incidente.</p>;

    const items_incidente = [
        {
            label: 'ID',
            children: <strong>{incidente.id}</strong>,
            span: 4
        },
        {
            label: 'Titulo',
            children: <strong>{incidente.titulo}</strong>,
            span: 4
        },
        {
            label: 'Tipo de incidente',
            children: <strong>{incidente.tipo_incidente.descripcion_tipo_incidente}</strong>,
            span: 4
        },
        {
            label: 'Fecha del incidente',
            children: <strong>{incidente.fecha_incidente}</strong>,
            span: 4
        },
        {
            label: 'Fecha de registro',
            children: <strong>{incidente.fecha_de_registro}</strong>,
            span: 4
        },
        {
            label: 'Estado',
            children: <strong>{incidente.estado_incidente.descripcion_operacion}</strong>,
            span: 4
        },
        {
            label: 'Gravedad',
            children: <strong>{incidente.gravedad.descripcion}</strong>
        }
    ]

    return (
        <div>
            {
                loadingIncidente ? (
                    <Spin size="large" />
                ) :
                    recordKey ? (
                        <div className='container-detalles-incidente'>
                            <div className='container-detalles-incidente-descripcion'>
                                <Descriptions
                                    bordered
                                    items={items_incidente}
                                    style={{ width: '100%' }}
                                    size='small'
                                />

                                <Card title='Descripcion' style={{ width: '100%' }}>
                                    <TextArea rows={6} disabled={true} value={incidente.descripcion} style={{ resize: 'none' }} />
                                </Card>
                            </div>

                            <div className='container-detalles-historial'>
                                <Card title='Historial de cambios' style={{ width: '100%' }}>
                                    {
                                        !loadingHistorial ? (
                                            <Timeline
                                                items={[
                                                    {
                                                        color: 'red',
                                                        children: (
                                                            <>
                                                                <p>Se registra el incidente</p>
                                                                <p style={{ color: 'gray' }}>
                                                                    Se registra el dia <strong>{historial[0].fecha}</strong> por <strong>{historial[0].usuario.alias} (#{historial[0].usuario.id})</strong>
                                                                </p>
                                                            </>
                                                        ),
                                                    },
                                                    {
                                                        color: 'orange',
                                                        children: (
                                                            <>
                                                                <p>Se pasa a reparacion</p>
                                                                {
                                                                    historial[1] ? (
                                                                        <p style={{ color: 'gray' }}>Se inicia el dia <strong>{historial[1].fecha}</strong> por <strong>{historial[1].usuario.alias} (#{historial[0].usuario.id})</strong></p>
                                                                    ) : null
                                                                }
                                                            </>
                                                        )
                                                    },
                                                    {
                                                        color: 'green',
                                                        children: (
                                                            <>
                                                                <p>Incidente solucionado</p>
                                                                {
                                                                    historial[2] ? (
                                                                        <p style={{ color: 'gray' }}>Se finaliza el dia <strong>{historial[2].fecha}</strong> por <strong>{historial[1].usuario.alias} (#{historial[0].usuario.id})</strong></p>
                                                                    ) : null
                                                                }
                                                            </>
                                                        )
                                                    }
                                                ]}
                                            />
                                        ) : (
                                            <Spin size='large' />
                                        )
                                    }
                                    {
                                        errorHistorial ? (
                                            <p>{errorHistorial}</p>
                                        ) : null
                                    }
                                </Card>

                                <div className='container-botones-operaciones'>
                                    <Button
                                        color='primary'
                                        variant='filled'
                                        size='large'
                                        icon={<ClockCircleOutlined />}
                                        disabled={historial[0] ? true : false}
                                    >
                                        Registrado
                                    </Button>

                                    <Button
                                        color='primary'
                                        variant='filled'
                                        size='large'
                                        icon={<ToolOutlined />}
                                        disabled={historial[1] ? true : false}
                                        loading={loadingTrabajando}
                                        onClick={() => trabajando({ incidente_id: recordKey, operacion_id: 2 })}
                                    >
                                        Trabajando
                                    </Button>

                                    <Button
                                        color='primary'
                                        variant='filled'
                                        size='large'
                                        icon={<CheckOutlined />}
                                        disabled={historial[2] ? true : false}
                                        onClick={() => solucionado({ incidente_id: recordKey, operacion_id: 3 })}
                                        loading={loadingSolucionado}
                                    >
                                        Solucionado
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : null
            }
        </div>
    );
};