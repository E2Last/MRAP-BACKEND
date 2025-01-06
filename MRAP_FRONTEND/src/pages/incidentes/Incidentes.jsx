// Incidentes.js
import './Incidentes.css';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { useState } from 'react';
import { Navbar } from '../../components/Navbar/Navbar';
import { DataGrid } from '../../components/DataGrid/DataGrid';
import { Spin, Button, Modal, Table } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getIncidentes } from './incidentesQueryAPI';
import { useModal } from './handleModal';
import { checkLoged } from '../../store/checkLoged';
import { FormCreateIncidente } from '../../components/FormCreateIncidente/FormCreateIncidente';
import { FormPutIncidente } from '../../components/FormPutIncidente/FormPutIncidente';
import { useDeleteIncidente } from './incidentesQueryAPI';
import { DetalleIncidente } from './DetalleIncidente';

export const Incidentes = () => {
    checkLoged()

    const { open: openModal1, handleStateModal: handleStateModal1 } = useModal();
    const { open: openModal2, handleStateModal: handleStateModal2 } = useModal();
    const { open: openModal3, handleStateModal: handleStateModal3 } = useModal()

    const [key, setKey] = useState(null)

    const [currentPage, setCurrentPage] = useState(1)

    const { data: incidentes, isLoading: loading, isError: error } = useQuery({
        queryKey: ['incidentes', currentPage],
        queryFn: () => getIncidentes(currentPage),
    })

    const { mutate: deleteIncidente, isLoading: loadingDelete } = useDeleteIncidente()

    const handlePageChange = (page) =>{
        setCurrentPage(page)
    }

    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
            width: 1,
            // defaultSortOrder: 'descend',
            // sorter: (a, b) => a.key - b.key,
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
                icon={<PlusOutlined />}
                size='large'
                onClick={handleStateModal1}
            >
                CARGAR INCIDENTE
            </Button>
            <div className="row-counter">
                Total: <strong>{incidentes.pages.pages}</strong>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="container-spin">
                <Spin size="large" />
            </div>
        )
    }

    if (error) {
        return <h3>Error</h3>
    }

    return (
        <div className='fullScreenIncidentes'>
            <Navbar />
            <div className='container-incidentes'>
                <div className='container-table'>

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

                    <Table
                        dataSource={incidentes.resultados}
                        columns={columns}
                        footer={() => footerCreate()}
                        style={{
                            width: '100%',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.10)',
                            borderRadius: '8px',
                        }}
                        scroll={{ x: 'max-content', }}
                        bordered
                        size='small'
                        expandable={{
                            expandedRowRender: (record) => (
                                <div>
                                    {record.descripcion}
                                </div>
                            ),
                            rowExpandable: (record) => !!record.descripcion,
                        }}
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            position: ['bottomCenter'],
                            current: currentPage,
                            total: incidentes.pages.pages,
                            onChange: handlePageChange
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
