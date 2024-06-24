import { Route, Routes } from 'react-router-dom'
import { CadAttendee } from '../pages/attendees/create'
import { Login } from '../pages'
import { AttendeeList } from '../pages/list/attendee-list'
import { EventList } from '../pages/list/event-list'
import { DefaultLayout } from '../layouts/defaultLayout'

export function Router() {
    return (
        /* MINHAS ROTAS */
        <Routes>
            {/* PÁGINA INICIAL */}
            <Route path="/" element={<Login />} />

            <Route path="/" element={<DefaultLayout />}>
                {/* USUÁRIOS */}
                <Route path="/pages/attendees" element={<CadAttendee />} />

                {/* TABELAS */}
                <Route path="/attendees" element={<AttendeeList />} />
                <Route path="/events" element={<EventList />} />
            </Route>
        </Routes>
    )
}