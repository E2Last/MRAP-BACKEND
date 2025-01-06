import { useParams } from "react-router-dom";
import { DetalleElemento } from "../../components/DetalleElemento/DetalleElemento";
import { Navbar } from "../../components/Navbar/Navbar";
import { Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getPuntoDeControl } from "../punto_de_control/puntoDeControlQueryApi";
import IconoPuntoDeControl from "../../iconos-mrap/puntodecontrolgrisicon.png";

export const DetallePuntoDeControl = () => {
    const { id } = useParams();
    const tipoElementoMap = {
        1: "Bomba",
        2: "Bateria",
        3: "Cisterna",
        4: "Copa",
        5: "Pozo",
        6: "PuntoInterno",
        8: "Cisterna(E)",
        9: "Cisterna(S)",
        10: "Copa(E)",
        11: "Copa(S)",
    };


    // Carga de detalles del Punto de Control
    const { data: PuntoDeControl, isLoading: loadingPuntoDeControl } = useQuery({
        queryKey: ["PuntoDeControl", id],
        queryFn: () => getPuntoDeControl(id),
    });

    // Construcción del objeto `elemento` con los datos relevantes
    let elemento = null;
    if (!loadingPuntoDeControl && PuntoDeControl) {
        elemento = {
            id: PuntoDeControl.id,
            nombre: PuntoDeControl.nombre_punto_de_control,
            estado: PuntoDeControl.estado === 1 ? "Activo" : "Inactivo", // Asumiendo que estado 1 es activo
            estado_retrasos: PuntoDeControl.estado_retrasos ? "Con retrasos" : "Sin retrasos",
            tipo_de_elemento: tipoElementoMap[PuntoDeControl.tipo_de_elemento] || "Desconocido",
            // Aquí podrías añadir otras propiedades si las necesitas, pero ajustadas al data recibida
            latitud: 0, // No disponible en la data recibida
            longitud: 0, // No disponible en la data recibida
            urlIcono: IconoPuntoDeControl,
        };
    }

    // Configuración de las columnas para la tabla de incidentes
    const columnas = [
        {
            title: "Incidente ID",
            dataIndex: "incidente_id",
            key: "incidente_id",
        },
        {
            title: "Título",
            dataIndex: "titulo",
            key: "titulo",
        },
        {
            title: "Estado del Incidente",
            dataIndex: "estado_incidente",
            key: "estado_incidente",
        },
        {
            title: "Fecha del Incidente",
            dataIndex: "fecha_incidente",
            key: "fecha_incidente",
        },
        {
            title: "Fecha de Registro",
            dataIndex: "fecha_de_registro",
            key: "fecha_de_registro",
        },
        {
            title: "Gravedad",
            dataIndex: "gravedad",
            key: "gravedad",
        },
        {
            title: "Tipo de Incidente",
            dataIndex: "tipo_incidente",
            key: "tipo_incidente",
        },
    ];

    // Renderizado del componente
    return (
        <div>
            <Navbar />
            <div style={{ position: "relative", padding: "20px" }}>
                {loadingPuntoDeControl ? (
                    <Spin size="large" />
                ) : (
                    <DetalleElemento
                        columnas={columnas}
                        elemento={elemento}
                    />
                )}
            </div>
        </div>
    );
};
