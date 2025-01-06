// Estilos
import './Pozo.css'
// Iconos
import { EditOutlined, SearchOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';
// Hooks de react
import { useState, useEffect } from 'react';
// Componentes
import { Navbar } from '../../components/Navbar/Navbar';
import { DataGrid } from '../../components/DataGrid/DataGrid';
import { Spin, Button, Tag, Modal } from 'antd';
// Custom hooks y funcionalidades
import { checkLoged } from '../../store/checkLoged';
import { useModal } from './handleModal';
// React Query
import { useQuery } from '@tanstack/react-query';
import { getPozos } from './pozoQueryApi';
import { useDeletePozo } from './pozoQueryApi';
// Formularios
import { FormCreatePozo } from '../../components/FormCreatePozo/FormCreatePozo';
import { FormPutPozo } from '../../components/FormPutPozo/FormPutPozo';
import { useNavigate } from 'react-router-dom';
import { Progress } from 'antd';



const { confirm } = Modal;

const showConfirm = (record, onDelete) => {
    console.log("showConfirm called for record:", record);
    confirm({
        title: '¿Quieres eliminar este pozo?',
        icon: <ExclamationCircleFilled />,
        content: `Nombre: ${record.nombre_pozo}`,
        onOk() {
            console.log('Deleting record with key:', record.key);
            onDelete(record.key);
        },
        onCancel() {
            console.log('Cancel');
        },
    });
};


export const Pozo = () => {

    checkLoged()

    const { data: dataPozos, isLoading: loadingPozos, isError: errorPozos } = useQuery({
        queryKey: ['pozos'],
        queryFn: getPozos
    })

    const { mutate: deletePozo, isLoading: deleteLoading } = useDeletePozo()

    const { open: openModal1, handleStateModal: handleStateModal1 } = useModal()
    const { open: openModal2, handleStateModal: handleStateModal2 } = useModal()

    const [key, setKey] = useState(null)
    const [caudalTotal, setCaudalTotal] = useState(0);
    const [caudalDisponible, setCaudalDisponible] = useState(0);

    const handleCaudales = (key) => {
        navigate(`/configuracion/pozos/${key}/caudales`);
    };

    const navigate = useNavigate()
    const handleDetail = (key) => {
        navigate(`/configuracion/pozos/${key}`)
    };

    useEffect(() => {
        if (dataPozos) {
            const total = dataPozos.reduce((sum, pozo) => sum + (pozo.caudal || 0), 0);
            setCaudalTotal(total);

            // Asegúrate de que 'caudal_disponible' existe en tus datos
            const disponible = dataPozos.reduce((sum, pozo) => sum + (pozo.caudal_disponible || 0), 0);
            setCaudalDisponible(disponible);
        }
    }, [dataPozos]);
    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key'
        },
        {
            title: 'Nombre pozo',
            dataIndex: 'nombre_pozo',
            key: 'nombre_pozo'
        },
        {
            title: 'Tipo elemento',
            dataIndex: 'tipo_elemento',
            key: 'tipo_elemento'
        },
        {
            title: 'Caudal',
            dataIndex: 'caudal',
            key: 'caudal'
        },
        {
            title: 'Latitud',
            dataIndex: 'latitud',
            key: 'latitud'
        },

        {
            title: 'Longitud',
            dataIndex: 'longitud',
            key: 'longitud'
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            width: '10%',
            align: 'center', // Centrar el contenido horizontalmente
            key: 'estado',
            render: (text, record) => {
                const color = record.estado === 'En funcionamiento' ? 'green' : record.estado === 'En reparacion' ? 'orange' : 'red';
                return (
                    <Tag color={color} style={{ fontSize: 12 }}>
                        {record.estado}
                    </Tag>
                );
            }
        },
        {
            title: 'Nombre bateria',
            dataIndex: 'nombre_bateria',
            key: 'nombre_bateria'
        },
        {
            title: 'Nombre bomba',
            dataIndex: 'nombre_bomba',
            key: 'nombre_bomba'
        },
        {
            title: 'Opciones',
            dataIndex: 'operacion',
            key: 'operacion',
            width: '2%',
            render: (text, record) => (
                <div className='container-operaciones'>
                    <Button
                        onClick={() => handleDetail(record.key)}
                        icon={<SearchOutlined />}
                        className='boton-sin-estilo'
                    />
                    <Button
                        onClick={() => {
                            setKey(record.key)
                            handleStateModal2()
                        }}
                        icon={<EditOutlined style={{ color: '#1677FF' }} />}
                        className='boton-sin-estilo'
                    />
                    <Button
                        onClick={() => showConfirm(record, deletePozo)}
                        icon={<DeleteOutlined style={{ color: 'red' }} />}
                        className='boton-sin-estilo'
                        loading={deleteLoading}
                    />

                </div>
            ),
        }


    ]

    const footerCreate = () => {
        return (
            <div className='footer'>
                <div className='footer-buttons'>
                    <Button
                        color='primary'
                        variant='filled'
                        icon={<PlusOutlined />}
                        size='middle'
                        onClick={handleStateModal1}
                    >
                        CREAR
                    </Button>
                    <div className='row-counter'>
                        Total: {dataPozos ? dataPozos.length : 0}
                    </div>
                </div>
            </div>
        );
    };


    if (loadingPozos) {
        return (
            <div className='container-spin'>
                <Spin size='large' />
            </div>
        )
    }

    if (errorPozos) {
        <div className='container-copa'>
            <h1>error 404</h1>
        </div>
    }

    return (
        <div className='fullScreenPozo'>
            <Navbar />
            <div className='container-pozo'>
                {/* Sección de la barra de carga */}
                <div className='progress-section'>
                    <h3>Estado del Caudal</h3>
                    <div className='progress-container'>
                        <Progress
                            percent={caudalTotal > 0 ? (caudalDisponible / caudalTotal) * 100 : 0}
                            status={caudalDisponible > 0 ? 'active' : 'exception'}
                            strokeWidth={30} // Grosor de la barra
                            format={(percent) => `${percent.toFixed(2)}%`}
                        />
                    </div>
                    <div className='progress-info'>
                        <p>Caudal Disponible: <strong>{caudalDisponible} m³</strong></p>
                        <p>Caudal Máximo: <strong>{caudalTotal} m³</strong></p>
                    </div>
                </div>



                {/* Contenedor principal de la tabla */}
                <div className='container-table'>
                    <Modal
                        title='Crear'
                        open={openModal1}
                        onCancel={handleStateModal1}
                        footer={null}
                        centered
                    >
                        <FormCreatePozo />
                    </Modal>

                    <Modal
                        title='Editar'
                        open={openModal2}
                        onCancel={handleStateModal2}
                        footer={null}
                        centered
                    >
                        <FormPutPozo recordKey={key} />
                    </Modal>

                    <DataGrid data={dataPozos} columns={columns} footerCreate={footerCreate} />
                </div>
            </div>
        </div>
    );
}    