import { useParams } from "react-router-dom";
import { DetalleElemento } from "../../components/DetalleElemento/DetalleElemento";
import { Navbar } from "../../components/Navbar/Navbar";
import { Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getCisternasIncidentes } from "./cisternaQueryAPI";
import { getCisterna } from "../../pages/cisterna/cisternaQueryAPI";
import IconoCisterna from "../../iconos-mrap/CisternaGris.png";

export const DetalleCisterna = () => {
    const { id } = useParams();

    const { data: cisternas_con_incidentes, isLoading: loadingIncidentes } = useQuery({
        queryKey: ['cisternas_con_incidentes', id],
        queryFn: () => getCisternasIncidentes(id),
    });

    const { data: cisterna, isLoading: loadingCisterna } = useQuery({
        queryKey: ['cisterna', id],
        queryFn: () => getCisterna(id),
    });

    let elemento = null;
    if (!loadingCisterna && cisterna) {
        elemento = {
            id: cisterna.id,
            nombre: cisterna.nombre_cisterna,
            tipo_elemento: cisterna.tipo_elemento.nombre_tipo_de_elemento,
            latitud: cisterna.latitud,
            longitud: cisterna.longitud,
            estado: cisterna.estado.descripcion,
            localidad: cisterna.localidad.nombre,
            urlIcono: IconoCisterna,
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
            title: 'Cisterna',
            dataIndex: 'nombre_cisterna',
            key: 'nombre_cisterna',
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
                    loadingIncidentes && loadingCisterna ? (
                        <Spin size="large" />
                    ) : (
                        <DetalleElemento columnas={columnas} data={cisternas_con_incidentes} elemento={elemento} />
                    )
                }
            </div>
        </div>
    );
};
