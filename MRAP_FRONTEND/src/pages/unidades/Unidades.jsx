// Estilos
import './Unidades.css'
// Iconos
import { EditOutlined, DeleteOutlined, PlusOutlined, WarningFilled, CheckCircleFilled } from '@ant-design/icons';
// Hooks de react
import { useState } from 'react';
// Componentes
import { Navbar } from "../../components/Navbar/Navbar"
import { DataGrid } from "../../components/DataGrid/DataGrid"
import { Spin, Button, Modal, Alert } from 'antd';
// Custom hooks y funcionalidades
import { checkLoged } from '../../store/checkLoged';
import { useModal } from './handleModal';
import { useQuery } from '@tanstack/react-query';
// React Query
import { getUnidades } from './unidadesQueryAPI';
import { useDeleteUnidad } from './unidadesQueryAPI';
// Formularios
import { FormCreateUnidad } from '../../components/FormCreateUnidad/FormCreateUnidad';
import { FormPutUnidad } from '../../components/FormPutUnidad/FormPutUnidad';

export const Unidad = () => {

    checkLoged()

    const { data: dataUnidades, isLoading: loadingUnidades, isError } = useQuery({
        queryKey: ['unidades'],
        queryFn: getUnidades
    })

    const { mutate: deleteUnidad, isLoading: deleteLoading } = useDeleteUnidad()

    const [key, setKey] = useState(null)
    const [alert, setAlert] = useState({ visible: false, type: '', message: '' });
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const { open: openModal1, handleStateModal: handleStateModal1 } = useModal()
    const { open: openModal2, handleStateModal: handleStateModal2 } = useModal()

    const handleDeleteUnidad = () => {
        deleteUnidad(key, {
            onSuccess: () => {
                setAlert({ visible: true, type: 'success', message: 'Unidad eliminada con éxito.' });
                setTimeout(() => setAlert({ visible: false, type: '', message: '' }), 3000);
                setDeleteModalVisible(false);
            },
            onError: () => {
                setAlert({ visible: true, type: 'warning', message: 'Error al eliminar la unidad.' });
                setTimeout(() => setAlert({ visible: false, type: '', message: '' }), 3000);
            }
        });
    }

    const colums = [
        {
            title: 'ID unidad',
            dataIndex: 'key',
            key: 'key'
        },
        {
            title: 'Codigo',
            dataIndex: 'codigo',
            key: 'codigo'
        },
        {
            title: 'Nombre de la unidad',
            dataIndex: 'nombre_unidad',
            key: 'nombre_unidad',
        },
        {
            title: 'Opciones',
            render: (text, record) => (
                <div className='container-operaciones'>
                    <Button
                        onClick={() => {
                            setKey(record.key)
                            handleStateModal2()
                        }}
                        icon={<EditOutlined style={{ color: '#1677FF' }} />}
                        className='boton-sin-estilo'
                    />
                    <Button
                        onClick={() => {
                            setKey(record.key)
                            setDeleteModalVisible(true)
                        }}
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
                <Button
                    color='primary'
                    variant='filled'
                    icon={<PlusOutlined />}
                    size='large'
                    onClick={handleStateModal1}
                >
                    CREAR
                </Button >
            </div>
        );
    };

    if (loadingUnidades) {
        return (
            <div className='container-spin'>
                <Spin size='large' />
            </div>
        )
    }

    if (isError) {
        return <h1>Error al cargar los datos</h1>;
    }

    return (
        <div className='fullScreenUnidades'>
            <Navbar />
            <div className='container-unidades'>
                {alert.visible && (
                    <div className="alert-container">
                        <Alert
                            message={alert.message}
                            type={alert.type}
                            showIcon
                            icon={
                                alert.type === 'success' ? 
                                    <CheckCircleFilled style={{ color: '#52c41a' }} /> : 
                                    <WarningFilled style={{ color: '#faad14' }} />
                            }
                        />
                    </div>
                )}
                <div className='container-table'>
                    <div className='table'>
                        <Modal
                            title='Crear'
                            open={openModal1}
                            onCancel={handleStateModal1}
                            footer={null}
                            centered
                        >
                            <FormCreateUnidad/>
                        </Modal>

                        <Modal
                            title='Modificar'
                            open={openModal2}
                            onCancel={handleStateModal2}
                            footer={null}
                            centered
                        >
                            <FormPutUnidad recordKey={key}/>
                        </Modal>

                        <Modal
                            title="Confirmar eliminación"
                            open={deleteModalVisible}
                            onCancel={() => setDeleteModalVisible(false)}
                            onOk={handleDeleteUnidad}
                            okText="OK"
                            cancelText="Cancelar"
                            centered
                        >
                            <p>¿Estás seguro de que deseas eliminar esta unidad?</p>
                        </Modal>

                        <DataGrid data={dataUnidades} columns={colums} footerCreate={footerCreate} />
                    </div>
                </div>
            </div>
        </div>
    )
}
