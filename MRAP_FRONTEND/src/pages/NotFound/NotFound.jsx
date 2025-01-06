import './NotFound.css'
import { checkLoged } from '../../store/checkLoged'
import { Navbar } from '../../components/Navbar/Navbar'

export const NotFound = () => {
    
    checkLoged()

    return (
        <div className="fullScreen">
            <Navbar></Navbar>
            <h1>pagina inexistente</h1>
        </div>
    )
}