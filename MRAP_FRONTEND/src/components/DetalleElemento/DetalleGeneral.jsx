import { Descriptions, Alert } from "antd";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import NoUbicacion from '../../iconos-mrap/noubicacion.png'
export const DetalleGeneral = ({ elemento }) => {

    // Verificar si 'elemento' es válido antes de proceder
    if (!elemento) {
        return <div>Cargando...</div>; // Mostrar un mensaje de carga si 'elemento' es undefined o null
    }

    // Obtener las claves del objeto 'elemento'
    const keys = Object.keys(elemento);

    // Función para capitalizar la primera letra y reemplazar guiones bajos
    function capitalizarPrimeraLetra(str) {
        if (!str) return ''; // Retorna una cadena vacía si el string es vacío
        str = str.charAt(0).toUpperCase() + str.slice(1);
        str = str.replace(/_/g, ' ');
        return str;
    }

    // Crear los elementos de la descripción a partir de las claves del objeto
    const items = keys.map(propiedad =>
        propiedad !== 'urlIcono' ? {
            label: capitalizarPrimeraLetra(propiedad.replace(/_/g, ' ')),
            children: <strong>{elemento[propiedad]}</strong>,
            span: 2,
        } : null
    ).filter(item => item !== null);

    // Configuración del ícono del mapa
    const iconoPersonalizado = L.icon({
        iconUrl: elemento.urlIcono,
        iconSize: [41, 41],
        iconAnchor: [41, 41],
        popupAnchor: [-18, -40],
    });

    return (
        <div
            style={{
                marginTop: 32,
                marginBottom: 32,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            {/* Mostrar las Descripciones solo si 'items' tiene elementos */}
            {items.length > 0 ? (
                <Descriptions
                    bordered
                    items={items}
                    column={4}
                    className="descriptions-container"
                />
            ) : (
                <div>No hay datos disponibles.</div> // Mensaje si no hay información para mostrar
            )}

            <div style={{ width: "60%", height: "500px", marginTop: "16px" }}>
                {/* Asegurarse de que latitud y longitud existan antes de renderizar el mapa */}
                {elemento.latitud && elemento.longitud ? (
                    <MapContainer
                        center={[elemento.latitud, elemento.longitud]} // Centro inicial del mapa
                        zoom={15} // Nivel de zoom
                        style={{ width: "100%", height: "100%", }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                            position={[elemento.latitud, elemento.longitud]}
                            key={elemento.id}
                            icon={iconoPersonalizado}
                        >
                            <Popup>
                                {`${elemento.tipo_elemento} | ${elemento.nombre}`}
                            </Popup>
                        </Marker>
                    </MapContainer>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                    <img
                    src={NoUbicacion}
                    style={{ width: '400px', // Cambia a la anchura deseada
                        height: '300px', // Cambia a la altura deseada
                        objectFit: 'cover', // Ajusta cómo la imagen se escala dentro del contenedor
                         }}
                  />
                  <p style={{marginTop: '10px', fontSize: '16px' }}>Ubicación no disponible</p>
                </div>
                )}
            </div>
        </div>
    );
};
