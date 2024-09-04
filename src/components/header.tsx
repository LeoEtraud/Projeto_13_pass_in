import nlwUniteIcon from '../assets/nlw-unite-icon.svg';
import { NavLink } from 'react-router-dom'; // Importando NavLink do React Router

export function Header() {
    return (
        <div className="flex items-center gap-5 py-2">
            <img src={nlwUniteIcon} />

            <nav className="flex items-center gap-5">
                {/* Usando NavLink para gerenciar o estado ativo */}
                <NavLink
                    to="/cad-attendees"
                    className={({ isActive }) =>
                        isActive ? 'border-b-2 border-blue-600' : 'hover:border-b-2 hover:border-blue-400'
                    }
                >
                    Cadastrar
                </NavLink>
                <NavLink
                    to="/events"
                    className={({ isActive }) =>
                        isActive ? 'border-b-2 border-blue-600' : 'hover:border-b-2 hover:border-blue-400'
                    }
                >
                    Eventos
                </NavLink>
                <NavLink
                    to="/attendees"
                    className={({ isActive }) =>
                        isActive ? 'border-b-2 border-blue-600' : 'hover:border-b-2 hover:border-blue-400'
                    }
                >
                    Participantes
                </NavLink>
            </nav>
        </div>
    );
}
