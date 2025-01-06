// REACT LEAFLET
import { MapView } from "../../components/Map/MapView";
// COMPONENTES y FUNCIONALIDADES
import { Navbar } from "../../components/Navbar/Navbar";
import { checkLoged } from "../../store/checkLoged";
import { useCheckboxToggle } from "./handleCheckBox";
// ANT DESIGN
import { FilterFilled } from "@ant-design/icons";
import { Menu, Checkbox, Spin } from "antd";
// REACT QUERY
import { useQuery } from "@tanstack/react-query";
import './stylesMap.css';
import './styles.css';
import { useShowCisternas, useShowCopas, useShowPozos, useShowBaterias } from "../../pages/mapa/MapaQueryAPI";
import { useShowPuntosInternos } from "../../pages/mapa/MapaQueryAPI";
// ELEMENTOS
import { getPosicionesCisternas, getPosicionesCopas, getPosicionesPozos, getPosicionesBaterias } from "../../pages/mapa/MapaQueryAPI";
import { getPosicionesPuntosInternos } from "../../pages/mapa/MapaQueryAPI";

export const Mapa = () => {
    checkLoged();

    const { data: cisternas = [], isLoading: loadingCisternas, isError: errorCisternas } = useQuery({
        queryKey: ['cisternas'],
        queryFn: getPosicionesCisternas
    });

    const { data: copas = [], isLoading: loadingCopas, isError: errorCopas } = useQuery({
        queryKey: ['copas'],
        queryFn: getPosicionesCopas
    });

    const { data: pozos = [], isLoading: loadingPozos, isError: errorPozos } = useQuery({
        queryKey: ['pozos'],
        queryFn: getPosicionesPozos
    });

    const { data: baterias = [], isLoading: loadingBaterias, isError: errorBaterias } = useQuery({
        queryKey: ['baterias'],
        queryFn: getPosicionesBaterias
    });

    const { data: puntosInternos, isLoading: loadingPuntosInternos } = useQuery({
        queryKey: ['puntos_internos'],
        queryFn: getPosicionesPuntosInternos
    })

    const elementos = {
        copas: copas || [],
        cisternas: cisternas || [],
        pozos: pozos || [],
        baterias: baterias || [],
        puntos_internos: puntosInternos || []
    };

    const { mutate: showCisterna } = useShowCisternas();
    const { mutate: showCopas } = useShowCopas();
    const { mutate: showPozos } = useShowPozos();
    const { mutate: showBaterias } = useShowBaterias();
    const { mutate: showPuntosInternos } = useShowPuntosInternos()

    const { show: showCheckCisternas, handleCheckBox: handleShowCisterna } = useCheckboxToggle();
    const { show: showCheckCopas, handleCheckBox: handleShowCopas } = useCheckboxToggle();
    const { show: showCheckPozos, handleCheckBox: handleShowPozos } = useCheckboxToggle();
    const { show: showCheckBaterias, handleCheckBox: handleShowBaterias } = useCheckboxToggle();
    const { show: showCheckPuntosInternos, handleCheckBox: handleShowPuntosInternos } = useCheckboxToggle()

    const handleFilterCisterna = () => {
        showCisterna(cisternas);
        handleShowCisterna(); // unicamente sirve para mostrar el check del componente checkbox de ant
    };

    const handleFilterCopas = () => {
        showCopas(copas);
        handleShowCopas();
    };

    const handleFilterPozos = () => {
        showPozos(pozos);
        handleShowPozos();
    };

    const handleFilterBaterias = () => {
        showBaterias(baterias);
        handleShowBaterias();
    };

    const handleFilterPuntosInternos = () => {
        showPuntosInternos(puntosInternos)
        handleShowPuntosInternos()
    }

    const items = [
        {
            key: 'filtros',
            label: <div>
                <FilterFilled style={{ fontSize: 20, color: 'gray' }} />
                <span style={{ color: 'gray', fontSize: 20 }}> Filtros </span>
            </div>,
            type: 'group',
        },
        {
            label: <div>
                <Checkbox checked={showCheckCisternas} onClick={handleFilterCisterna} />
                <span style={{ fontSize: 16 }}> Cisternas </span>
            </div>
        },
        {
            label: <div>
                <Checkbox checked={showCheckCopas} onClick={handleFilterCopas} />
                <span style={{ fontSize: 16 }}> Copas </span>
            </div>
        },
        {
            label: <div>
                <Checkbox checked={showCheckPozos} onClick={handleFilterPozos} />
                <span style={{ fontSize: 16 }}> Pozos </span>
            </div>
        },
        {
            label: <div>
                <Checkbox checked={showCheckBaterias} onClick={handleFilterBaterias} />
                <span style={{ fontSize: 16 }}> Baterias </span>
            </div>
        },
        {
            label: <div>
                <Checkbox checked={showCheckPuntosInternos} onClick={handleFilterPuntosInternos} />
                <span style={{ fontSize: 16 }}> Punto interno </span>
            </div>
        },
    ];

    // Manejo de carga y errores
    if (loadingCisternas || loadingCopas || loadingPozos || loadingBaterias) {
        return <Spin size='large' />;
    }

    if (errorCisternas || errorCopas || errorPozos || errorBaterias) {
        return <div>Error al cargar los datos</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="container-seccion-mapa">
                <div className="container-menu">
                    <Menu
                        className="menu"
                        mode="inline"
                        theme="light"
                        items={items}
                    />
                </div>
                <div className="container-mapa">
                    <MapView elementos={elementos} centro={[-35.97314863112728, -62.73265094724266]}/>
                </div>
            </div>
        </div>
    );
};
