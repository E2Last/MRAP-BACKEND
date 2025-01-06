import { useParams } from "react-router-dom";
import { DetalleElemento } from "../../components/DetalleElemento/DetalleElemento";
import { Navbar } from "../../components/Navbar/Navbar";
import { Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getControl } from "../../pages/controles/controlesQueryAPI";

const parameterNames = {
    1: "Conductividad",
    7: "Presion",
    8: "Olor",
    9: "PH",
    10: "Caudal",
    11: "Dureza",
    12: "Calcio",
    13: "Magnesio",
    14: "Sodio",
    15: "Alcalinidad",
    16: "Cloruros",
    17: "Potasio",
    18: "Cloro Libre",
    19: "Aspecto",
    20: "Escherichia Coli",
    21: "Pseudomonas Aeruginosa",
    22: "Bacterias Mesófilas",
    23: "Bacterias Coliformes",
    24: "Arsénico",
    25: "Flúor",
    26: "Solidos totales",
    27: "Sulfatos",
    28: "Nitratos"
};

export const DetalleControles = () => {
    const { id } = useParams();

    const { data: controlData, isLoading: loadingControl, error: errorControl } = useQuery({
        queryKey: ["control", id],
        queryFn: () => getControl(id),
    });

    let elemento = null;
    let columnas = [];

    if (!loadingControl && controlData) {
        const { control, valores_control } = controlData;

        elemento = {
            id: control.id,
            tipo_control: control.tipo_control.tipo_control,
            punto_de_control: control.punto_de_control.nombre_punto_de_control,
            fecha: new Date(control.fecha).toLocaleDateString(),
            proveedor: control.proveedor.nombre_proveedor,
            analisis: control.analisis.nombre,
            aprobado: control.aprobado ? 'Aprobado' : 'No Aprobado',
            usuario: control.usuario.username,
        };

        console.log('API RESPUESTA:', control);
        console.log('ELEMENTO PROCESADO:', elemento);

        columnas = [
            { title: "Tipo de Control", dataIndex: "tipo_control", key: "tipo_control" },
            { title: "Punto de Control", dataIndex: "punto_de_control", key: "punto_de_control" },
            { title: "Fecha", dataIndex: "fecha", key: "fecha" },
            { title: "Proveedor", dataIndex: "proveedor", key: "proveedor" },
            { title: "Análisis", dataIndex: "analisis", key: "analisis" },
            { title: "Aprobado", dataIndex: "aprobado", key: "aprobado" },
            { title: "Usuario", dataIndex: "usuario", key: "usuario" },
        ];

        valores_control.forEach((param, index) => {
            const paramName = parameterNames[param.parametro.id] || `Parámetro ${param.parametro.nombre}`;
            columnas.push({
                title: paramName,
                dataIndex: paramName,
                key: `param_${index}`,
                render: () => param.valor,
            });
            // Aquí agregamos el valor del parámetro al objeto 'elemento' con una clave única
            elemento[paramName] = param.valor;
        });
    }

    return (
        <div>
            <Navbar />
            <div style={{ position: "relative", padding: "20px" }}>
                {loadingControl ? (
                    <Spin size="large" />
                ) : errorControl ? (
                    <div>Error al cargar el control: {errorControl.message}</div>
                ) : !elemento ? (
                    <div>No se pudo obtener el control o los datos están incompletos.</div>
                ) : (
                    <DetalleElemento columnas={columnas} elemento={elemento} />
                )}
            </div>
        </div>
    );
};
