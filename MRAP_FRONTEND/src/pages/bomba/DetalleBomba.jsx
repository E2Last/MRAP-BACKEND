import { useParams } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { Spin, Table, Tabs } from "antd"; // Añadimos Tabs para organizar las secciones
import { useQuery } from "@tanstack/react-query";
import { getBomba, getUsosBomba } from "../../pages/bomba/bombaQueryAPI";
import "./DetalleBomba.css"; // Importa el archivo CSS

export const DetalleBomba = () => {
    const { id } = useParams();

    // Query para obtener la información de la bomba
    const { data: bomba, isLoading: loadingBomba } = useQuery({
        queryKey: ['bomba', id],
        queryFn: () => getBomba(id),
    });

    // Query para obtener los usos de la bomba
    const { data: usos, isLoading: loadingUsos } = useQuery({
        queryKey: ['usos-bomba', id],
        queryFn: () => getUsosBomba(id),
    });

    // Configuración de la tabla de detalle de la bomba
    const columnsDetalle = [
        {
            title: "Campo",
            dataIndex: "campo",
            key: "campo",
        },
        {
            title: "Valor",
            dataIndex: "valor",
            key: "valor",
        },
    ];

    const dataSourceDetalle = bomba
        ? [
              { key: "1", campo: "ID", valor: bomba.id },
              { key: "2", campo: "Nombre", valor: bomba.nombre_bomba },
              { key: "3", campo: "Tipo de Elemento", valor: bomba.tipo_elemento?.nombre_tipo_de_elemento || "N/A" },
              { key: "4", campo: "Latitud", valor: bomba.latitud },
              { key: "5", campo: "Longitud", valor: bomba.longitud },
              { key: "6", campo: "Estado", valor: bomba.estado?.descripcion || "N/A" },
              { key: "7", campo: "Localidad", valor: bomba.localidad?.nombre || "N/A" },
          ]
        : [];

    // Configuración de la tabla de usos
    const columnsUsos = [
        {
            title: "Fecha de Uso",
            dataIndex: "fecha",
            key: "fecha",
        },
        {
            title: "Duración (horas)",
            dataIndex: "duracion",
            key: "duracion",
        },
        {
            title: "Descripción",
            dataIndex: "descripcion",
            key: "descripcion",
        },
    ];

    const dataSourceUsos = usos?.map((uso, index) => ({
        key: index,
        fecha: uso.fecha,
        duracion: uso.duracion,
        descripcion: uso.descripcion,
    })) || [];

    return (
        <div>
            <Navbar />
            <div className="detalle-bomba-container">
                <div className="detalle-bomba-content">
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab="Detalle de la Bomba" key="1">
                            {loadingBomba ? (
                                <Spin />
                            ) : (
                                <Table
                                    columns={columnsDetalle}
                                    dataSource={dataSourceDetalle}
                                    pagination={false}
                                    bordered
                                    title={() => `Detalle de Bomba (ID: ${id})`}
                                />
                            )}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Historial de Usos" key="2">
                            {loadingUsos ? (
                                <Spin />
                            ) : (
                                <Table
                                    columns={columnsUsos}
                                    dataSource={dataSourceUsos}
                                    pagination={{ pageSize: 5 }}
                                    bordered
                                    title={() => `Historial de Usos de la Bomba (ID: ${id})`}
                                />
                            )}
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};
