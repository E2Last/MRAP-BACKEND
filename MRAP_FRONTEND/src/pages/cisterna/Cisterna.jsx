import './Cisterna.css';
import { EditOutlined, SearchOutlined, DeleteOutlined, PlusOutlined, AimOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { useState } from 'react';
import { Navbar } from "../../components/Navbar/Navbar";
import { DataGrid } from '../../components/DataGrid/DataGrid';
import { FormCreateCisterna } from '../../components/FormCreateCisterna/FormCreateCisterna';
import { FormPutCisterna } from '../../components/FormPutCisterna/FormPutCisterna';
import { Spin, Button, Tag, Modal } from 'antd';
import { checkLoged } from '../../store/checkLoged';
import { getCisternas } from './cisternaQueryAPI';
import { useModal } from './handleModal';
import { useQuery } from '@tanstack/react-query';
import { useDeleteCisterna } from './cisternaQueryAPI';
import { useNavigate } from 'react-router-dom';

export const Cisterna = () => {
    // Verificación de login
    checkLoged();

    // Navigate para redirigir al componente del detalle de la cisterna
    const navigate = useNavigate();

    // Usa el hook para manejar el estado del modal
    const { open: openModal1, handleStateModal: handleStateModal1 } = useModal();
    const { open: openModal2, handleStateModal: handleStateModal2 } = useModal();

    // Uso de useMutation para eliminar una cisterna
    const { mutate: deleteCisterna, isLoading: loadingDelete } = useDeleteCisterna();

    // Id de la cisterna a modificar
    const [key, setKey] = useState(null);

    // Obtención de las cisternas
    const { isLoading, data, isError } = useQuery({
        queryKey: ['cisternas'],
        queryFn: getCisternas
    });

    const handleDetail = (key) => {
        navigate(`/configuracion/cisternas/${key}`);
    };

    const { confirm } = Modal;

    const showConfirm = (record, onDelete) => {
        console.log("showConfirm called for record:", record);
        confirm({
            title: '¿Quieres eliminar esta cisterna?',
            icon: <ExclamationCircleFilled />,
            content: `Nombre: ${record.nombre}`,
            onOk() {
                console.log('Deleting record with key:', record.key);
                onDelete(record.key);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
            width: '3%',
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
            width: '12.5%',
        },
        {
            title: 'Tipo elemento',
            dataIndex: 'tipo_elemento',
            key: 'tipo_elemento',
            width: '4%',
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            align: 'center', // Centrar el contenido horizontalmente
            width: '1%',
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
            key: 'latitud',
            width: '6%',
        },
        {
            title: 'Longitud',
            dataIndex: 'longitud',
            key: 'longitud',
            width: '6%',
        },
        {
            title: 'Localidad',
            dataIndex: 'localidad',
            key: 'localidad',
            width: '5%',
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
                        onClick={() => showConfirm(record, deleteCisterna)}
                        icon={<DeleteOutlined style={{ color: 'red' }} />}
                        className='boton-sin-estilo'
                        loading={loadingDelete}
                    />
                </div>
            ),
        }
    ];

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
                        Total: {data ? data.length : 0}
                    </div>
                </div>
            </div>
        );
    };

    if (isError) {
        return <h1>Error al cargar los datos</h1>;

    } else if (isLoading) {
        return <Spin size='large'>Cargando...</Spin>;

    } else if (data) {
        return (
            <div className="fullScreenCisterna">
                <Navbar />
                <div className="container-cisterna">
                    <div className='container-table'>

                        <Modal
                            title='Crear'
                            open={openModal1}
                            onCancel={handleStateModal1}
                            footer={null}
                            centered
                        >
                            <FormCreateCisterna />
                        </Modal>

                        <Modal
                            title='Editar'
                            open={openModal2}
                            onCancel={handleStateModal2}
                            footer={null}
                            centered
                        >
                            <FormPutCisterna recordKey={key} />
                        </Modal>

                        {/* MODAL QUE MUESTRA EL MAPA */}

                        <DataGrid data={data} columns={columns} footerCreate={footerCreate} />

                    </div>
                </div>
            </div>
        );
    }
};
