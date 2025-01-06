// Estilos
import './PuntoInterno.css'
// Iconos
import { EditOutlined, SearchOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';
// Hooks de react
import { useState } from 'react';
// Componentes
import { Navbar } from '../../components/Navbar/Navbar';
import { DataGrid } from '../../components/DataGrid/DataGrid';
import { Spin, Button, Tag, Modal } from 'antd';
// Custom hooks y funcionalidades
import { checkLoged } from '../../store/checkLoged';
import { useModal } from './handleModal';
// React Query
import { useQuery } from '@tanstack/react-query';
import { getPuntosInternos } from './PuntoInternoQueryAPI';
import { useDeletePuntoInterno } from './PuntoInternoQueryAPI';
// Formularios
import { FormCreatePuntoInterno } from '../../components/FormCreatePuntoInterno/FormCreatePuntoInterno';
import { FormPutPuntoInterno } from '../../components/FormPutPuntoInterno/FormPutPuntoInterno';
import { useNavigate } from 'react-router-dom';

const { confirm } = Modal;

const showConfirm = (record, onDelete) => {
  console.log("showConfirm called for record:", record);
  confirm({
    title: '¿Quieres eliminar este punto interno?',
    icon: <ExclamationCircleFilled />,
    content: `Nombre: ${record.nombre_punto_interno}`,
    onOk() {
      console.log('Deleting record with key:', record.key);
      onDelete(record.key);
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};


export const PuntoInterno = () => {
    checkLoged()

    const { data: dataPuntosInternos, isLoading: loadingPuntosInternos, isError: errorPuntosInternos } = useQuery({
        queryKey: ['puntos_internos'],
        queryFn: getPuntosInternos
    })

    const { mutate: deletePuntoInterno, isLoading: loadingdDelete } = useDeletePuntoInterno()

    const [key, setKey] = useState(null)

    const navigate = useNavigate()
    const handleDetail = (key) => {
        //console.log(`Ver detalles de la cisterna con ID: ${key}`);
        navigate(`/configuracion/punto-interno/${key}`)
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
            width: '3%',
        },
        {
            title: 'Nombre punto interno',
            dataIndex: 'nombre_punto_interno',
            key: 'nombre_punto_interno'
        },
        {
            title: 'Tipo elemento',
            dataIndex: 'tipo_elemento',
            key: 'tipo_elemento'
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            align: 'center', // Centrar el contenido horizontalmente
            width: '8%',
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
            title: 'Opciones',
            dataIndex: 'operacion',
            key: 'operacion',
            width: '2%',
            render: (text, record) => (
                <div className='container-operaciones'>
                    <Button
                        onClick={() => handleDetail (record.key)}
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
                        onClick={() => showConfirm(record, deletePuntoInterno)}
                        icon={<DeleteOutlined style={{ color: 'red' }} />}
                        className='boton-sin-estilo'
                        loading={loadingdDelete}
                    />
                </div>
            ),
        }
    ]

    const { open: openModal1, handleStateModal: handleStateModal1 } = useModal()
    const { open: openModal2, handleStateModal: handleStateModal2 } = useModal()

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
                        Total: {dataPuntosInternos ? dataPuntosInternos.length : 0}
                    </div>
                </div>
            </div>
        );
    };
    

    if (loadingPuntosInternos) {
        return (
            <div className='container-spin'>
                <Spin size='large' />
            </div>
        )
    }

    if (errorPuntosInternos) {
        <div className='container-copa'>
            <h1>error 404</h1>
        </div>
    }

    return (
        <div className='fullScreenPuntoInterno'>
            <Navbar />
            <div className='container-PuntoInterno'>
                <div className='container-table'>

                        <Modal
                            title='Crear'
                            open={openModal1}
                            onCancel={handleStateModal1}
                            footer={null}
                            centered
                        >
                            <FormCreatePuntoInterno />
                        </Modal>

                        <Modal
                            title='Editar modal'
                            open={openModal2}
                            onCancel={handleStateModal2}
                            footer={null}
                            centered
                        >
                            <FormPutPuntoInterno recordKey={key}/>
                        </Modal>

                        <DataGrid data={dataPuntosInternos} columns={columns} footerCreate={footerCreate} />

                </div>
            </div>
        </div>
    )
}