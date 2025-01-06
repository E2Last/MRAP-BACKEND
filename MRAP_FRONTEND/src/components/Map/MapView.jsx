import React, { useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster';
import './MapView.css';
// Importa tus iconos personalizados
import copaIcon from '../../iconos-mrap/CopaGris.png';
import cisternaIcon from '../../iconos-mrap/CisternaGris.png';
import pozoIcon from '../../iconos-mrap/PozoGris.png';
import bateriaIcon from '../../iconos-mrap/bateriaicono.png';
import puntoDeControlIcon from '../../iconos-mrap/puntodecontrolgrisicon.png';

const iconos = {
    copa: L.icon({
        iconUrl: copaIcon,
        iconSize: [40, 40],
        iconAnchor: [40, 40],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }),
    cisterna: L.icon({
        iconUrl: cisternaIcon,
        iconSize: [40, 40],
        iconAnchor: [40, 40],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }),
    pozo: L.icon({
        iconUrl: pozoIcon,
        iconSize: [40, 40],
        iconAnchor: [40, 40],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }),
    bateria: L.icon({
        iconUrl: bateriaIcon,
        iconSize: [40, 40],
        iconAnchor: [40, 40],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }),
    puntoDeControl: L.icon({
        iconUrl: puntoDeControlIcon,
        iconSize: [40, 40],
        iconAnchor: [40, 40],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }),
};

const MapView = ({ elementos, centro }) => {
    useEffect(() => {
        const map = L.map('map').setView(centro, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const markerClusterGroup = L.markerClusterGroup();

        const addMarkers = (items, icon) => {
            items.forEach(item => {
                const marker = L.marker([item.latitud, item.longitud], { icon });
                marker.bindPopup(`<b>${item.nombre}</b>`);
                markerClusterGroup.addLayer(marker);
            });
        };

        addMarkers(elementos.cisternas, iconos.cisterna);
        addMarkers(elementos.copas, iconos.copa);
        addMarkers(elementos.pozos, iconos.pozo);
        addMarkers(elementos.baterias, iconos.bateria);
        addMarkers(elementos.puntos_internos, iconos.puntoDeControl);

        map.addLayer(markerClusterGroup);

        return () => {
            map.remove();
        };
    }, [elementos, centro]);

    return <div id="map" style={{ height: '100%', width: '100%' }} />;
};

export { MapView };