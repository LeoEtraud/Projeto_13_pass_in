import { Route, Routes } from 'react-router-dom'
import { AttendeeList } from '../components/attendee-list'
import { EventList } from '../components/event-list'
import { CadAttendee } from '../pages/attendees/create'
import { Login } from '../pages'

export function Router() {
    return (
        /* MINHAS ROTAS */
        <Routes>
            {/* PÁGINA INICIAL */}    
            <Route path="/" element={<Login />} />

            {/* USUÁRIOS */}
            <Route path="/pages/attendees" element={<CadAttendee />} />

            {/* TABELAS */}
            <Route path="/attendees" element={<AttendeeList />} />
            <Route path="/events" element={<EventList />} />
        </Routes>
    )
}