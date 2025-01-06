import { useParams } from "react-router-dom";
import { DetalleElemento } from "../../components/DetalleElemento/DetalleElemento";
import { Navbar } from "../../components/Navbar/Navbar";
import { Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getPozoIncidentes } from "./pozoQueryApi";
import { getPozo } from "../../pages/pozo/pozoQueryApi";
import IconoPozo from "../../iconos-mrap/PozoGris.png";
import { ArrowLeftOutlined } from '@ant-design/icons'; // Importa el ícono de flecha

export const DetallePozo = () => {
    const { id } = useParams();

    const { data: pozo_con_incidentes, isLoading: loadingIncidentes } = useQuery({
        queryKey: ['pozos_con_incidentes', id],
        queryFn: () => getPozoIncidentes(id),
    });

    const { data: pozo, isLoading: loadingPozo } = useQuery({
        queryKey: ['pozo', id],
        queryFn: () => getPozo(id),
    });

    let elemento = null;
    if (!loadingPozo && pozo) {
        elemento = {
            id: pozo.id,
             nombre: pozo.nombre_pozo,
            tipo_elemento: pozo.tipo_elemento.nombre_tipo_de_elemento,
            latitud: pozo.latitud,
            longitud: pozo.longitud,
            estado: pozo.estado.descripcion,
            // localidad: pozo.localidad.nombre,
            urlIcono: IconoPozo,
        };
    }

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
            title: 'Pozo',
            dataIndex: 'nombre_pozo',
            key: 'nombre_pozo',
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
    ];

    return (
        <div>
            <Navbar />
            <div style={{ position: 'relative', padding: '20px' }}>
                {
                    loadingIncidentes && loadingPozo ? (
                        <Spin size="large" />
                    ) : (
                        <DetalleElemento columnas={columnas} data={pozo_con_incidentes} elemento={elemento} />
                    )
                }
            </div>
        </div>
    );
};
