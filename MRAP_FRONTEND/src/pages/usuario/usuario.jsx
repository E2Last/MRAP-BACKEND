import './Usuario.css';
import { Navbar } from "../../components/Navbar/Navbar";
import { Divider, Button } from "antd";
import { useUserStore } from "../../store/userStore";
import logo from '../../pages/login/imagenes/marcamuni.png'; // Asegúrate de que la ruta sea correcta

export const Usuario = () => {
    const userInfo = useUserStore((state) => state.userInfo); // Obtenemos la información del usuario desde el store

    return (
        <div className="fullScreen">
            <Navbar />

            <div className='container-usuario'>

                {/* Agrega el logo aquí */}
                <div className='logo-container'>
                    <img src={logo} alt="Logo de la Empresa" className='marcamuni' />
                </div>

                <div className='seccion'>
                    <Divider style={{ color: 'var(--color-text)', fontSize: 20 }}>
                        Información del Usuario
                    </Divider>

                    <div className='seccion-contenido'>
                        <div className="info-usuario">
                            <p><strong>Nombre:</strong> {userInfo ? userInfo.username : 'Invitado'}</p>
                            <p><strong>Correo electrónico:</strong> {userInfo ? userInfo.email || 'No disponible' : 'No disponible'}</p>
                            <p><strong>Rol:</strong> {userInfo ? userInfo.role || 'No asignado' : 'No asignado'}</p>
                        </div>

                        <Button size='large' className='botonAnt' type='primary' style={{ background: '#275B92' }}>
                            Editar Información
                        </Button>
                    </div>
                </div>

                <div className='seccion'>
                    <Divider style={{ color: 'var(--color-text)', fontSize: 20 }}>
                        Preferencias
                    </Divider>

                    <div className='seccion-contenido'>
                        <Button size='large' className='botonAnt' type='primary' style={{ background: '#275B92' }}>
                            Cambiar Contraseña
                        </Button>

                        <Button size='large' className='botonAnt' type='primary' style={{ background: '#275B92' }}>
                            Notificaciones
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
};
