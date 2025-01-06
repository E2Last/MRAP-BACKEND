import './Inicio.css';
import { SettingOutlined, ToolOutlined, ExperimentOutlined, EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';
import { checkLoged } from "../../store/checkLoged";
import { Navbar } from '../../components/Navbar/Navbar';
import { NavLink } from 'react-router-dom';
import { CustomIcon } from '../../components/icono/Icon';
import React, { useState, useEffect } from 'react';

export const Inicio = () => {
    checkLoged();

    // Leer el estado del modo oscuro
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

    useEffect(() => {
        setIsDarkMode(localStorage.getItem('darkMode') === 'true');
    }, []);

    return (
        <div className={`fullScreen ${isDarkMode ? 'dark' : ''}`}>
            <Navbar />
            <div className='container-inicio'>
                <NavLink to='/monitor' className='navlink'>
                    <CustomIcon size={130} title='Monitor' icono={<SearchOutlined style={{ fontSize: '48px' }} />} />
                </NavLink>
                <NavLink to='/incidentes' className='navlink'>
                    <CustomIcon size={130} title='Incidentes' icono={<ToolOutlined style={{ fontSize: '48px' }} />} />
                </NavLink>
                <NavLink to='/controles' className='navlink'>
                    <CustomIcon size={130} title='Controles' icono={<ExperimentOutlined style={{ fontSize: '48px' }} />} />
                </NavLink>
                <NavLink to='/mapa' className='navlink'>
                    <CustomIcon size={130} title='Mapa' icono={<EnvironmentOutlined style={{ fontSize: '48px' }} />} />
                </NavLink>
                <NavLink to='/configuracion' className='navlink'>
                    <CustomIcon size={130} title='Configuracion' icono={<SettingOutlined style={{ fontSize: '48px' }} />} />
                </NavLink>
            </div>
        </div>
    );
};
