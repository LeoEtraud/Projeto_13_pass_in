import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { IconButton } from "./icon-button";
import { Table } from "./table/table";
import { TableHeader } from "./table/table-header";
import { TableCell } from "./table/table-cell";
import { TableRow } from "./table/table-row";
import { ChangeEvent, useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import { IoIosAddCircle } from "react-icons/io";
import { CreateEventModal } from "../pages/events/modal/createEventModal";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

interface Event {
  id: string;
  title: string;
  slug: string;
  details: string;
  maximumAttendees: number;
  attendeesAmount: number;
}

export function EventList() {
  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString());

    if (url.searchParams.has("search")) {
      return url.searchParams.get("search") ?? "";
    }

    return "";
  });

  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString());

    if (url.searchParams.has("page")) {
      return Number(url.searchParams.get("page"));
    }

    return 1;
  });

  const [total, setTotal] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [isOpen, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / 10));

  useEffect(() => {
    setLoading(true);
    const url = new URL(
      `${
        import.meta.env.VITE_API_URL
      }/events/627cb110-5c68-4c90-8ff1-f3cce15d606e`
    );

    url.searchParams.set("pageIndex", String(page - 1));

    if (search.length > 0) {
      url.searchParams.set("query", search);
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar eventos");
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data.events || []);
        setTotal(data.total || 0);
      })
      .catch((error) => {
        console.error("Erro ao buscar eventos:", error);
        setEvents([]);
        setTotal(0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, search]);

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString());

    url.searchParams.set("search", search);

    window.history.pushState({}, "", url);

    setSearch(search);
  }

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString());

    url.searchParams.set("page", String(page));

    window.history.pushState({}, "", url);

    setPage(page);
  }

  function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setCurrentSearch(event.target.value);
    setCurrentPage(1);
  }

  function goToFirstPage() {
    setCurrentPage(1);
  }

  function goToLastPage() {
    setCurrentPage(totalPages);
  }

  function goToPreviousPage() {
    setCurrentPage(page - 1);
  }

  function goToNextPage() {
    setCurrentPage(page + 1);
  }

  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex gap-3 items-center flex-1">
        <h1 className="text-2xl font-bold">Eventos</h1>
        <div className="px-3 w-72 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
          <Search className="size-4 text-emerald-300" />
          <input
            onChange={onSearchInputChanged}
            value={search}
            className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
            placeholder="Buscar evento..."
          />
        </div>
        <div className="ml-auto">
          <button
            title="Cadastrar Evento"
            onClick={() => {
              setOpenModal(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <IoIosAddCircle size={25} />
          </button>
        </div>
      </div>

      <CreateEventModal isOpen={isOpen} onClose={() => setOpenModal(false)} />

      <Table>
        <thead>
          <tr className="border-b border-white/10">
            <TableHeader style={{ width: 48 }}></TableHeader>
            <TableHeader>Título do evento</TableHeader>
            <TableHeader>Detalhes do evento</TableHeader>
            <TableHeader>Limite de Participantes</TableHeader>
            <TableHeader>Total de Participantes</TableHeader>
            <TableHeader style={{ width: 64 }}></TableHeader>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span>Carregando eventos...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-zinc-400">
                Nenhum evento encontrado
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => {
              return (
                <TableRow key={event.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      className=" size-4 bg-black/20 rounded border border-white/10 accent-orange-400"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-white text-xs">
                        {event.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-white text-xs">
                        {event.details}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-white text-xs">
                        {event.maximumAttendees}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-white">
                        {event.attendeesAmount}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {/*  <button className="bg-black/20 border border-white/10 rounded-md p-1.5">
                                            <MoreHorizontal className="size-4" />
                            </button> */}
                    <IconButton transparent={true}>
                      <MoreHorizontal className="size-4" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </tbody>
        <tfoot>
          <tr>
            <TableCell colSpan={3}>
              {/* Mostrando {events.length} de {total} */}
              {/* {events.length > 1 || total > 1 ? ' eventos' : ' evento'} */}
            </TableCell>
            <TableCell className="text-right" colSpan={3}>
              <div className="inline-flex items-center gap-8">
                <span>
                  Página {page} de {totalPages}
                </span>

                <div className="flex gap-1.5">
                  <IconButton onClick={goToFirstPage} disabled={page === 1}>
                    <ChevronsLeft className="size-4" />
                  </IconButton>
                  <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                    <ChevronLeft className="size-4" />
                  </IconButton>
                  <IconButton
                    onClick={goToNextPage}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="size-4" />
                  </IconButton>
                  <IconButton
                    onClick={goToLastPage}
                    disabled={page === totalPages}
                  >
                    <ChevronsRight className="size-4" />
                  </IconButton>
                </div>
              </div>
            </TableCell>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}
