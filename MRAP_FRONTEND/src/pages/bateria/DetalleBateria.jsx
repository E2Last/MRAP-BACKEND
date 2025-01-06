import { useParams } from "react-router-dom";
import { DetalleElemento } from "../../components/DetalleElemento/DetalleElemento";
import { Navbar } from "../../components/Navbar/Navbar";
import { Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import IconoBateria from "../../iconos-mrap/bateriaicono.png"
import { getBateria } from "../../pages/bateria/bateriaQueryAPI"
import { getBateriaIncidentes } from "../../pages/bateria/bateriaQueryAPI";
import { ArrowLeftOutlined } from '@ant-design/icons'; // Importa el ícono de flecha

export const DetalleBateria = () => {
    // necesario para extraer la id directamente desde la url
    const { id } = useParams()

    // data a mostrarse
    const { data: bateria_con_incidentes, isLoading: loadingIncidentes } = useQuery({
        queryKey: ['bateria_con_incidentes', id],
        queryFn: () => getBateriaIncidentes(id)
    });

    const { data: bateria, isLoading: loadingBateria } = useQuery({
        queryKey: ['bateria', id],
        queryFn: () => getBateria(id)
    })

    let elemento = null
    if (!loadingBateria && bateria) {
        elemento = {
            id: bateria.id,
            nombre: bateria.nombre_bateria,
            tipo_elemento: bateria.tipo_elemento.nombre_tipo_de_elemento,
            latitud: bateria.latitud,
            longitud: bateria.longitud,
            urlIcono: IconoBateria,
        }
    }


    console.log(elemento)

    const columnas = [
        {
            title: 'Incidente id',
            dataIndex: 'incidente_id',
            key: 'incidente_id',
        },
        {
            title: 'Titulo',
            dataIndex: 'titulo',
            key: 'titulo',
        },
        {
            title: 'Bateria',
            dataIndex: 'nombre_bateria',
            key: 'nombre_bateria',
        },
        {
            title: 'Estado incidente',
            dataIndex: 'estado_incidente',
            key: 'estado_incidente',
        },
        {
            title: 'Fecha incidente',
            dataIndex: 'fecha_incidente',
            key: 'fecha_incidente',
        },
        {
            title: 'Fecha de registro',
            dataIndex: 'fecha_de_registro',
            key: 'fecha_de_registro',
        },
        {
            title: 'Gravedad',
            dataIndex: 'gravedad',
            key: 'gravedad',
        },
        {
            title: 'Tipo de incidente',
            dataIndex: 'tipo_incidente',
            key: 'tipo_incidente',
        },
    ]

    return (
        <div>
            <Navbar />
            <div style={{ position: 'relative', padding: '20px' }}>

                {
                    loadingIncidentes && loadingBateria ? (
                        <Spin size="large" />
                    ) : (
                        <DetalleElemento columnas={columnas} data={bateria_con_incidentes} elemento={elemento} />
                    )
                }

            </div>
        </div>
    )
}

