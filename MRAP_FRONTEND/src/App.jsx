import './styles_app.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// PAGINAS
import { Login } from './pages/login/login'
import { NotFound } from './pages/NotFound/NotFound'
import { Inicio } from './pages/inicio/Inicio'
import { Configuracion } from './pages/configuracion/Configuracion'
import { Cisterna } from './pages/cisterna/Cisterna'
import { DetalleCisterna } from './pages/cisterna/DetalleCisterna'
import { Copa } from './pages/copa/Copa'
import { DetalleCopa } from './pages/copa/DetalleCopa'
import { Bomba } from './pages/bomba/Bomba'
import { DetalleBomba } from './pages/bomba/DetalleBomba'
import { PuntoInterno } from './pages/punto_interno/PuntoInterno'
import { DetallePuntoInterno } from './pages/punto_interno/DetallePuntoInterno'
import { Pozo } from './pages/pozo/Pozo'
import { Punto_de_control } from './pages/punto_de_control/Punto_de_control'
import { DetallePuntoDeControl } from './pages/punto_de_control/DetallePuntoDeControl'
import { Proveedor } from './pages/proveedores/Proveedores'
import { Tipos_de_incidentes } from './pages/tipos_de_incidentes/tipos_de_incidentes'
import { Analisis } from './pages/analisis/Analisis'
import { Unidad } from './pages/unidades/Unidades'
import { Periodicidades } from './pages/periodicidades/Periodicidades'
import { Incidentes } from './pages/incidentes/Incidentes'
import { Parametro } from './pages/parametro/Parametro'
import { Mapa } from './pages/mapa/Mapa'
import { AnalisisIntervaloReferencia } from './pages/analisis_intervalo_referencia/analisis_intervalo_referencia'
import { Controles } from './pages/controles/Controles'
import { DetalleControles } from './pages/controles/DetalleControles'
import { ControlDashboard } from './pages/controles/ControlDashboard'
import { Usuario } from './pages/usuario/usuario'
import { Monitor } from './pages/monitor/monitor'
import { Bateria } from './pages/bateria/Bateria'
import { DetalleBateria } from './pages/bateria/DetalleBateria'
import { DetallePozo } from './pages/pozo/DetallePozo'
import { Incidentes_Alta } from './pages/incidentes/alta'
import { Incidentes_Media } from './pages/incidentes/media'
import { Incidentes_Baja } from './pages/incidentes/baja'
import { UsosBomba } from './pages/bomba/UsosBomba'
import  Alarmas  from './pages/monitor/alarmas/alarmas'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/usuario' element={<Usuario />} />
                <Route path='/login' element={<Login />} />
                <Route path='/inicio' element={<Inicio />} />
                <Route path='/monitor' element={<Monitor />} />
                <Route path='/mapa' element={<Mapa />} />
                <Route path='/configuracion' element={<Configuracion />} />
                <Route path='/configuracion/cisternas' element={<Cisterna />} />
                <Route path='/configuracion/cisternas/:id' element={<DetalleCisterna />} />
                <Route path='/configuracion/copas' element={<Copa />} />
                <Route path='/configuracion/copas/:id' element={<DetalleCopa />} />
                <Route path='/configuracion/baterias' element={<Bateria />} />
                <Route path='/configuracion/baterias/:id' element={<DetalleBateria />} />
                <Route path='/configuracion/pozos' element={<Pozo />} />
                <Route path='/configuracion/pozos/:id' element={<DetallePozo />} />
                <Route path='/configuracion/punto-interno' element={<PuntoInterno />} />
                <Route path='/configuracion/punto-interno/:id' element={<DetallePuntoInterno />} />
                <Route path='/configuracion/bombas' element={<Bomba />} />
                <Route path='/configuracion/bombas/:id' element={<DetalleBomba />} />
                <Route path="/configuracion/bombas/:id/usos" element={<UsosBomba />} />
                <Route path='/configuracion/baterias' element={<Bateria />} />
                <Route path='/configuracion/punto-de-control' element={<Punto_de_control />} />
                <Route path='/configuracion/punto-de-control/:id' element={<DetallePuntoDeControl />} />
                <Route path='/configuracion/unidad' element={<Unidad />} />
                <Route path='/configuracion/periodicidades' element={<Periodicidades />} />
                <Route path='/configuracion/proveedores' element={<Proveedor />} />
                <Route path='/configuracion/tipos_de_incidentes' element={<Tipos_de_incidentes />} />
                <Route path='/configuracion/analisis' element={<Analisis />} />
                <Route path='/configuracion/parametro' element={<Parametro />} />
                <Route path='/incidentes' element={<Incidentes />} />
                <Route path='/incidentes/alta' element={<Incidentes_Alta />} />
                <Route path='/incidentes/media' element={<Incidentes_Media />} />
                <Route path='/incidentes/baja' element={<Incidentes_Baja />} />
                <Route path='/monitor/alarmas/alarmas' element={<Alarmas />} />
                <Route path='/controles' element={<Controles />} />
                <Route path='/controles/:id' element={<DetalleControles />} />
                <Route path='/controles/dashboard' element={<ControlDashboard />} />
                <Route path='/configuracion/analisis_intervalo_referencia' element={<AnalisisIntervaloReferencia />} />

                <Route path='*' element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
