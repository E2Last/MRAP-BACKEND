import { useState } from "react";
import { Menu } from "antd";
import { FileTextOutlined, ToolOutlined, BellOutlined, ExperimentOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { DataGrid } from "../DataGrid/DataGrid";
import { DetalleGeneral } from "./DetalleGeneral";

const items = [
    {
        label: 'General',
        key: 'general',
        icon: <FileTextOutlined />
    },
    {
        label: 'Incidencias',
        key: 'incidencias',
        icon: <ToolOutlined />
    },
    {
        label: 'Alarmas',
        key: 'alarmas',
        icon: <BellOutlined />
    },
    {
        label: 'Controles',
        key: 'controles',
        icon: <ExperimentOutlined />
    },
    {
        label: 'Retrasos',
        key: 'retrasos',
        icon: <ClockCircleOutlined />
    },
];

export const DetalleElemento = ({ columnas, data, elemento }) => {
    const [current, setCurrent] = useState('general');

    const onClick = (e) => {
        setCurrent(e.key);
    };

    const footerCreate = () => {
        return (
            <h1></h1>
        );
    };

    return (
        <div className="detalle-elemento-container">
            <Menu 
                onClick={onClick} 
                mode="horizontal" 
                items={items} 
                selectedKeys={[current]} 
                style={{ fontSize: 16 }} 
                className="detalle-elemento-menu"
            />
            {
                current === 'general' ? (
                    <DetalleGeneral elemento={elemento} className="detalle-general" />
                ) : current === 'incidencias' ? (
                    <div className="data-grid-container">
                        <DataGrid data={data} columns={columnas} footerCreate={footerCreate} />
                    </div>
                ) : current === 'alarmas' ? (
                    <h1 className="seccion-titulo">Alarmas</h1>
                ) : current === 'controles' ? (
                    <h1 className="seccion-titulo">Controles</h1>
                ) : current === 'retrasos' ? (
                    <h1 className="seccion-titulo">Retrasos</h1>
                ) : null
            }
        </div>
    );
};
