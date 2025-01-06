import { useState } from "react";
import { NavLink } from "react-router-dom";

export const useCurrent = (page) => {
    const [current, setCurrent] = useState(page)

    const navegar = () =>{
        if (current == 'inicio'){
            <NavLink to='/inicio'/>
        }

        if (current == 'monitor'){
            <NavLink to='/monitor'/>
        }

        if (current == 'incidentes'){
            <NavLink to='/incidentes'/>
        }

        if (current == 'controles'){
            <NavLink to='/controles'/>
        }

        if (current == 'mapa'){
            <NavLink to='/mapa'/>
        }
    }

    return {navegar}
}