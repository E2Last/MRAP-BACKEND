import './Bomba.css';
import { EditOutlined, SearchOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { useState } from 'react';
import { Navbar } from "../../components/Navbar/Navbar";
import { DataGrid } from '../../components/DataGrid/DataGrid';
import { Spin, Button, Tag, Modal } from 'antd';
import { checkLoged } from '../../store/checkLoged';
import { useModal } from './handleModal';
import { getBombas } from './bombaQueryAPI';
import { useQuery } from '@tanstack/react-query';
import { useDeleteBomba } from './bombaQueryAPI';
import { FormCreateBomba } from '../../components/FormCreateBomba/FormCreateBomba';
import { FormPutBomba } from '../../FormPutBomba/FormPutBomba';

import { useNavigate } from 'react-router-dom';

const { confirm } = Modal;

export const Bomba = () => {
    checkLoged();
    const { isLoading: loadingBombas, data: dataBombas, isError: errorBombas } = useQuery({
        queryKey: ['bombas'],
        queryFn: getBombas
    });
    const [key, setKey] = useState(null);
    const { mutate: deleteBomba, isLoading: loadingDeleteBomba } = useDeleteBomba();
    const { open: openModal1, handleStateModal: handleStateModal1 } = useModal();
    const { open: openModal2, handleStateModal: handleStateModal2 } = useModal();
    const navigate = useNavigate();

    const showConfirm = (record, onDelete) => {
        confirm({
            title: '¿Quieres eliminar esta bomba?',
            icon: <ExclamationCircleFilled />,
            content: `Nombre: ${record.nombre_bomba}`,
            onOk() {
                onDelete(record.key);
            },
            onCancel() {
                console.log('Cancelado');
            },
        });
    };

    const handleDetail = (key) => {
        navigate(`/configuracion/bombas/${key}`);
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
            width: '5%',
        },
        {
            title: 'Estado',
            align: 'center', // Centrar el contenido horizontalmente
            dataIndex: 'estado',
            width:'10%',
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
            title: 'Nombre bomba',
            dataIndex: 'nombre_bomba',
            key: 'nombre_bomba',
        },
        {
            title: 'Tipo elemento',
            dataIndex: 'tipo_elemento',
            key: 'tipo_elemento',
        },
        {
            title: 'Horas de Uso',
            dataIndex: 'horas_uso',
            key: 'horas_uso',
        },
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            key: 'fecha',
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
                            setKey(record.key);
                            handleStateModal2();
                        }}
                        icon={<EditOutlined style={{ color: '#1677FF' }} />}
                        className='boton-sin-estilo'
                    />
                    <Button
                        onClick={() => showConfirm(record, deleteBomba)}
                        icon={<DeleteOutlined style={{ color: 'red' }} />}
                        className='boton-sin-estilo'
                        loading={loadingDeleteBomba}
                    />
                </div>
            ),
        }
    ];

    const footerCreate = () => {
        return (
            <div className='footer'>
                <Button
                    color='primary'
                    variant='filled'
                    icon={<PlusOutlined />}
                    size='middle'
                    onClick={handleStateModal1}
                >
                    CREAR
                </Button>
                {/* Agregando el contador de filas debajo del botón CREAR */}
                <div className='row-counter'>
                    Total: {dataBombas ? dataBombas.length : 0}
                </div>
            </div>
        );
    };

    if (loadingBombas) {
        return (
            <div className='container-spin'>
                <Spin size='large' />
            </div>
        );
    }

    if (errorBombas) {
        return (
            <div className='container-copa'>
                <h1>Error 404</h1>
            </div>
        );
    }

    return (
        <div className='fullScreenBomba'>
            <Navbar />
            <div className='container-bomba'>
                <div className='container-table'>
                        <Modal
                            title='Crear'
                            open={openModal1}
                            onCancel={handleStateModal1}
                            footer={null}
                            centered
                        >
                            <FormCreateBomba />
                        </Modal>
                        <Modal
                            title='Editar'
                            open={openModal2}
                            onCancel={handleStateModal2}
                            footer={null}
                            centered
                        >
                            <FormPutBomba recordKey={key} />
                        </Modal>
                        <DataGrid data={dataBombas} columns={columns} footerCreate={footerCreate} />
                </div>
            </div>
        </div>
    );
};
