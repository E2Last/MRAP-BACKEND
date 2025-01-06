import { useParams } from "react-router-dom";
import { DetalleElemento } from "../../components/DetalleElemento/DetalleElemento";
import { Navbar } from "../../components/Navbar/Navbar";
import { Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import IconoCopa from "../../iconos-mrap/CopaGris.png"
import { getCopa } from "../../pages/copa/copaQueryAPI"
import { getCopaIncidentes } from "./copaQueryAPI"
import { ArrowLeftOutlined } from '@ant-design/icons'; // Importa el ícono de flecha

export const DetalleCopa = () => {
    // necesario para extraer la id directamente desde la url
    const { id } = useParams()

    // data a mostrarse
    const { data: copa_con_incidentes, isLoading: loadingIncidentes } = useQuery({
        queryKey: ['copa_con_incidentes', id],
        queryFn: () => getCopaIncidentes(id)
    });

    const { data: copa, isLoading: loadingCopa } = useQuery({
        queryKey: ['copa', id],
        queryFn: () => getCopa(id)
    })

    let elemento = null
    if (!loadingCopa && copa) {
        elemento = {
            id: copa.id,
            nombre: copa.nombre_copa,
            tipo_elemento: copa.tipo_elemento.nombre_tipo_de_elemento,
            latitud: copa.latitud,
            longitud: copa.longitud,
            estado: copa.estado.descripcion,
            localidad: copa.localidad.nombre,
            urlIcono: IconoCopa,
        }
    }

    //console.log(elemento)

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
            title: 'Copa',
            dataIndex: 'nombre_copa',
            key: 'nombre_copa',
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
                    loadingIncidentes && loadingCopa ? (
                        <Spin size="large" />
                    ) : (
                        <DetalleElemento columnas={columnas} data={copa_con_incidentes} elemento={elemento} />
                    )
                }

            </div>
        </div>
    )
}
