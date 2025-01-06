// Estilos
//import './Analisis.css';
// Iconos
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, FullscreenExitOutlined } from '@ant-design/icons';
// Hooks de React
import { useState } from 'react';
// Componentes
import { Navbar } from '../../components/Navbar/Navbar';
import { DataGrid } from '../../components/DataGrid/DataGrid';
import { Spin, Button, Modal } from 'antd';
// React Query
import { useQuery } from '@tanstack/react-query';
import { getAnalisis, useDeleteAnalisis, getPeriodosAnalisisElementos, useDeleteAnalisisPeriodicidad } from './analisisQueryAPI';
// Formularios
import { FormCreateAnalisis } from '../../components/FormCreateAnalisis/FormCreateAnalisis';
import { FormPutAnalisis } from '../../components/FormPutAnalisis/FormPutAnalisis';
import { DetalleAnalisis } from '../../components/DetalleAnalisis/DetalleAnalisis';
import { FormAsignarPeriodicidad } from '../../components/FormAsignarPeriodicidad/FormAsignarPeriodicidad';
import { FormPutPeriodoAnalisis } from '../../components/FormPutPeriodoAnalisis/FormPutPeriodoAnalisis';
// Custom hooks
import { useModal } from './handleModal';
import customIcon from '../../iconos-mrap/ojito.png'

export const Analisis = () => {
    const { data: dataAnalisis, isLoading: loadingAnalisis, isError: errorAnalisis } = useQuery({
        queryKey: ['analisis'],
        queryFn: getAnalisis
    });

    const { data: periodicidadesAnalisisElemento, isLoading: loadingPeriodicidadesAnalisis, isError: errorPeriodicidadesAnalisis } = useQuery({
        queryKey: ['periodicidades_analisis'],
        queryFn: getPeriodosAnalisisElementos
    });

    const { mutate: deleteAnalisisPeriodicidad, isLoading: loadingDeleteAnalisisPeriodicidad, isError: errorDeleteAnalisisPeriodicidad } = useDeleteAnalisisPeriodicidad();

    const { mutate: deleteAnalisis, isLoading: deleteLoading } = useDeleteAnalisis();
    const { open: openCrearAnalisis, handleStateModal: handleStateModalCrearAnalisis } = useModal();
    const { open: openDetallesAnalisis, handleStateModal: handleStateModalDetallesAnalisis } = useModal();
    const { open: openEditarAnalisis, handleStateModal: handleStateModalEditarAnalisis } = useModal();
    const { open: openAsignarPeriodicidad, handleStateModal: handleAsignarPeriodicidad } = useModal();
    const { open: openEditarPeriodicidad, handleStateModal: handleStateEditarPeriodicidad } = useModal();

    const [key, setKey] = useState(null);

    // Function to show confirmation modal before deletion
    const showConfirm = (deleteFunction, keyToDelete) => {
        Modal.confirm({
            title: '¿Estás seguro?',
            content: (
                <div>
                    <img src={customIcon} alt="Icono de Confirmación" style={{ width: '170px', height: '250px', marginBottom: '10px' }} />
                    <p>OJITO, Esta acción no se puede deshacer</p>
                </div>
            ),
            okText: 'Sí',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteFunction(keyToDelete);
            }
        });
    };

    const columnsAnalisis = [
        {
            title: '#',
            dataIndex: 'key',
            width: 1
        },
        {
            title: 'Analisis',
            dataIndex: 'nombre',
            key: 'nombre',
            width: 3
        },
        {
            title: 'Tipo de control',
            dataIndex: 'tipo_control',
            key: 'tipo_control',
            width: 3
        },
        {
            title: 'Acciones',
            dataIndex: 'operacion',
            key: 'operacion',
            width: 1,
            render: (text, record) => (
                <div className='container-operaciones'>
                    <Button
                        onClick={() => {
                            setKey(record.key)
                            handleStateModalDetallesAnalisis()
                        }}
                        icon={<SearchOutlined />}
                        className='boton-sin-estilo'
                    />
                    <Button
                        onClick={() => {
                            setKey(record.key)
                            handleAsignarPeriodicidad()
                        }}
                        icon={<FullscreenExitOutlined />}
                        className='boton-sin-estilo'
                    />
                    <Button
                        onClick={() => {
                            setKey(record.key);
                            handleStateModalEditarAnalisis()
                        }}
                        icon={<EditOutlined style={{ color: '#1677FF' }} />}
                        className='boton-sin-estilo'
                    />
                    <Button
                        onClick={() => showConfirm(deleteAnalisis, record.key)}
                        icon={<DeleteOutlined style={{ color: 'red' }} />}
                        className='boton-sin-estilo'
                        loading={deleteLoading}
                    />
                </div>
            )
        }
    ];

    const columnsPeriodicidades = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
            width: 1
        },
        {
            title: 'Tipo de elemento',
            dataIndex: 'tipo_elemento',
            key: 'tipo_elemento'
        },
        {
            title: 'Tipo de analisis',
            dataIndex: 'analisis',
            key: 'analisis'
        },
        {
            title: 'Periodicidad',
            dataIndex: 'periodicidad',
            key: 'periodicidad'
        },
        {
            title: 'Acciones',
            dataIndex: 'operacion',
            key: 'operacion',
            width: 1,
            render: (text, record) => (
                <div className='container-operaciones'>
                    <Button
                        onClick={() => {
                            setKey(record.key);
                            handleStateEditarPeriodicidad()
                        }}
                        icon={<EditOutlined style={{ color: '#1677FF' }} />}
                        className='boton-sin-estilo'
                    />
                    <Button
                        onClick={() => showConfirm(deleteAnalisisPeriodicidad, record.key)}
                        icon={<DeleteOutlined style={{ color: 'red' }} />}
                        className='boton-sin-estilo'
                        loading={loadingDeleteAnalisisPeriodicidad}
                    />
                </div>
            )
        }
    ];

    const footerCreate = () => (
        <div className='footer'>
            <Button
                color='primary'
                variant='filled'
                icon={<PlusOutlined />}
                size='large'
                onClick={handleStateModalCrearAnalisis}
            >
                CREAR
            </Button>
        </div>
    );

    if (loadingAnalisis) {
        return (
            <div className='container-spin'>
                <Spin size='large' />
            </div>
        );
    }

    if (errorAnalisis) {
        return (
            <div>
                <Navbar />
                <h1>Error al cargar análisis</h1>
                <DataGrid
                    data={dataAnalisis}
                    columns={columnsAnalisis}
                    footerCreate={footerCreate}
                />
            </div>
        )
    }

    return (
        <div className='fullScreenAnalisis'>
            <Navbar />
            <div className='container-analisis' style={{ alignItems: 'flex-start' }}>
                <div className='container-table' style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <div className='tabla' style={{ width: '550px', marginRight: '20px' }}>
                        <Modal
                            title='Crear Análisis'
                            open={openCrearAnalisis}
                            onCancel={handleStateModalCrearAnalisis}
                            footer={null}
                            centered
                            width={'60%'}
                        >
                            <FormCreateAnalisis />
                        </Modal>

                        <Modal
                            title='Detalles del analisis'
                            open={openDetallesAnalisis}
                            onCancel={handleStateModalDetallesAnalisis}
                            footer={null}
                            centered
                            width={'60%'}
                        >
                            <DetalleAnalisis recordKey={key} />
                        </Modal>

                        <Modal
                            title='Asignar periodicidad de analisis'
                            open={openAsignarPeriodicidad}
                            onCancel={handleAsignarPeriodicidad}
                            footer={null}
                            centered
                            width={'25%'}
                        >
                            <FormAsignarPeriodicidad recordKey={key} />
                        </Modal>

                        <Modal
                            title='Editar Análisis'
                            open={openEditarAnalisis}
                            onCancel={handleStateModalEditarAnalisis}
                            footer={null}
                            centered
                            width={'60%'}
                        >
                            <FormPutAnalisis recordKey={key} />
                        </Modal>

                        <DataGrid
                            data={dataAnalisis}
                            columns={columnsAnalisis}
                            footerCreate={footerCreate}
                        />
                    </div>

                    <div className='tabla' style={{ width: '1000px', marginLeft: '20px' }}>
                        {
                            loadingPeriodicidadesAnalisis ? (
                                <Spin></Spin>
                            ) : (
                                <div>
                                    <Modal
                                        title='Editar periodicidad de analisis'
                                        open={openEditarPeriodicidad}
                                        onCancel={handleStateEditarPeriodicidad}
                                        footer={null}
                                        centered
                                        width={'25%'}
                                    >
                                        <FormPutPeriodoAnalisis recordKey={key} />
                                    </Modal>

                                    <DataGrid
                                        data={periodicidadesAnalisisElemento}
                                        columns={columnsPeriodicidades}
                                        footerCreate={() => <div className='footer'></div>}
                                    />
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};