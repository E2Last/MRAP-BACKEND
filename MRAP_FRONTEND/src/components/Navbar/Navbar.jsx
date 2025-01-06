import './Navbar.css';
import { Menu, Badge, Avatar, Switch, Tooltip } from "antd";
import { NotificationOutlined, SettingOutlined, EnvironmentOutlined, HomeOutlined, UserOutlined, BarChartOutlined, ToolOutlined, ExperimentOutlined, SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserStore } from '../../store/userStore';
import { getUserLoged } from './NavBarQueryAPI';
import { getIncidentesConContador } from '../../pages/incidentes/ContadorGravedades';
import Breadcrumbs from './Breadcrumbs';

export const Navbar = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState('inicio');
    const [userLabel, setUserLabel] = useState('Usuario');
    const [notificaciones, setNotificaciones] = useState({ Alta: 0, Media: 0, Baja: 0 });

    const { userInfo } = useUserStore.getState();
    const { isLoged } = userInfo;

    // Tema oscuro
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    const toggleTheme = (checked) => {
        setIsDarkMode(checked);
        localStorage.setItem('darkMode', checked);
        document.body.classList.toggle('dark-mode', checked);
    };

    // Cargar usuario logueado
    useEffect(() => {
        const fetchUser = async () => {
            const usuario = await getUserLoged();
            setUserLabel(usuario);
        };
        fetchUser();
    }, [userInfo]);

    // Cargar notificaciones de incidentes
    useEffect(() => {
        const fetchNotificaciones = async () => {
            try {
                const { ContadorGravedades } = await getIncidentesConContador();
                setNotificaciones(ContadorGravedades);
            } catch (error) {
                console.error('Error al cargar notificaciones:', error);
            }
        };
        fetchNotificaciones();
    }, []);

    // Items del menú
    const items = [
        {
            label: userLabel,
            key: 'usuario',
            icon: <Avatar size={32} icon={<UserOutlined />} style={{ backgroundColor: '#F58900' }} />,
        },
        {
            label: 'Inicio',
            key: 'inicio',
            icon: <HomeOutlined />,
        },
        {
            label: (
                <Tooltip
                    title={
                        <div>
                            <p>Alta: {notificaciones.Alta}</p>
                            <p>Media: {notificaciones.Media}</p>
                            <p>Baja: {notificaciones.Baja}</p>
                        </div>
                    }
                >
                    <Badge size="small"
                        count={notificaciones.Alta + notificaciones.Media + notificaciones.Baja}
                        style={{ backgroundColor: isDarkMode ? '#ff4d4f' : '#ff4d4f' }}
                    >
                        <span className={`monitor-label ${isDarkMode ? 'dark-text' : 'light-text'}`}>
                            Monitor
                        </span>
                    </Badge>
                </Tooltip>
            ),
            key: 'monitor',
            icon: <BarChartOutlined />,
        },
        {
            label: 'Incidentes',
            key: 'incidentes',
            icon: <ToolOutlined />,
        },
        {
            label: 'Controles',
            key: 'controles',
            icon: <ExperimentOutlined />,
        },
        {
            key: 'mapa',
            label: 'Mapa',
            icon: <EnvironmentOutlined />,
        },
        {
            key: 'configuracion',
            label: 'Configuración',
            icon: <SettingOutlined />,
        }
    ];

    const handleClick = (e) => {
        setCurrent(e.key);
        if (e.key) {
            navigate('/' + e.key);
        }
    };

    return (
        <div>
            {isLoged && (
                <>
                    <Menu
                        onClick={handleClick}
                        selectedKeys={[current]}
                        mode='horizontal'
                        items={items}
                        className='navbarContainer'
                        theme="dark"
                    />
                    <Breadcrumbs />
                    <div style={{ position: 'fixed', top: 20, right: 20 }}>
                        <Switch
                            checked={isDarkMode}
                            onChange={toggleTheme}
                            checkedChildren={<MoonOutlined />}
                            unCheckedChildren={<SunOutlined />}
                        />
                    </div>
                </>
            )}
        </div>
    );
};
