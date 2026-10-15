"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarClock, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import { createTask, deleteTask, listTasks, updateTask, type Task, type TaskFilters } from "@/lib/api/tasks";
import { getAccessToken } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

/** "Vencida hace 2 días", "Hoy", "Mañana", "jue 16 oct". */
export function dueLabel(dueDate: string | null) {
  if (!dueDate) return null;
  const date = parseISO(dueDate);
  const days = differenceInCalendarDays(date, new Date());
  if (days < -1) return `Vencida hace ${-days} días`;
  if (days === -1) return "Venció ayer";
  if (days === 0) return "Hoy";
  if (days === 1) return "Mañana";
  return format(date, "EEE d MMM", { locale: es });
}

function TaskRow({
  task,
  showClient,
  onToggle,
  onDelete,
  busy,
}: {
  task: Task;
  showClient: boolean;
  onToggle: (done: boolean) => void;
  onDelete: () => void;
  busy: boolean;
}) {
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const done = !!task.doneAt;
  const due = dueLabel(task.dueDate);
  return (
    <li className="group flex items-start gap-3 border-b border-foreground/8 py-3 last:border-b-0">
      <input
        type="checkbox"
        checked={done}
        disabled={busy}
        onChange={(event) => onToggle(event.target.checked)}
        aria-label={done ? `Reabrir «${task.title}»` : `Completar «${task.title}»`}
        className="mt-1 size-4 shrink-0 cursor-pointer accent-[var(--primary)]"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className={cn("text-sm text-pretty", done && "text-muted-foreground line-through")}>{task.title}</p>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          {due && (
            <span className={cn("inline-flex items-center gap-1", task.overdue && "font-medium text-destructive")}>
              <CalendarClock className="size-3" />
              {due}
            </span>
          )}
          {showClient && task.client && (
            <Link href={`/${agencySlug}/clients/${task.client.id}`} className="underline-offset-2 hover:underline">
              {task.client.name}
            </Link>
          )}
        </p>
      </div>
      <button
        type="button"
        onClick={onDelete}
        disabled={busy}
        aria-label={`Eliminar «${task.title}»`}
        className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity outline-none group-focus-within:opacity-100 group-hover:opacity-100 hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50 [@media(hover:none)]:opacity-100"
      >
        <Trash2 className="size-3.5" />
      </button>
    </li>
  );
}

/**
 * Follow-ups to do, with a one-line form to add another. `clientId` limits it
 * to one client (and attaches new tasks to them); without it, it's the
 * viewer's own list across clients.
 */
export function TaskList({
  clientId,
  filters,
  limit,
  emptyText = "Nada pendiente.",
}: {
  clientId?: string;
  filters?: TaskFilters;
  limit?: number;
  emptyText?: string;
}) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const queryFilters: TaskFilters = { status: "open", ...filters, ...(clientId ? { clientId } : {}) };
  const queryKey = ["tasks", queryFilters];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => listTasks(requireToken(), queryFilters),
  });

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
  }

  const addMutation = useMutation({
    meta: { affectsSite: false },
    mutationFn: () =>
      createTask(requireToken(), {
        title: title.trim(),
        dueDate: dueDate || null,
        clientId: clientId ?? null,
      }),
    onSuccess: () => {
      setTitle("");
      setDueDate("");
      refresh();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo crear la tarea"),
  });

  const toggleMutation = useMutation({
    meta: { affectsSite: false },
    mutationFn: ({ id, done }: { id: string; done: boolean }) => updateTask(requireToken(), id, { done }),
    onMutate: ({ id }) => {
      // Optimistic: a completed task leaves the open list right away.
      const previous = queryClient.getQueryData<Task[]>(queryKey);
      queryClient.setQueryData<Task[]>(queryKey, (current) => current?.filter((task) => task.id !== id));
      return { previous };
    },
    onError: (err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      toast.error(err instanceof ApiError ? err.message : "No se pudo actualizar la tarea");
    },
    onSettled: refresh,
  });

  const deleteMutation = useMutation({
    meta: { affectsSite: false },
    mutationFn: (id: string) => deleteTask(requireToken(), id),
    onSuccess: refresh,
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo eliminar la tarea"),
  });

  const tasks = limit ? data?.slice(0, limit) : data;
  const canAdd = title.trim().length >= 2 && !addMutation.isPending;

  return (
    <div className="flex flex-col gap-1">
      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (canAdd) addMutation.mutate();
        }}
      >
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Nueva tarea: llamar, enviar fotos, visitar…"
          aria-label="Título de la tarea"
          maxLength={200}
          className="h-10 min-w-48 flex-1 rounded-full bg-foreground/[0.05] px-4"
        />
        <Input
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          aria-label="Fecha límite"
          className="h-10 w-auto rounded-full bg-foreground/[0.05] px-3"
        />
        <Button type="submit" size="icon-lg" className="rounded-full" disabled={!canAdd} aria-label="Agregar tarea">
          <Plus />
        </Button>
      </form>

      {error && (
        <p className="py-3 text-sm text-muted-foreground">
          {error instanceof ApiError ? error.message : "No pudimos cargar las tareas."}
        </p>
      )}
      {isLoading && <p className="py-3 text-sm text-muted-foreground">Cargando…</p>}
      {tasks && tasks.length === 0 && <p className="py-3 text-sm text-muted-foreground">{emptyText}</p>}
      {tasks && tasks.length > 0 && (
        <ul className="mt-2 flex flex-col">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              showClient={!clientId}
              busy={toggleMutation.isPending || deleteMutation.isPending}
              onToggle={(done) => toggleMutation.mutate({ id: task.id, done })}
              onDelete={() => deleteMutation.mutate(task.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
