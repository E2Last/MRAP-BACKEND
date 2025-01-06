import './Controles.css';
import { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar/Navbar';
import { Spin, Modal, Select, DatePicker, message, Collapse, List } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getControles, useDeleteControl } from '../../pages/controles/controlesQueryAPI';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;
const { Panel } = Collapse;

const ControlDashboard = ({ isDarkMode }) => {
    const [years, setYears] = useState([]);
    const [controlsByYear, setControlsByYear] = useState({});

    const { data: dataControles, isLoading: loadingControles, isError: errorControles } = useQuery({
        queryKey: ['controles', {}], // No usamos parámetros para ignorar paginación
        queryFn: () => getControles({}), // Asegúrate de que getControles maneja la solicitud sin paginación
        onError: (error) => {
            console.error('Error al obtener controles:', error);
            message.error('Hubo un error al cargar los controles.');
        },
        select: (data) => data || { resultados: [] }, // Ignoramos 'pages' ya que no estamos paginando
    });

    useEffect(() => {
        if (dataControles && dataControles.resultados) {
            const controlsByYearMap = {};
            dataControles.resultados.forEach(control => {
                const year = new Date(control.fecha).getFullYear();
                if (!controlsByYearMap[year]) {
                    controlsByYearMap[year] = [];
                }
                controlsByYearMap[year].push(control);
            });

            setControlsByYear(controlsByYearMap);
            setYears(Object.keys(controlsByYearMap).sort((a, b) => b - a)); // Ordenamos los años de más reciente a más antiguo
        }
    }, [dataControles]);

    if (loadingControles) return <Spin size="large" />;
    if (errorControles) return <div>Error al cargar controles</div>;

    return (
        <div className={`fullScreenControles ${isDarkMode ? 'dark-mode' : ''}`}>
            <Navbar />
            <div className="container-controles">
                <Collapse accordion>
                    {years.map(year => (
                        <Panel header={year} key={year}>
                            <List 
                                dataSource={controlsByYear[year]}
                                renderItem={control => (
                                    <List.Item>
                                        <p>Fecha: {new Date(control.fecha).toLocaleDateString()}</p>
                                        <p>Punto de Control: {control.nombre_punto_de_control}</p>
                                        <p>Aprobado: {control.aprobado ? 'Sí' : 'No'}</p>
                                        {/* Aquí puedes añadir más detalles del control */}
                                    </List.Item>
                                )}
                            />
                        </Panel>
                    ))}
                </Collapse>
            </div>
        </div>
    );
};

export { ControlDashboard };