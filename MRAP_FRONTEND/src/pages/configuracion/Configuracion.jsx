import React, { useState, useEffect } from 'react';
import './Configuracion.css';
import { Navbar } from "../../components/Navbar/Navbar";
import { Divider, Switch, Button } from "antd";
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
export const Configuracion = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme === 'true') {
            setIsDarkMode(true);
            document.body.classList.add('dark-mode');
        }
    }, []);

    const toggleTheme = (checked) => {
        setIsDarkMode(checked);
        localStorage.setItem('darkMode', checked);
        if (checked) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    };

    return (
        <div className="fullScreen">
            <Navbar />

            <div className='container-configuracion'>
                {/* Configuration sections */}
                <div className='seccion'>
                    <Divider style={{ borderColor: 'var(--color-text)', color: 'var(--color-text)', fontSize: 20 }}>
                        Configuración de la red
                    </Divider>
                    <div className='seccion-contenido'>
                        <NavLink to='cisternas'>
                        <Button size='large' className='botonAnt' type='primary'> Cisternas </Button>
                        </NavLink>
                        <NavLink to='copas'>
                            <Button size='large' className='botonAnt' type='primary' style={{ background: '#275B92' }}>
                                Copas
                            </Button>
                        </NavLink>
                        <NavLink to='punto-de-control'>
                            <Button size='large' className='botonAnt' type='primary' style={{ background: '#275B92' }}>
                                Puntos de control
                            </Button>
                        </NavLink>
                        <NavLink to='pozos'>
                            <Button size='large' className='botonAnt' type='primary' style={{ background: '#275B92' }}>
                                Pozos
                            </Button>
                        </NavLink>
                        <NavLink to='baterias'>
                            <Button size='large' className='botonAnt' type='primary' style={{ background: '#275B92' }}>
                                Baterías
                            </Button>
                        </NavLink>
                        <NavLink to='bombas'>
                            <Button size='large' className='botonAnt' type='primary' style={{ background: '#275B92' }}>
                                Bombas
                            </Button>
                        </NavLink>
                        <NavLink to='punto-interno'>
                            <Button size='large' className='botonAnt' type='primary' style={{ background: '#275B92' }}>
                                Puntos internos
                            </Button>
                        </NavLink>
                    </div>
                </div>

                <div className='seccion'>
                    <Divider style={{  borderColor: 'var(--color-text)', color: 'var(--color-text)', fontSize: 20 }}>
                        Configuración de Análisis
                    </Divider>
                    <div className='seccion-contenido'>
                        <NavLink to='analisis'>
                            <Button size='large' className='botonAnt' type='primary' style={{ background: '#275B92' }}>
                                Análisis
                            </Button>
                        </NavLink>
                        <NavLink to='proveedores'>
                            <Button size='large' className='botonAnt' type='primary' style={{ background: '#275B92' }}>
                                Proveedores
                            </Button>
                        </NavLink>
                        <NavLink to='unidad'>
                            <Button size='large' className='botonAnt' type='primary' style={{ background: '#275B92' }}>
                                Unidades
                            </Button>
                        </NavLink>
                        <NavLink to='analisis_intervalo_referencia'>
                            <Button size='large' className='botonAnt' type='primary' style={{ background: '#275B92' }}>
                                Intervalos de referencia
                            </Button>
                        </NavLink>
                        <NavLink to='parametro'>
                            <Button size='large' className='botonAnt' type='primary' style={{ background: '#275B92' }}>
                                Parámetros
                            </Button>
                        </NavLink>
                        <NavLink to='periodicidades'>
                            <Button size='large' className='botonAnt' type='primary' style={{ background: '#275B92' }}>
                                Periodicidades
                            </Button>
                        </NavLink>
                    </div>
                </div>

                <div className='seccion'>
                    <Divider style={{ borderColor: 'var(--color-text)', color: 'var(--color-text)', fontSize: 20 }}>
                        Configuración general
                    </Divider>
                    <div className='seccion-contenido'>
                        <NavLink to='tipos_de_incidentes'>
                            <Button size='large' className='botonAnt' type='primary' style={{ background: '#275B92' }}>
                                Tipos de incidentes
                            </Button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};
