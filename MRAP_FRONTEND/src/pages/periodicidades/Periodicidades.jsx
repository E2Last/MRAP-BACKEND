// ESTILOS
import './Periodicidades.css'
//ICONOS
import { EditOutlined, SearchOutlined, DeleteOutlined, PlusOutlined, WarningFilled, CheckCircleFilled } from '@ant-design/icons';
// COMPONENTES
import { Navbar } from "../../components/Navbar/Navbar"
import { DataGrid } from '../../components/DataGrid/DataGrid';
import { Spin, Button, Tag, Modal } from 'antd';
// CUSTOM HOOKS Y FUNCIONALIDADES
import { checkLoged } from "../../store/checkLoged"
import { useModal } from './handleModal';
import { useState } from 'react';
// REACT QUERY
import { useQuery } from '@tanstack/react-query';
import { getPeriodicidades } from './periodicidadesQueryAPI';
import { useDeletePeriodicidad } from './periodicidadesQueryAPI';
// FORMULARIOS
import { FormCreatePeriodicidad } from '../../components/FormCreatePeriodicidad/FormCreatePeriodicidad';
import { FormPutPeriodicidad } from '../../components/FormPutPeriodicidad/FormPutPeriodicidad';

export const Periodicidades = () => {

    checkLoged()

    const { data: dataPeriodicidades, isLoading: loadingPeriodicidades, isError } = useQuery({
        queryKey: ['periodicidades'],
        queryFn: getPeriodicidades
    })

    const {mutate: deleteFn, isLoading: loading} = useDeletePeriodicidad()

    const { open: openModal1, handleStateModal: handleStateModal1 } = useModal()
    const { open: openModal2, handleStateModal: handleStateModal2 } = useModal()

    const [key, setKey] = useState(null)

    const columns = [
        {
            title: 'id',
            dataIndex: 'key',
            key: 'key'
        },
        {
            title: 'Codigo de periodicidad',
            dataIndex: 'periodicidad_codigo',
            key: 'periodicidad_codigo'
        },
        {
            title: 'Nombre de periodicidad',
            dataIndex: 'periodicidad_nombre',
            key: 'periodicidad_nombr'
        },
        {
            title: '# dias',
            dataIndex: 'numero_dias',
            key: 'numero_dias'
        },
        {
            title: 'Retrasado (Num. dias)',
            dataIndex: 'retraso_dias',
            key: 'retraso_dias'
        },
        {
            title: 'Muy retrasado (Num. dias)',
            dataIndex: 'muy_retrasado_dias',
            key: 'muy_retrasado_dias'
        },
        {
            title: 'Opciones',
            dataIndex: 'operacion',
            key: 'operacion',
            width: '2%',
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
                        onClick={() => deleteFn(record.key)}
                        icon={<DeleteOutlined style={{ color: 'red' }} />}
                        className='boton-sin-estilo'
                        loading={loading}
                    />
                </div>
            )
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

    if (loadingPeriodicidades) {
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
        <div className="fullScreenPeriodicidades">
            <Navbar />
            <div className='container-periodicidades'>
                <div className="container-table">

                        <Modal
                            title='Crear'
                            open={openModal1}
                            onCancel={handleStateModal1}
                            footer={null}
                            centered
                        >
                            <FormCreatePeriodicidad/>
                        </Modal>

                        <Modal
                            title='Editar'
                            open={openModal2}
                            onCancel={handleStateModal2}
                            footer={null}
                            centered
                        >
                            <FormPutPeriodicidad recordKey={key}/>
                        </Modal>

                        <DataGrid columns={columns} data={dataPeriodicidades} footerCreate={footerCreate} />

                </div>
            </div>
        </div>
    )
}