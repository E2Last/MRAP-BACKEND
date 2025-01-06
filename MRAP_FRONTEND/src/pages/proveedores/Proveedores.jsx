// Estilos
import './Proveedores.css';
// Iconos
import { EditOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';
// Hooks de React
import { useState } from 'react';
// Componentes
import { Navbar } from '../../components/Navbar/Navbar';
import { DataGrid } from '../../components/DataGrid/DataGrid';
import { Spin, Button, Modal } from 'antd';
// React Query
import { useQuery } from '@tanstack/react-query';
import { getProveedores, useDeleteProveedor } from './proveedoresQueryAPI';
// Formularios
import { FormCreateProveedor } from '../../components/FormCreateProveedor/FormCreateProveedor';
import { FormPutProveedor } from '../../components/FormPutProveedor/FormPutProveedor';
// Custom hooks
import { useModal } from './handleModal';

const { confirm } = Modal;

const showConfirm = (record, onDelete) => {
    console.log("showConfirm called for record:", record);
    confirm({
        title: '¿Quieres eliminar este proveedor?',
        icon: <ExclamationCircleFilled />,
        content: `Nombre: ${record.nombre_proveedor}`,
        onOk() {
            console.log('Deleting record with key:', record.key);
            onDelete(record.key);
        },
        onCancel() {
            console.log('Cancel');
        },
    });
};

export const Proveedor = () => {
    const { data: dataProveedores, isLoading: loadingProveedores, isError: errorProveedores } = useQuery({
        queryKey: ['proveedores'],
        queryFn: getProveedores
    });

    const { mutate: deleteProveedor, isLoading: deleteLoading } = useDeleteProveedor();

    const { open: openModal1, handleStateModal: handleStateModal1 } = useModal();
    const { open: openModal2, handleStateModal: handleStateModal2 } = useModal();

    const [key, setKey] = useState(null);

    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key'
        },
        {
            title: 'Codigo',
            dataIndex: 'codigo_proveedor',
            key: 'codigo_proveedor'
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre_proveedor',
            key: 'nombre_proveedor'
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
                        onClick={() => showConfirm(record, deleteProveedor)}
                        icon={<DeleteOutlined style={{ color: 'red' }} />}
                        className='boton-sin-estilo'
                        loading={deleteLoading}
                    />
                </div>
            ),
        }
    ];

    const footerCreate = () => (
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
                    Total: {dataProveedores ? dataProveedores.length : 0}
                </div>
            </div>
        </div>
    );

    if (loadingProveedores) {
        return (
            <div className='container-spin'>
                <Spin size='large' />
            </div>
        );
    }

    if (errorProveedores) {
        return <div className='container-error'><h1>Error al cargar proveedores</h1></div>;
    }

    return (
        <div className='fullScreenProveedor'>
            <Navbar />
            <div className='container-proveedor'>
                <div className='container-table'>
                        <Modal
                            title='Crear Proveedor'
                            open={openModal1}
                            onCancel={handleStateModal1}
                            footer={null}
                            centered
                        >
                            <FormCreateProveedor />
                        </Modal>

                        <Modal
                            title='Editar'
                            open={openModal2}
                            onCancel={handleStateModal2}
                            footer={null}
                            centered
                        >
                            <FormPutProveedor recordKey={key} />
                        </Modal>

                        <DataGrid data={dataProveedores} columns={columns} footerCreate={footerCreate} />
                </div>
            </div>
        </div>
    );
};
