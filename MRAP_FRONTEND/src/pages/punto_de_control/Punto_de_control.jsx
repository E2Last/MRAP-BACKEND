import React, { useState } from 'react';
import './Punto_de_control.css';
import {
    EditOutlined,
    SearchOutlined,
    DeleteOutlined,
    PlusOutlined,
    WarningFilled,
    CheckCircleFilled,
    ExclamationCircleFilled,
    BarChartOutlined
} from '@ant-design/icons';
import { Navbar } from "../../components/Navbar/Navbar";
import { DataGrid } from "../../components/DataGrid/DataGrid";
import { Spin, Button, Tag, Modal } from 'antd';
import { checkLoged } from '../../store/checkLoged';
import { useModal } from './handleModal';
import { getPuntosDeControl } from './puntoDeControlQueryApi';
import { useQuery } from '@tanstack/react-query';
import { useDeletePuntoDeControl } from './puntoDeControlQueryApi';
import { FormCreatePuntoDeControl } from '../../components/FormCreatePuntoDeControl/FormCreatePuntoDeControl';
import { FormPutPuntoDeControl } from '../../components/FormPutPuntoDeControl/FormPutPuntoDeControl';
import { useNavigate } from 'react-router-dom';
import Grafico from './Grafico';
import { NavLink } from 'react-router-dom';

const { confirm } = Modal;

const showConfirm = (record, onDelete) => {
    confirm({
        title: '¿Quieres eliminar este punto de control?',
        icon: <ExclamationCircleFilled />,
        content: `Nombre: ${record.nombre_punto_de_control || 'Sin nombre'}`,
        onOk() {
            onDelete(record.key);
        },
        onCancel() {
            console.log('Cancel');
        },
    });
};

export const Punto_de_control = () => {
    checkLoged();
    const [isGraficoModalVisible, setIsGraficoModalVisible] = useState(false);
    const { data: dataPuntosDeControl, isLoading: loadingGetPuntosDeControl, isError: errorGetPuntosDeControl } = useQuery({
        queryKey: ['puntos_de_control'],
        queryFn: getPuntosDeControl
    });
    const { mutate: deletePunto, isLoading: deleteLoading } = useDeletePuntoDeControl();
    const { open: openModal1, handleStateModal: handleStateModal1 } = useModal();
    const { open: openModal2, handleStateModal: handleStateModal2 } = useModal();
    const [key, setKey] = useState(null);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [nombrePuntoControl, setNombrePuntoControl] = useState('');

    const navigate = useNavigate();

    const handleDetail = (key) => {
        navigate(`/configuracion/punto-de-control/${key}`);
    };

    const handleOpenGrafico = (key, nombre) => {
        setSelectedPoint(key);
        setNombrePuntoControl(nombre);
        setIsGraficoModalVisible(true);
    };

    const handleCloseGrafico = () => {
        setIsGraficoModalVisible(false);
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
            width: '2%',
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            align: 'center',
            width: '2%',
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
            title: 'Nombre',
            dataIndex: 'nombre_punto_de_control',
            key: 'nombre_punto_de_control',
        },
        {
            title: 'Tipo',
            dataIndex: 'tipo_elemento',
            key: 'tipo_elemento',
            width: '2%'
        },
        {
            title: 'Elemento',
            dataIndex: 'elemento',
            key: 'elemento'
        },
        {
            title: 'Retrasos',
            dataIndex: 'estado_retrasos',
            align: 'center',
            width: '1%',
            key: 'estado_retrasos',
            render: (text, record) => {
                const color = record.estado_retrasos === true ? 'orange' : '#B7EB8F';
                return record.estado_retrasos ? (
                    <WarningFilled style={{ color, fontSize: 20 }} />
                ) : (
                    <CheckCircleFilled style={{ color, fontSize: 20 }} />
                );
            }
        },
        {
            title: 'Opciones',
            dataIndex: 'operacion',
            key: 'operacion',
            width: '2%',
            render: (text, record) => (
                <div className='container-operaciones'>
                    <Button
                        onClick={() => handleOpenGrafico(record.key, record.nombre_punto_de_control)}
                        icon={<BarChartOutlined />}
                        className='boton-sin-estilo'
                    />
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
                        onClick={() => showConfirm(record, deletePunto)}
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
                    Total: {dataPuntosDeControl ? dataPuntosDeControl.length : 0}
                </div>
            </div>
        </div>
    );

    if (loadingGetPuntosDeControl) {
        return (
            <div className='container-spin'>
                <Spin size='large' />
            </div>
        );
    }

    if (errorGetPuntosDeControl) {
        return (
            <div className='container-copa'>
                <h1>error 404</h1>
            </div>
        );
    }

    return (
        <div className='fullScreenPuntoDeControl'>
            <Navbar />
            <div className="container-punto-de-control">
                <div className="container-table">
                    <Modal
                        title='Crear'
                        open={openModal1}
                        onCancel={handleStateModal1}
                        footer={null}
                        centered
                    >
                        <FormCreatePuntoDeControl />
                    </Modal>

                    <Modal
                        title='Editar'
                        open={openModal2}
                        onCancel={handleStateModal2}
                        footer={null}
                        centered
                    >
                        <FormPutPuntoDeControl recordKey={key} />
                    </Modal>

                    <Modal
                        title={`${nombrePuntoControl}`}
                        open={isGraficoModalVisible}
                        onCancel={handleCloseGrafico}
                        footer={null}
                        centered
                        width="60%"
                    >
                        <div style={{ width: '100%', height: '100%' }}>
                            <Grafico selectedPoint={selectedPoint} />
                        </div>
                    </Modal>

                    <DataGrid data={dataPuntosDeControl} columns={columns} footerCreate={footerCreate} />
                </div>
            </div>
        </div>
    );
};
