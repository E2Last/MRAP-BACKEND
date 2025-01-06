// Incidentes.js
import './Incidentes.css';
import { WarningFilled, CheckCircleFilled, EditOutlined, DeleteOutlined, CloseCircleFilled, SearchOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { useState } from 'react';
import { Navbar } from '../../components/Navbar/Navbar';
import { DataGrid } from '../../components/DataGrid/DataGrid';
import { Spin, Button, Modal, Select } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getIncidentes } from './incidentesQueryAPI';
import { useModal } from './handleModal';
import { checkLoged } from '../../store/checkLoged';
import { FormCreateIncidente } from '../../components/FormCreateIncidente/FormCreateIncidente';
import { FormPutIncidente } from '../../components/FormPutIncidente/FormPutIncidente';
import { useDeleteIncidente } from './incidentesQueryAPI';
import { useNavigate } from 'react-router-dom';
import { DetalleIncidente } from './DetalleIncidente';

export const Incidentes_Media = () => {

    checkLoged()

    const navigate = useNavigate()

    const { open: openModal1, handleStateModal: handleStateModal1 } = useModal();
    const { open: openModal2, handleStateModal: handleStateModal2 } = useModal();
    const { open: openModal3, handleStateModal: handleStateModal3 } = useModal()

    const [key, setKey] = useState(null)

    const { data: incidentes, isLoading: loading, isError: error } = useQuery({
        queryKey: ['incidentes'],
        queryFn: getIncidentes
    })

    const { mutate: deleteIncidente, isLoading: loadingDelete } = useDeleteIncidente()
    const incidentesMedia = incidentes?.filter(incidente => incidente.gravedad === 'Media') || [];
    
    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
            width: 1
        },
        {
            title: 'Titulo',
            dataIndex: 'titulo',
            key: 'titulo'
        },
        {
            title: 'Estado',
            dataIndex: 'descripcion_operacion',
            key: 'descripcion_operacion',
            width: '2%',
        },
        {
            title: 'Elemento habilitado',
            dataIndex: 'elemento_inhabilitado',
            align: 'center', // Centrar el contenido horizontalmente
            width: '2%',
            key: 'elemento_inhabilitado',
            render: (text, record) => {
                const color = record.elemento_inhabilitado === true ? '#D32F2F' : '#B7EB8F'
                if (record.elemento_inhabilitado == true) {
                    return (
                        <CloseCircleFilled style={{ color, fontSize: 20 }} />
                    )
                } else {
                    return (
                        <CheckCircleFilled style={{ color, fontSize: 20 }} />
                    )
                }
            },
        },
        {
            title: 'Gravedad',
            dataIndex: 'gravedad',
            align: 'center', // Centrar el contenido horizontalmente
            width: '2%',
            key: 'gravedad',
            render: (text, record) => {
                const color = record.gravedad === 'Baja' ? '#FFC107' : record.gravedad === 'Media' ? '#ff845d' : '#D32F2F';
                return (
                    <Tag color={color} style={{ fontSize: 12 }}>
                        <strong>{record.gravedad}</strong>
                    </Tag>
                );
            }
        },
        {
            title: 'Fecha de registro',
            dataIndex: 'fecha_de_registro',
            align: 'center', // Centrar el contenido horizontalmente
            width: '7%',
            key: 'fecha_de_registro'
        },
        {
            title: 'Elemento',
            dataIndex: 'elemento',
            key: 'elemento'
        },
        {
            title: 'Tipo de elemento',
            dataIndex: 'tipo_elemento',
            key: 'tipo_elemento'
        },
        {
            title: 'Acciones',
            dataIndex: 'operacion',
            key: 'operacion',
            render: (text, record) => (
                <div className='container-operaciones'>
                    <Button
                        // onClick={() => navigate(`/incidentes/${record.key}`)}
                        onClick={() => {
                            setKey(record.key)
                            // console.log(key)
                            handleStateModal3()
                        }}
                        icon={<SearchOutlined />}
                        className='boton-sin-estilo'
                    />
                    <Button
                        onClick={() => {
                            setKey(record.key);
                            handleStateModal2();
                        }}
                        icon={<EditOutlined style={{ color: '#1677FF' }} />}
                        className='boton-sin-estilo'
                    />
                    <Button
                        onClick={() => deleteIncidente(record.key)}
                        icon={<DeleteOutlined style={{ color: 'red' }} />}
                        className='boton-sin-estilo'
                        loading={loadingDelete}
                    />
                </div>
            ),
        }
    ]

    const footerCreate = () => (
        <div className='footer'>
            <Button
                color='primary'
                variant='filled'
                // icon={<PlusOutlined />}
                size='large'
                onClick={handleStateModal1}
            >
                CARGAR INCIDENTE
            </Button>
        </div>
    );

    if (loading) {
        return (
            <Spin size='large' />
        )
    }

    return (
        <div className='fullScreenIncidentes'>
            <Navbar />
            <div className='container-incidentes'>
                {/* Contenedor de la tabla */}
                <div className='container-table'>
                    <div className='tabla'>
                        <Modal
                            title='Crear Incidente'
                            open={openModal1}
                            onCancel={handleStateModal1}
                            footer={null}
                            centered
                        >
                            <FormCreateIncidente />
                        </Modal>

                        <Modal
                            title='Editar Incidente'
                            open={openModal2}
                            onCancel={handleStateModal2}
                            footer={null}
                            centered
                        >
                            <FormPutIncidente recordKey={key} />
                        </Modal>

                        <Modal
                            title={`Detalle del incidente ${key}`}
                            open={openModal3}
                            onCancel={handleStateModal3}
                            footer={null}
                            centered
                            width={'50%'}
                        >
                            <DetalleIncidente recordKey={key} />
                        </Modal>

                        <DataGrid
                            data={incidentesMedia}
                            columns={columns}
                            footerCreate={footerCreate}
                            expandible={(record) => (
                                <div>
                                    <h4>Descripcion</h4>
                                    <p>{record.descripcion}</p>
                                </div>
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
