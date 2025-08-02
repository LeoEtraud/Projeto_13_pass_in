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

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

interface Attendee {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  checkedInAt: string | null;
}

export function AttendeeList() {
  const [search, setSearch] = useState(
    () => new URLSearchParams(window.location.search).get("search") || ""
  );
  const [page, setPage] = useState(
    () => Number(new URLSearchParams(window.location.search).get("page")) || 1
  );
  const [total, setTotal] = useState(0);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Cria a URL da API para buscar os dados
    const url = new URL(`${import.meta.env.VITE_API_URL}/attendees/events/all`);
    url.searchParams.set("pageIndex", String(page - 1));
    if (search) url.searchParams.set("query", search);

    // Busca os dados da API
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar participantes");
        }
        return response.json();
      })
      .then((data) => {
        setAttendees(data.attendees || []);
        setTotal(data.total || 0);
      })
      .catch((error) => {
        console.error("Erro ao buscar participantes:", error);
        setAttendees([]);
        setTotal(0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, search]);

  // Atualiza o total de páginas quando o total de registros muda
  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(total / 10)));
  }, [total]);

  function updateUrlParam(key: string, value: string) {
    const url = new URL(window.location.toString());
    url.searchParams.set(key, value);
    window.history.pushState({}, "", url);
  }

  function setCurrentSearch(searchValue: string) {
    updateUrlParam("search", searchValue);
    setSearch(searchValue);
    setPage(1);
  }

  function setCurrentPage(newPage: number) {
    if (newPage < 1 || newPage > totalPages) return;

    updateUrlParam("page", String(newPage));
    setPage(newPage);
  }

  const onSearchInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentSearch(event.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participantes</h1>
        <div className="px-3 w-72 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
          <Search className="size-4 text-emerald-300" />
          <input
            onChange={onSearchInputChanged}
            value={search}
            className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
            placeholder="Buscar participante..."
          />
        </div>
      </div>

      <Table>
        <thead>
          <tr className="border-b border-white/10">
            <TableHeader style={{ width: 48 }} />
            <TableHeader>Código</TableHeader>
            <TableHeader>Participante</TableHeader>
            <TableHeader>Data de Inscrição</TableHeader>
            <TableHeader>Data do Check-in</TableHeader>
            <TableHeader style={{ width: 64 }} />
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span>Carregando participantes...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : attendees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-zinc-400">
                Nenhum participante encontrado
              </TableCell>
            </TableRow>
          ) : (
            attendees.map((attendee) => (
              <TableRow key={attendee.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    className="size-4 bg-black/20 rounded border border-white/10 accent-orange-400"
                  />
                </TableCell>
                <TableCell>{attendee.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">
                      {attendee.name}
                    </span>
                    <span>{attendee.email}</span>
                  </div>
                </TableCell>
                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                <TableCell>
                  {attendee.checkedInAt ? (
                    dayjs().to(attendee.checkedInAt)
                  ) : (
                    <span className="text-zinc-400">Não fez check-in</span>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton transparent={true}>
                    <MoreHorizontal className="size-4" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <TableCell colSpan={3}>
              {/* Mostrando {attendees.length} de {total}{" "}
              {attendees.length > 1 ? "participantes" : "participante"} */}
            </TableCell>
            <TableCell className="text-right" colSpan={3}>
              <div className="inline-flex items-center gap-8">
                <span>
                  Página {page} de {totalPages}
                </span>
                <div className="flex gap-1.5">
                  <IconButton
                    onClick={() => setCurrentPage(1)}
                    disabled={page === 1}
                  >
                    <ChevronsLeft className="size-4" />
                  </IconButton>
                  <IconButton
                    onClick={() => setCurrentPage(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="size-4" />
                  </IconButton>
                  <IconButton
                    onClick={() => setCurrentPage(page + 1)}
                    disabled={page >= totalPages}
                  >
                    <ChevronRight className="size-4" />
                  </IconButton>
                  <IconButton
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={page >= totalPages}
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
