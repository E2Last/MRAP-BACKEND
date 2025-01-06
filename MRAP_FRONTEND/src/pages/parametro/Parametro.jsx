// ESTILOS
import './Parametro.css'
//ICONOS
import { EditOutlined, SearchOutlined, DeleteOutlined, PlusOutlined, CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons';
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
import { getParametros } from './parametroQueryAPI';
import { useDeleteParametro } from './parametroQueryAPI';
import { getParametro } from './parametroQueryAPI';
// FORMULARIOS
import { FormCreateParametro } from '../../components/FormCreateParametro/FormCreateParametro';
import { FormPutParametro } from '../../components/FormPutParametro/FormPutParametro';

export const Parametro = () => {

    checkLoged()

    const [key, setKey] = useState(null)

    const { data: parametros, isLoading: loadingParametros, isError: errorParametros } = useQuery({
        queryKey: ['parametros'],
        queryFn: getParametros
    })

    const { mutate: deleteParametro, isLoading: loadingDelete } = useDeleteParametro()

    const { open: openModal1, handleStateModal: handleStateModal1 } = useModal()
    const { open: openModal2, handleStateModal: handleStateModal2 } = useModal()

    if (loadingParametros) {
        return (
            <div className='container-spin'>
                <Spin size='large' />
            </div>
        )
    }

    if (errorParametros) {
        return <h1>Error al cargar los datos</h1>;
    }

    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Parametro codigo',
            dataIndex: 'parametro_codigo',
            key: 'parametro_codigo'
        },
        {
            title: 'Nombre parametro',
            dataIndex: 'nombre_parametro',
            key: 'nombre_parametro'
        },
        {
            title: 'Unidad',
            dataIndex: 'codigo_unidad',
            key: 'codigo_unidad'
        },
        {
            title: 'Texto',
            dataIndex: 'texto',
            align: 'center', // Centrar el contenido horizontalmente
            width: '2%',
            key: 'texto',
            render: (record) => {
                //console.log('texto: ', record)
                if (record == true) {
                    return (
                        <CheckCircleFilled style={{ color: '#B7EB8F', fontSize: 20 }} />
                    )
                } else {
                    return (
                        <CloseCircleFilled style={{ color: '#F7665E', fontSize: 20 }} />
                    )
                }
            }
        },
        {
            title: 'Numero',
            dataIndex: 'numero',
            align: 'center', // Centrar el contenido horizontalmente
            width: '2%',
            key: 'numero',
            render: (record) => {
                //console.log('numero: ', record)
                if (record == true) {
                    return (
                        <CheckCircleFilled style={{ color: '#B7EB8F', fontSize: 20 }} />
                    )
                } else {
                    return (
                        <CloseCircleFilled style={{ color: '#F7665E', fontSize: 20 }} />
                    )
                }
            }
        },
        {
            title: 'Decimales',
            dataIndex: 'decimales',
            key: 'decimales'
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
                        onClick={() => {
                            Modal.confirm({
                                title: '¿Estás seguro de que deseas eliminar este parámetro?',
                                content: 'Esta acción no se puede deshacer.',
                                okText: 'OK',
                                okType: 'danger',
                                cancelText: 'Cancelar',
                                onOk: () => deleteParametro(record.key),
                            });
                        }}
                        icon={<DeleteOutlined style={{ color: 'red' }} />}
                        className='boton-sin-estilo'
                        loading={loadingDelete}
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

    return (
        <div className="fullScreenParametro">
            <Navbar />
            <div className='container-parametro'>
                <div className='container-table'>

                        <Modal
                            title='Crear'
                            open={openModal1}
                            onCancel={handleStateModal1}
                            footer={null}
                            centered
                        >
                            <FormCreateParametro />
                        </Modal>

                        <Modal
                            title='Editar'
                            open={openModal2}
                            onCancel={handleStateModal2}
                            footer={null}
                            centered
                        >
                            <FormPutParametro recordKey={key} />
                        </Modal>
                        {/**/}
                        <DataGrid columns={columns} data={parametros} footerCreate={footerCreate} />

                </div>
            </div>
        </div>
    )
}