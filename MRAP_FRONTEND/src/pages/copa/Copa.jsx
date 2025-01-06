import './Copa.css';
import { EditOutlined, SearchOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { Navbar } from "../../components/Navbar/Navbar";
import { Spin, Button, Tag, Modal, AutoComplete } from 'antd';
import { DataGrid } from '../../components/DataGrid/DataGrid';
import { FormCreateCopa } from '../../components/FormCreateCopa/FormCreateCopa';
import { FormPutCopa } from '../../components/FormPutCopa/FormPutCopa';
import { checkLoged } from '../../store/checkLoged';
import { getCopas } from './copaQueryAPI';
import { useModal } from '../cisterna/handleModal';
import { useQuery } from '@tanstack/react-query';
import { useDeleteCopa } from './copaQueryAPI';
import { useNavigate } from 'react-router-dom';

const { confirm } = Modal;

const showConfirm = (record, onDelete) => {
  console.log("showConfirm called for record:", record);
  confirm({
    title: '¿Quieres eliminar esta copa?',
    icon: <ExclamationCircleFilled />,
    content: `Nombre: ${record.nombre_copa}`,
    onOk() {
      console.log('Deleting record with key:', record.key);
      onDelete(record.key);
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};

export const Copa = () => {
    checkLoged();

    const navigate = useNavigate();

    const { isLoading, data: dataCopas, isError } = useQuery({
        queryKey: ['copas'],
        queryFn: getCopas
    });

    const handleDetail = (key) => {
        navigate(`/configuracion/copas/${key}`);
    };

    const { open: openModal1, setOpen: setOpenModal1, handleStateModal: handleStateModal1 } = useModal();
    const { open: openModal2, setOpen: setOpenModal2, handleStateModal: handleStateModal2 } = useModal();

    const [key, setKey] = useState(null);

    const { mutate: deleteCopa, isLoading: loadingDeleteCopa } = useDeleteCopa();

    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
            width: '1%',
        },
        {
            title: 'Nombre copa',
            dataIndex: 'nombre_copa',
            key: 'key',
            width: '12.5%'
        },
        {
            title: 'Tipo elemento',
            dataIndex: 'tipo_elemento',
            key: 'key',
            width: '12.5%'
        },
        {
            title: 'Latitud',
            dataIndex: 'latitud',
            key: 'key',
            width: '12.5%'
        },
        {
            title: 'Longitud',
            dataIndex: 'longitud',
            key: 'key',
            width: '12.5%'
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            align: 'center', // Centrar el contenido horizontalmente
            key: 'key',
            width: '4%',
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
            title: 'Localidad',
            dataIndex: 'localidad',
            key: 'key',
            width: '12.5%'
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
                        onClick={() =>  showConfirm(record, deleteCopa)}
                        icon={<DeleteOutlined style={{ color: 'red' }} />}
                        className='boton-sin-estilo'
                        loading={loadingDeleteCopa}
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
                        Total: {dataCopas ? dataCopas.length : 0}
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className='container-spin'>
                <Spin size='large' />
            </div>
        )
    }

    if (isError) {
        return (
            <div className='container-copa'>
                <h1>Error 404</h1>
            </div>
        )
    }

    return (
        <div className='fullScreenCopa'>
            <Navbar></Navbar>
            <div className='container-copa'>
                <div className='container-table'>
                    
                        <DataGrid data={dataCopas} columns={columns} footerCreate={footerCreate} />
                        <Modal
                            title='Crear'
                            open={openModal1}
                            onCancel={handleStateModal1}
                            footer={null}
                            centered
                        >
                            <FormCreateCopa/>
                        </Modal>
                        <Modal
                            title='Editar'
                            open={openModal2}
                            onCancel={handleStateModal2}
                            footer={null}
                            centered
                        >
                            <FormPutCopa recordKey={key}/>
                        </Modal>
                    
                </div>
            </div>
        </div>
    )
}
