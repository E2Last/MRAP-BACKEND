// ESTILOS
import './Bateria.css'
// Iconos
import { EditOutlined, SearchOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';
// Hooks de react
import { useState } from 'react';
// Componentes
import { Navbar } from "../../components/Navbar/Navbar";
import { DataGrid } from '../../components/DataGrid/DataGrid';
import { Spin, Button, Tag, Modal } from 'antd';
// Custom hooks y funcionalidades
import { checkLoged } from '../../store/checkLoged';
import { useModal } from '../bomba/handleModal';
import { getBaterias } from './bateriaQueryAPI';
// React Query
import { useQuery } from '@tanstack/react-query';
import { useDeleteBateria } from './bateriaQueryAPI';
// Formularios
import { FormCreateBateria } from '../../components/FormCreateBateria/FormCreateBateria';
import { FormPutBateria } from '../../components/FormPutBateria/FormPutBateria';

import { useNavigate } from 'react-router-dom';


const { confirm } = Modal;

const showConfirm = (record, onDelete) => {
  console.log("showConfirm called for record:", record);
  confirm({
    title: '¿Quieres eliminar esta bateria?',
    icon: <ExclamationCircleFilled />,
    content: `Nombre: ${record.nombre_bateria}`,
    onOk() {
      console.log('Deleting record with key:', record.key);
      onDelete(record.key);
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};

export const Bateria = () => {

    checkLoged()

    const { data: dataBaterias, isLoading: loadingBaterias, isError: errorBaterias } = useQuery({
        queryKey: ['baterias'],
        queryFn: getBaterias
    })

    // DELETE
    const { mutate: deleteBateria, isLoading: loadingDeleteBateria } = useDeleteBateria()
    const [key, setKey] = useState(null)

    // CUSTOM HOOKS PARA MODALES
    const { open: openModal1, handleStateModal: handleStateModal1 } = useModal()
    const { open: openModal2, handleStateModal: handleStateModal2 } = useModal()

    const navigate = useNavigate()
    const handleDetail = (key) => {
        //console.log(`Ver detalles de la cisterna con ID: ${key}`);
        navigate(`/configuracion/baterias/${key}`)
    };
    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
            width: '3%',
        },
        {
            title: 'Nombre bateria',
            dataIndex: 'nombre_bateria',
            key: 'nombre_bateria',
            width: '23%',
        },
        {
            title: 'Tipo elemento',
            dataIndex: 'tipo_elemento',
            key: 'tipo_elemento',
            width: '23%',
        },
        {
            title: 'Latitud',
            dataIndex: 'latitud',
            key: 'latitud',
            width: '4%',
        },
        {
            title: 'Longitud',
            dataIndex: 'longitud',
            key: 'longitud',
            width: '4%',
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
                            setKey(record.key)
                            handleStateModal2()
                        }}
                        icon={<EditOutlined style={{ color: '#1677FF' }} />}
                        className='boton-sin-estilo'
                    />
                    <Button
                        onClick={() => showConfirm(record, deleteBateria)}
                        icon={<DeleteOutlined style={{ color: 'red' }} />}
                        className='boton-sin-estilo'
                        loading={loadingDeleteBateria}
                    />
                </div>
            ),
        }
    ]

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
                        Total: {dataBaterias ? dataBaterias.length : 0}
                    </div>
                </div>
            </div>
        );
    };
    

    if (loadingBaterias) {
        return (
            <div className='container-spin'>
                <Spin size='large' />
            </div>
        )
    }

    if (errorBaterias) {
        <div className='container-copa'>
            <h1>error 404</h1>
        </div>
    }

    return (
        <div className='fullScreenBateria'>
            <Navbar />
            <div className='container-bateria'>
                <div className='container-table'>
                        <Modal
                            title='Crear'
                            open={openModal1}
                            onCancel={handleStateModal1}
                            footer={null}
                            centered
                        >
                            <FormCreateBateria />
                        </Modal>

                        <Modal
                            title='Editar'
                            open={openModal2}
                            onCancel={handleStateModal2}
                            footer={null}
                            centered
                        >
                            <FormPutBateria recordKey={key}/>
                        </Modal>

                        <DataGrid data={dataBaterias} columns={columns} footerCreate={footerCreate} />
                </div>
            </div>
        </div>
    )
}