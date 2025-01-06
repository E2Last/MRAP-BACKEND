import { useParams } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { Spin, Table } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getUsosBomba } from "./bombaQueryAPI";
import "./UsosBomba.css";

export const UsosBomba = () => {
    const { id } = useParams();

    const { data: usos, isLoading } = useQuery({
        queryKey: ['usos-bomba', id],
        queryFn: () => getUsosBomba(id),
    });

    const columns = [
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

    const dataSource = usos?.map((uso, index) => ({
        key: index,
        fecha: uso.fecha,
        duracion: uso.duracion,
        descripcion: uso.descripcion,
    })) || [];

    return (
        <div>
            <Navbar />
            <div className="usos-bomba-container">
                <div className="usos-bomba-content">
                    {isLoading ? (
                        <Spin />
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            pagination={{ pageSize: 5 }}
                            bordered
                            title={() => `Historial de Usos de la Bomba (ID: ${id})`}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
