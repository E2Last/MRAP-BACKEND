import './monitor.css';
import { Navbar } from "../../components/Navbar/Navbar";
import { Divider, Button, message } from "antd";
import { NavLink } from 'react-router-dom';
import { ExperimentOutlined, CalendarOutlined, ToolOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import highPriorityIcon from '../../iconos-mrap/PrioridadAlta.png'; // Ruta a tu icono de alta prioridad
import mediumPriorityIcon from '../../iconos-mrap/PrioridadMedia.png'; // Ruta a tu icono de media prioridad
import lowPriorityIcon from '../../iconos-mrap/PrioridadBaja.png'; // Ruta a tu icono de baja prioridad
import { getIncidentesConContador } from '../incidentes/ContadorGravedades';
import RelojArenaAlta from '../../iconos-mrap/RelojArenaAlta.png';
import RelojArenaMedia from '../../iconos-mrap/RelojArenaMedia.png';
import AlarmaAlta from '../../iconos-mrap/AlarmaAlta.png';
import AlarmaBaja from '../../iconos-mrap/AlarmaBaja.png';

export const Monitor = () => {



    //////////////////////////////////////////////// GRAVEDADES ////////////////////////////////////////////////////

    const ContadorGravedades = ({ prioridad }) => {
        const [contador, setContador] = useState({
            Alta: 0,
            Media: 0,
            Baja: 0,
        });

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const { ContadorGravedades } = await getIncidentesConContador();
                    setContador(ContadorGravedades);
                } catch (error) {
                    console.error('Error al obtener el contador de gravedades:', error);
                }
            };

            fetchData();
        }, []);

        return (
            <div>
                {prioridad === 'alta' && <p>{contador.Alta}</p>}
                {prioridad === 'media' && <p>{contador.Media}</p>}
                {prioridad === 'baja' && <p>{contador.Baja}</p>}
            </div>
        );
    };

    return (
        <div className="fullScreen">
            <Navbar />
            {/* ////////////////////////////////////////////////////// MEDICIONES FUERA DE RANGO //////////////////////////////////////////////////// */}
            <div className="container-monitor">
                <div className="seccion">
                    <Divider style={{ color: 'var(--color-text)', fontSize: 15 }}>
                        <ExperimentOutlined style={{ marginRight: 8 }} />
                        Mediciones Fuera de Rango
                    </Divider>
                    <div className="seccion-contenido">
                        <div className="alarm-buttons">
                            <NavLink to="/monitor/alarmas/alarmas">
                                <Button className="priority-button high-priority" style={{ margin: '5px', borderColor: '#c6c6c6' }}>
                                    <img
                                        src={AlarmaAlta}
                                        alt="Icono de Prioridad Alta"
                                        style={{ width: '50px', height: '50px' }}
                                    />
                                    {/* ACA VA EL CONTADOR DE ALERTAS/RETRASOS */}
                                    <span class="button-number"> 0 </span> 
                                    ALARMAS
                                </Button>
                            </NavLink>
                            <NavLink to="">
                                <Button className="priority-button medium-priority" style={{ margin: '5px', borderColor: '#c6c6c6'}} >
                                    <img
                                        src={AlarmaBaja}
                                        alt="Icono de Prioridad Media"
                                        style={{ width: '50px', height: '50px' }}
                                    />
                                    {/* ACA VA EL CONTADOR DE ALERTAS/RETRASOS */}
                                    <span class="button-number"> 0 </span> 
                                    ADVERTENCIAS
                                </Button>
                            </NavLink>
                        </div>
                    </div>

                </div>

                {/* ////////////////////////////////////////////////////// RETRASO EN LOS CONTROLES //////////////////////////////////////////////////// */}
                <div className="seccion">
                    <Divider style={{ color: 'var(--color-text)', fontSize: 15 }}>
                        <CalendarOutlined style={{ marginRight: 8 }} />
                        Retraso en los Controles
                    </Divider>
                    <div className="seccion-contenido">
                        <div className="retraso-buttons">
                            <NavLink to="">
                                <Button className="priority-button high-priority" style={{ margin: '5px', borderColor: '#c6c6c6' }}>
                                    <img
                                        src={RelojArenaAlta}
                                        alt="Icono de Prioridad Alta"
                                        style={{ width: '50px', height: '50px' }}
                                    />
                                    {/* ACA VA EL CONTADOR DE ALERTAS/RETRASOS */}
                                    <span class="button-number"> 0 </span> 
                                    MUY RETRASADOS
                                </Button>
                            </NavLink>
                            <NavLink to="">
                                <Button className="priority-button medium-priority" style={{ margin: '5px', borderColor: '#c6c6c6' }}>
                                    <img
                                        src={RelojArenaMedia}
                                        alt="Icono de Prioridad Media"
                                        style={{ width: '50px', height: '50px' }}
                                    />
                                    {/* ACA VA EL CONTADOR DE ALERTAS/RETRASOS */}
                                    <span class="button-number"> 0 </span> 
                                    RETRASADOS
                                </Button>
                            </NavLink>
                        </div>
                    </div>

                </div>


                {/* ////////////////////////////////////////////////////// INCIDENTES Y PROBLEMAS //////////////////////////////////////////////////// */}
                <div className="seccion">
                    <Divider style={{ color: 'var(--color-text)', fontSize: 15 }}>
                        <ToolOutlined style={{ marginRight: 8 }} />
                        Incidentes y Problemas
                    </Divider>
                    <div className="seccion-contenido">
                        <div className="priority-buttons">
                            <NavLink to="/incidentes/alta">
                                <Button className="priority-button high-priority" style={{ margin: '5px', borderColor: '#c6c6c6' }}>
                                    <img
                                        src={highPriorityIcon}
                                        alt="Icono de Prioridad Alta"
                                        style={{ width: '70px', height: '70px' }}
                                    />
                                    <span class="button-number"> <ContadorGravedades prioridad="alta" /> </span>
                                     {/* Contador integrado */}
                                    PRIORIDAD ALTA
                                </Button>
                            </NavLink>
                            <NavLink to="/incidentes/media">
                                <Button className="priority-button medium-priority" style={{ margin: '5px', borderColor: '#c6c6c6' }}>
                                    <img
                                        src={mediumPriorityIcon}
                                        alt="Icono de Prioridad Media"
                                        style={{ width: '70px', height: '70px' }}
                                    />
                                   <span class="button-number">  <ContadorGravedades prioridad="media" />  </span> {/* Contador integrado */}
                                    PRIORIDAD MEDIA
                                </Button>
                            </NavLink>
                            <NavLink to="/incidentes/baja">
                                <Button className="priority-button low-priority" style={{ margin: '5px', borderColor: '#c6c6c6' }}>
                                    <img
                                        src={lowPriorityIcon}
                                        alt="Icono de Prioridad Baja"
                                        style={{ width: '70px', height: '70px' }}
                                    />
                                    <span class="button-number"> <ContadorGravedades prioridad="baja" /> </span> {/* Contador integrado */}
                                    PRIORIDAD BAJA
                                </Button>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


};
