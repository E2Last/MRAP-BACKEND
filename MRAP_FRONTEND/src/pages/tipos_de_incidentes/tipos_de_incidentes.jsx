// ESTILOS
import './tipos_de_incidentes.css';
// ICONOS
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons';
// COMPONENTES
import { Navbar } from '../../components/Navbar/Navbar';
import { DataGrid } from '../../components/DataGrid/DataGrid';
import { Spin, Button, Modal } from 'antd';
// HOOKS PERSONALIZADOS
import { useState } from 'react';
import { useModal } from './handleModal';
// QUERY API
import { useQuery } from '@tanstack/react-query';
import { getIncidentes, useDeleteIncidente } from './tipos_de_incidentesQueryAPI';
// FORMULARIOS
import { FormCreateTipoIncidente } from '../../components/FormCreateTipoIncidente/FormCreateTipoIncidente';
import { FormPutTipoIncidente } from '../../components/FormPutTipoIncidente/FormPutTipoIncidente';

export const Tipos_de_incidentes = () => {
    // Estado y lógica
    const { data: dataIncidentes, isLoading: loadingIncidentes, isError: errorIncidentes, refetch } = useQuery({
        queryKey: ['incidentes'],
        queryFn: getIncidentes
    });

    const { mutate: deleteIncidente, isLoading: deleteLoading } = useDeleteIncidente();
    const { open: openModal1, handleStateModal: handleStateModal1 } = useModal();
    const { open: openModal2, handleStateModal: handleStateModal2 } = useModal();
    const [key, setKey] = useState(null);

    // Función para mostrar la alerta de confirmación
    const showDeleteConfirm = (recordKey) => {
        Modal.confirm({
            title: '¿Estás seguro de que deseas eliminar este tipo de incidente?',
            content: 'Esta acción no se puede deshacer.',
            okText: 'OK',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                deleteIncidente(recordKey);
            },
        });
    };

    // Columnas de la tabla
    const columns = [
        { title: '#', dataIndex: 'key', key: 'key' },
        { title: 'Descripción del Incidente', dataIndex: 'descripcion_tipo_incidente', key: 'descripcion_tipo_incidente' },
        {
            title: 'Poner elem. inactivo',
            dataIndex: 'inhabilitar_elemento',
            key: 'inhabilitar_elemento',
            render: (record) => record ? (
                <CheckCircleFilled style={{ color: '#B7EB8F', fontSize: 20 }} />
            ) : (
                <CloseCircleFilled style={{ color: '#F7665E', fontSize: 20 }} />
            ),
        },
        {
            title: 'Acciones',
            dataIndex: 'operacion',
            key: 'operacion',
            render: (text, record) => (
                <div className='container-operaciones'>
                    <Button
                        onClick={() => {
                            setKey(record.key);
                            handleStateModal2();
                        }}
                        icon={<EditOutlined style={{ color: '#1677FF' }} />}
                        className='boton-sin-estilo'
                    />
                    <Button
                        onClick={() => showDeleteConfirm(record.key)}
                        icon={<DeleteOutlined style={{ color: 'red' }} />}
                        className='boton-sin-estilo'
                        loading={deleteLoading}
                    />
                </div>
            ),
        }
    ];

    // Footer de la tabla
    const footerCreate = () => (
        <div className='footer'>
            <Button
                color='primary'
                variant='filled'
                icon={<PlusOutlined />}
                size='large'
                onClick={handleStateModal1}
            >
                CREAR TIPO DE INCIDENTE
            </Button>
            <Button
                icon={<ReloadOutlined />}
                size='large'
                onClick={refetch}
            >
                Recargar
            </Button>
        </div>
    );

    // Carga y errores
    if (loadingIncidentes) {
        return (
            <div className='container-spin'>
                <Spin size='large' />
            </div>
        );
    }

    if (errorIncidentes) {
        return (
            <div className='container-error'>
                <h1>Error al cargar incidentes</h1>
            </div>
        );
    }

    return (
        <div className='fullScreenIncidente'>
            <Navbar />
            <div className='container-incidente'>
                <div className='container-table'>
                    <Modal
                        title='Crear Incidente'
                        open={openModal1}
                        onCancel={handleStateModal1}
                        footer={null}
                        centered
                    >
                        <FormCreateTipoIncidente />
                    </Modal>

                    <Modal
                        title='Editar'
                        open={openModal2}
                        onCancel={handleStateModal2}
                        footer={null}
                        centered
                    >
                        <FormPutTipoIncidente recordKey={key} />
                    </Modal>

                    <DataGrid data={dataIncidentes} columns={columns} footerCreate={footerCreate} />
                </div>
            </div>
        </div>
    );
};
