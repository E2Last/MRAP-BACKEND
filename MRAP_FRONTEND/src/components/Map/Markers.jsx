import { Marker } from "react-leaflet";
import { Popup } from "react-leaflet";
// ICONOS
import L from 'leaflet'
import Copa from '../../iconos-mrap/CopaGris.png'
import Cisterna from '../../iconos-mrap/CisternaGris.png'
import Pozo from '../../iconos-mrap/PozoGris.png'
import Bateria from '../../iconos-mrap/bateriaicono.png'
import Punto_interno from '../../iconos-mrap/puntodecontrolgrisicon.png'

const iconos = {
    Copa: Copa,
    'Copa(E)': Copa,
    'Copa(S)': Copa,
    Cisterna: Cisterna,
    Pozo: Pozo,
    Bateria: Bateria, 
    PuntoInterno: Punto_interno
}

export const Markers = ({ elementos }) => {
    return (
        <>
            {
                elementos.map(marker => {

                    const iconoPersonalizado = L.icon({
                        iconUrl: iconos[marker.tipo_elemento],
                        iconSize: [41, 41],
                        iconAnchor: [41, 41],
                        popupAnchor: [-18, -40],
                    })

                    if (marker.mostrar === true ) {
                        return (
                            <Marker
                                position={[marker.latitud, marker.longitud]}
                                key={marker.id}
                                icon={iconoPersonalizado}
                            >
                                <Popup>
                                    {`${marker.tipo_elemento} | ${marker.nombre}`}
                                </Popup>
                            </Marker>
                        )
                    }
                })
            }
        </>
    )
}