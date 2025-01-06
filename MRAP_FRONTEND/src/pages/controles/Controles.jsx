import './Controles.css';
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, WarningOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Navbar } from '../../components/Navbar/Navbar';
import { DataGrid } from '../../components/DataGrid/DataGrid';
import { Spin, Button, Modal, Select, DatePicker, message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getControles, useDeleteControl } from '../../pages/controles/controlesQueryAPI';
import { FormCreateControl } from '../../components/FormCreateControles/FormCreateControles';
import { FormPutControl } from '../../components/FormPutControl/FormPutControl';
import { useModal } from './handleModal';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useNavigate } from 'react-router-dom';

dayjs.extend(advancedFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

export const Controles = ({ isDarkMode }) => {
    const navigate = useNavigate();

    const handleDetail = (key) => {
        if (key) {
            navigate(`/controles/${key}`);
        } else {
            console.error('Error: Attempting to navigate with undefined key');
        }
    };

    const { data: dataControles, isLoading: loadingControles, isError: errorControles } = useQuery({
        queryKey: ['controles'],
        queryFn: () => getControles(),
    });

    const handleDashboard = () => {
        navigate('/controles/dashboard'); // Asegúrate de que la ruta '/dashboard' sea correcta según tu configuración de rutas.
    };

    const { mutate: deleteControl, isLoading: deleteLoading } = useDeleteControl();
    const { open: openModal1, handleStateModal: handleStateModal1 } = useModal();
    const { open: openModalEdit, handleStateModal: handleOpenModalEdit } = useModal();
    const [key, setKey] = useState(null);
    const [filtroFecha, setFiltroFecha, filtroRealizado, setFiltroRealizado] = useState(null);
    const handleFiltroRealizadoChange = (value) => setFiltroRealizado(value);
    const handleFiltroFechaChange = (dates) => setFiltroFecha(dates);

    const handleDeleteControl = (key) => {
        confirm({
            title: '¿Estás seguro de que deseas eliminar este control?',
            icon: <WarningOutlined style={{ color: 'red' }} />,
            content: 'Esta acción no se puede deshacer.',
            okText: 'OK',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: () => {
                deleteControl(key, {
                    onError: () => {
                        message.error('Error al eliminar el control.');
                    },
                });
            },
            onCancel: () => {
                message.info('Eliminación cancelada.');
            },
        });
    };
    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
            defaultSortOrder: 'descend',
        },
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            key: 'fecha',
        },
        {
            title: 'Aprobado',
            dataIndex: 'aprobado',
            align: 'center',
            key: 'aprobado',
            render: (aprobado) => (aprobado ? '✔️' : '❌'),
        },
        {
            title: 'Proveedor',
            dataIndex: 'proveedor',
            key: 'proveedor',
            render: (proveedor) => proveedor?.nombre_proveedor || 'N/A',
        },
        {
            title: 'Punto de Control',
            dataIndex: 'nombre_punto_de_control',
            key: 'nombre_punto_de_control',
        },
        {
            title: 'Análisis',
            dataIndex: 'analisis',
            key: 'analisis',
            render: (analisis) => analisis?.nombre || 'N/A',
        },
        {
            title: 'Usuario',
            dataIndex: 'usuario',
            key: 'usuario',
            render: (usuario) => `${usuario.nombre} ${usuario.apellido} (${usuario.alias})`,
        },
        {
            title: 'Acciones',
            dataIndex: 'operacion',
            key: 'operacion',
            render: (text, record) => (
                <div className="container-operaciones">
                    <Button
                        icon={<SearchOutlined style={{ color: isDarkMode ? '#90caf9' : 'black' }} />}
                        className="boton-sin-estilo"
                        onClick={() => handleDetail(record.key)}
                    />
                    <Button
                        onClick={() => {
                            setKey(record.key);
                            handleOpenModalEdit();
                        }}
                        icon={<EditOutlined style={{ color: isDarkMode ? '#90caf9' : '#1677FF' }} />}
                        className="boton-sin-estilo"
                    />
                    <Button
                        onClick={() => handleDeleteControl(record.key)}
                        icon={<DeleteOutlined style={{ color: 'red' }} />}
                        className="boton-sin-estilo"
                        loading={deleteLoading}
                    />
                </div>
            ),
        },
    ];

    const footerCreate = () => (
        <div className="footer-controles">
            <Button
                color="primary"
                variant="filled"
                icon={<PlusOutlined />}
                size="large"
                onClick={handleStateModal1}
                className={isDarkMode ? 'button-create-dark' : 'button-create'}
            >
                CARGAR CONTROL
            </Button>
            <Button
                icon={<ReloadOutlined />}
                size="large"
                onClick={() => window.location.reload()}
                className={isDarkMode ? 'button-reload-dark' : 'button-reload'}
            >
                Recargar
            </Button>
        </div>
    );

    if (loadingControles) return <Spin size="large" />;
    if (errorControles) return <div>Error al cargar controles</div>;

    return (
        <div className={`fullScreenControles ${isDarkMode ? 'dark-mode' : ''}`}>
            <Navbar />
            <div className="container-controles">
                <div className="container-filtros" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Button
                        size="large"
                        className="botonAnt"
                        type="primary"
                        onClick={handleDashboard}
                        style={{
                            backgroundColor: isDarkMode ? '#444' : '#1890ff',
                            color: isDarkMode ? '#fff' : '#fff',
                        }}
                    >
                        Dashboard
                    </Button>
                </div>

                <div className="container-table">
                    <Modal
                        title="Crear Control"
                        open={openModal1}
                        onCancel={handleStateModal1}
                        footer={null}
                        centered
                        width={'auto'}
                    >
                        <FormCreateControl />
                    </Modal>

                    <Modal
                        title="Editar Control"
                        open={openModalEdit}
                        onCancel={handleOpenModalEdit}
                        footer={null}
                        centered
                        width={'auto'}
                    >
                        <FormPutControl recordKey={key} />
                    </Modal>

                    <DataGrid
                        data={dataControles.resultados}
                        columns={columns}
                        footerCreate={footerCreate}
                        callDataFunction={getControles}
                        pages={dataControles.pages}
                    />
                </div>
            </div>
        </div>
    );
};
