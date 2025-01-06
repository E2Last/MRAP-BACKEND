import './analisis_intervalo_referencia.css';
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Navbar } from '../../components/Navbar/Navbar';
import { DataGrid } from '../../components/DataGrid/DataGrid';
import { Spin, Button, Modal } from 'antd';
import { useModal } from './handleModal';
import { useGetIntervalos, useDeleteIntervalo } from './analisis_intervalo_referenciaQueryAPI';
import { FormCreateIntervaloReferencia } from '../../components/FormCreateIntervaloReferencia/FormCreateIntervaloReferencia';
import { FormPutIntervaloReferencia } from '../../components/FormPutIntervaloReferencia/FormPutIntervaloReferencia';

export const AnalisisIntervaloReferencia = () => {
    // Usar useQuery correctamente dentro del componente

    const { data: dataIntervalos, isLoading: loadingIntervalos, isError: errorIntervalos, refetch } = useGetIntervalos();

    const { mutate: deleteIntervalo, isLoading: deleteLoading } = useDeleteIntervalo();
    const { open: openModal1, handleStateModal: handleStateModal1 } = useModal();
    const { open: openModal2, handleStateModal: handleStateModal2 } = useModal();

    const [key, setKey] = useState(null);



    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Elemento',
            dataIndex: 'tipo_elemento',
            key: 'tipo_elemento',
        },
        {
            title: 'Parámetro | Unidad',
            dataIndex: 'parametro',
            key: 'parametro',
        },
        {
            title: 'Muy Bajo',
            dataIndex: 'muy_bajo',
            key: 'muy_bajo',
        },
        {
            title: 'Bajo',
            dataIndex: 'bajo',
            key: 'bajo',
        },
        {
            title: 'Alto',
            dataIndex: 'alto',
            key: 'alto',
        },
        {
            title: 'Muy Alto',
            dataIndex: 'muy_alto',
            key: 'muy_alto',
        },
        {
            title: 'Muy Bajo (regex)',
            dataIndex: 'muy_bajo_regex',
            key: 'muy_bajo_regex',
        },
        {
            title: 'Bajo (regex)',
            dataIndex: 'bajo_regex',
            key: 'bajo_regex',
        },
        {
            title: 'Alto (regex) ',
            dataIndex: 'alto_regex',
            key: 'alto_regex',
        },
        {
            title: 'Muy Alto (regex)',
            dataIndex: 'muy_alto_regex',
            key: 'muy_alto_regex',
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
                        onClick={() => {
                            Modal.confirm({
                                title: '¿Estás seguro de que quieres eliminar este intervalo?',
                                onOk: () => {
                                    deleteIntervalo(record.key);
                                },
                            });
                        }}
                        icon={<DeleteOutlined style={{ color: 'red' }} />}
                        className='boton-sin-estilo'
                        loading={deleteLoading}
                    />
                </div>
            ),
        },
    ];

    const footerCreate = () => (
        <div className='footer-referencia'>
            <div className='button-container'>
                <Button
                    color='primary'
                    variant='filled'
                    icon={<PlusOutlined />}
                    size='large'
                    onClick={handleStateModal1}
                >
                    CREAR INTERVALO
                </Button>
            </div>
            <div className='button-container'>
                <Button
                    icon={<ReloadOutlined />}
                    size='large'
                    onClick={refetch}
                >
                    Recargar
                </Button>
            </div>
            <div className='row-counter'>
                Total: {dataIntervalos ? dataIntervalos.length : 0}
            </div>
        </div>
    );

    return (
        <div className='fullScreenIntervalo'>
            <Navbar />
            <div className='container-intervalo'>
                <div className='container-table'>

                        <Modal
                            title='Crear Intervalo'
                            open={openModal1}
                            onCancel={handleStateModal1}
                            footer={null}
                            centered
                        >
                            <FormCreateIntervaloReferencia />
                        </Modal>

                        <Modal
                            title='Editar Intervalo'
                            open={openModal2}
                            onCancel={handleStateModal2}
                            footer={null}
                            centered
                        >
                            <FormPutIntervaloReferencia recordKey={key} />
                        </Modal>

                        <DataGrid data={dataIntervalos} columns={columns} footerCreate={footerCreate} />

                </div>
            </div>
        </div>
    );
};
