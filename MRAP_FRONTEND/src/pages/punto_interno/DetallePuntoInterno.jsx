import { useParams } from "react-router-dom";
import { DetalleElemento } from "../../components/DetalleElemento/DetalleElemento";
import { Navbar } from "../../components/Navbar/Navbar";
import { Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getPuntoInternoIncidentes } from "../punto_interno/PuntoInternoQueryAPI";
import { getPuntoInterno } from "../../pages/punto_interno/PuntoInternoQueryAPI";
import IconoPuntoInterno from "../../iconos-mrap/puntodecontrolgrisicon.png";
import { ArrowLeftOutlined } from '@ant-design/icons'; // Importa el ícono de flecha

export const DetallePuntoInterno = () => {
    const { id } = useParams();

    const { data: PuntoInterno_con_incidentes, isLoading: loadingIncidentes } = useQuery({
        queryKey: ['PuntosInternos_con_incidentes', id],
        queryFn: () => getPuntoInternoIncidentes(id),
    });

    const { data: PuntoInterno, isLoading: loadingPuntoInterno } = useQuery({
        queryKey: ['PuntoInterno', id],
        queryFn: () => getPuntoInterno(id),
    });

    let elemento = null;
    if (!loadingPuntoInterno && PuntoInterno) {
        elemento = {
            id: PuntoInterno.id,
            nombre: PuntoInterno.nombre_punto_interno,
            tipo_elemento: PuntoInterno.tipo_elemento.nombre_tipo_de_elemento,
            latitud: PuntoInterno.latitud,
            longitud: PuntoInterno.longitud,
            estado: PuntoInterno.estado.descripcion,
            // localidad: PuntoInterno.localidad.nombre,
            urlIcono: IconoPuntoInterno,
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
            title: 'Punto Interno',
            dataIndex: 'nombre_PuntoInterno',
            key: 'nombre_PuntoInterno',
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
                    loadingIncidentes && loadingPuntoInterno ? (
                        <Spin size="large" />
                    ) : (
                        <DetalleElemento columnas={columnas} data={PuntoInterno_con_incidentes} elemento={elemento} />
                    )
                }
            </div>
        </div>
    );
};
