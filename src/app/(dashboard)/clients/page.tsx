"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RotateCcw, Search, SearchX, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { ClientCard, ClientCardSkeleton, ClientRow, ClientsTable } from "@/components/clients/client-views";
import { STAGES, type ClientActions } from "@/components/clients/client-parts";
import { CreateClientDialog } from "@/components/clients/create-client-dialog";
import { FilterMenu } from "@/components/filter-menu";
import { ViewSwitch, type ViewMode } from "@/components/properties/view-switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import { listClients, updateClient, type Client, type ClientStage } from "@/lib/api/clients";
import { getAccessToken } from "@/lib/auth/session";
import { gsap, useGSAP } from "@/lib/gsap";
import { distance, duration, ease, media, rowStagger } from "@/lib/motion";
import { CLIENT_STAGE_LABELS } from "@/lib/properties-labels";

const STAGE_PLURALS: Record<ClientStage, string> = {
  LEAD: "Leads",
  CONTACTED: "Contactados",
  NEGOTIATING: "En negociación",
  CLIENT: "Clientes",
  LOST: "Perdidos",
};

const STAGE_OPTIONS = STAGES.map((value) => ({ value, label: STAGE_PLURALS[value] }));

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

export default function ClientsPage() {
  const queryClient = useQueryClient();
  const gridRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<ClientStage[]>([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("grid");

  // Remembered per browser; read after mount so the server and client first render match.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("clients-view");
      if (saved === "list" || saved === "table") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setView(saved);
      }
    } catch {}
  }, []);

  function changeView(next: ViewMode) {
    setView(next);
    try {
      window.localStorage.setItem("clients-view", next);
    } catch {}
  }

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["clients"],
    queryFn: () => listClients(requireToken()),
  });

  const sorted = useMemo(
    () => [...(data ?? [])].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [data],
  );

  const counts = useMemo(() => {
    const result: Record<string, number> = { ALL: sorted.length };
    for (const client of sorted) result[client.stage] = (result[client.stage] ?? 0) + 1;
    return result;
  }, [sorted]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sorted.filter((client) => {
      if (stage.length > 0 && !stage.includes(client.stage)) return false;
      if (!term) return true;
      return [client.name, client.email, client.phone].filter(Boolean).join(" ").toLowerCase().includes(term);
    });
  }, [sorted, stage, search]);

  const stageMutation = useMutation({
    mutationFn: ({ id, next }: { id: string; next: ClientStage }) => updateClient(requireToken(), id, { stage: next }),
    onMutate: ({ id, next }) => {
      queryClient.setQueryData<Client[]>(["clients"], (prev) =>
        prev?.map((client) => (client.id === id ? { ...client, stage: next } : client)),
      );
    },
    onSuccess: (_, { next }) => toast.success(`Pasó a ${CLIENT_STAGE_LABELS[next].toLowerCase()}`),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo cambiar la etapa"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });

  const actions: ClientActions = {
    changeStage: (id, next) => stageMutation.mutate({ id, next }),
  };

  const total = sorted.length;
  const visibleKey = filtered.map((client) => client.id).join(",");
  const hasFilters = stage.length > 0 || search.trim() !== "";

  // Cards settle in one after another whenever the visible set changes.
  useGSAP(
    () => {
      if (!gridRef.current || filtered.length === 0) return;
      const mm = gsap.matchMedia();
      mm.add(media.allowMotion, () => {
        gsap.from(".client-card", {
          opacity: 0,
          y: distance.md,
          duration: duration.macro,
          ease: ease.out,
          stagger: rowStagger,
        });
      });
      return () => mm.revert();
    },
    { scope: gridRef, dependencies: [visibleKey, view] },
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="sr-only">Clientes</h1>

      {!(data && total === 0) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
          {total > 0 && (
            <div className="relative w-full sm:max-w-xl sm:min-w-72 sm:flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre, email o teléfono"
                aria-label="Buscar clientes"
                className="h-10 rounded-full border-transparent bg-foreground/[0.07] pl-10 transition-[background-color,box-shadow,border-color] duration-500 ease-out focus-visible:border-primary/20 focus-visible:bg-card focus-visible:shadow-[0_8px_24px_-12px_oklch(0.3_0.05_160/0.3)] focus-visible:ring-0 dark:bg-foreground/10 dark:focus-visible:bg-card"
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
            {total > 0 && (
              <>
                <FilterMenu
                  name="Etapa"
                  plural="etapas"
                  options={STAGE_OPTIONS}
                  value={stage}
                  onChange={setStage}
                  counts={counts}
                />
                <ViewSwitch value={view} onChange={changeView} />
              </>
            )}
            <CreateClientDialog />
          </div>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/5">
          <div>
            <p className="font-display text-xl">No pudimos cargar los clientes</p>
            <p className="text-sm text-muted-foreground">
              {error instanceof ApiError ? error.message : "Revisá tu conexión e intentá de nuevo."}
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RotateCcw />
            Reintentar
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-6">
          {Array.from({ length: 6 }, (_, index) => (
            <ClientCardSkeleton key={index} />
          ))}
        </div>
      )}

      {data && total === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-card px-6 py-16 text-center ring-1 ring-foreground/5">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <Users className="size-6" />
          </span>
          <div className="flex max-w-sm flex-col gap-1">
            <p className="font-display text-2xl">Todavía no tenés clientes</p>
            <p className="text-sm text-muted-foreground">
              Las consultas del portal y de las ofertas aparecen acá solas. También podés cargar uno a mano.
            </p>
          </div>
          <CreateClientDialog />
        </div>
      )}

      {data && total > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-card px-6 py-16 text-center ring-1 ring-foreground/5">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <SearchX className="size-6" />
          </span>
          <div className="flex max-w-sm flex-col gap-1">
            <p className="font-display text-2xl">Nada coincide con eso</p>
            <p className="text-sm text-muted-foreground">Probá con otro nombre o quitá el filtro de etapa.</p>
          </div>
          {hasFilters && (
            <Button
              variant="outline"
              onClick={() => {
                setStage([]);
                setSearch("");
              }}
            >
              Quitar filtros
            </Button>
          )}
        </div>
      )}

      {filtered.length > 0 && view === "grid" && (
        <div ref={gridRef} className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-6">
          {filtered.map((client) => (
            <ClientCard key={client.id} client={client} actions={actions} />
          ))}
        </div>
      )}

      {filtered.length > 0 && view === "list" && (
        <div ref={gridRef} className="flex flex-col gap-4">
          {filtered.map((client) => (
            <ClientRow key={client.id} client={client} actions={actions} />
          ))}
        </div>
      )}

      {filtered.length > 0 && view === "table" && (
        <div ref={gridRef}>
          <ClientsTable clients={filtered} actions={actions} />
        </div>
      )}
    </div>
  );
}
