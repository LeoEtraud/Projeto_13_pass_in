import nlwUniteIcon from '../assets/nlw-unite-icon.svg';
import { Navlink } from './nav-link';

export function Header() {
    return (
        <div className="flex items-center gap-5 py-2">
            <img src={nlwUniteIcon} />

            <nav className="flex items-center gap-5">
                <Navlink href="/cad-attendees">Cadastrar</Navlink>
                <Navlink href="/events">Eventos</Navlink>
                <Navlink href="/attendees">Participantes</Navlink>
            </nav>
        </div>
    )
}