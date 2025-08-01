import { Route, Routes } from "react-router-dom";
import { AttendeeList } from "../components/attendee-list";
import { EventList } from "../components/event-list";
import { CadAttendee } from "../pages/attendees/create";
import { Login } from "../pages";
import { DefaultLayout } from "../layouts";
import { NotFound } from "../404";

export function Router() {
  return (
    /* MINHAS ROTAS */
    <Routes>
      {/* ROTA - PÁGINA NÃO ENCONTRADA */}
      <Route path="*" element={<NotFound />} />
      {/* ROTA - PÁGINA DE LOGIN */}
      <Route path="/" element={<Login />} />
      {/* ROTA - PÁGINA DE CADASTRO DE PARTICIPANTE */}
      <Route path="/cad-attendees" element={<CadAttendee />} />

      {/* ROTA - PÁGINAS DO SITE */}
      <Route path="/" element={<DefaultLayout />}>
        {/* ROTA - TABELAS DE PARTICIPANTES E EVENTOS */}
        <Route
          path="/attendees"
          element={
            // <PrivateRoute>
            <AttendeeList />
            // </PrivateRoute>
          }
        />
        <Route
          path="/events"
          element={
            // <PrivateRoute>
            <EventList />
            // </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}
