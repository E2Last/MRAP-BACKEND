import './alarmas.css';
import { Navbar } from "../../../components/Navbar/Navbar";
import { Divider, Button, message, Typography, Table} from "antd";
import { useState } from 'react';

const { Text } = Typography;

export const Alarmas = () => {
    const [data] = useState([
    ]);

        const totalAlarmas = data.length;

        const columns = [
            {
                title: 'Tipo',
                dataIndex: 'tipo',
                key: 'tipo',
            },
            {
                title: 'Punto de Control',
                dataIndex: 'puntoControl',
                key: 'puntoControl',
            },
            {
                title: 'Parámetro',
                dataIndex: 'parametro',
                key: 'parametro',
            },
            {
                title: 'Valor',
                dataIndex: 'valor',
                key: 'valor',
            },
            {
                title: 'Referencia',
                dataIndex: 'referencia',
                key: 'referencia',
            },
            {
                title: 'Fecha',
                dataIndex: 'fecha',
                key: 'fecha',
            },
            {
                title: 'Archivo',
                dataIndex: 'archivo',
                key: 'archivo',
                render: (text) => <a href={`/${text}`} target="_blank" rel="noopener noreferrer">{text}</a>,
            },
        ];
    
        return (
            <div className="alarmas-page">
                <Navbar />
                <div className="alarmas-container">
                    <Divider
                    style={{color: 'var(--color-text)', fontSize: 20 }}>
                        Alarmas
                        </Divider>
                    <Table
                        dataSource={data}
                        columns={columns}
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: '100%' }}
                        bordered
                    />
                    <div className="alarmas-footer">
                        <Text
                        style={{color: 'var(--color-text)' }}>
                        Total: <strong>{totalAlarmas}</strong></Text>
                    </div>
                </div>
            </div>
        );
    };
    
export default Alarmas;