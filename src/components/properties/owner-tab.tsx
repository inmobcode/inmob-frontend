"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Copy, LoaderCircle, Mail, Phone, Plus, RefreshCw, Search, UserRound, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { FormSection as Section } from "@/components/properties/form-section";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";
import { OwnerAccount } from "@/components/owners/owner-account";
import { createOwner, listOwners, regenerateOwnerToken, type PropertyOwner } from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";
import { getPublicOrigin } from "@/lib/public-origin";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}

function OwnerAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <Avatar className={className}>
      <AvatarFallback className="bg-secondary font-semibold text-secondary-foreground">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

export function OwnerTab({
  ownerId,
  onChange,
  currentOwner,
}: {
  ownerId: string;
  onChange: (ownerId: string) => void;
  /** The owner already linked to the property, shown even before the list loads. */
  currentOwner?: PropertyOwner | null;
}) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ name: "", email: "", phone: "", notes: "" });

  const { data: owners, isLoading } = useQuery({
    queryKey: ["owners"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listOwners(token);
    },
  });

  const createMutation = useMutation({
    mutationFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return createOwner(token, {
        name: draft.name.trim(),
        email: draft.email.trim() || undefined,
        phone: draft.phone.trim() || undefined,
        notes: draft.notes.trim() || undefined,
      });
    },
    onSuccess: (owner) => {
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      onChange(owner.id);
      setCreating(false);
      setDraft({ name: "", email: "", phone: "", notes: "" });
      toast.success("Propietario creado y asignado");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo crear el propietario"),
  });

  const regenerateMutation = useMutation({
    mutationFn: (owner: PropertyOwner) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return regenerateOwnerToken(token, owner.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      toast.success("Link regenerado. El anterior ya no funciona.");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo regenerar el link"),
  });

  const selected = owners?.find((owner) => owner.id === ownerId) ?? (ownerId ? currentOwner : null) ?? null;
  const term = search.trim().toLowerCase();
  const visible = (owners ?? []).filter(
    (owner) =>
      !term || [owner.name, owner.email, owner.phone].filter(Boolean).join(" ").toLowerCase().includes(term),
  );

  return (
    <div className="flex max-w-2xl min-w-0 flex-col gap-12">
      <Section
        title="Propietario asignado"
        description="Quién es el dueño de esta propiedad. Un mismo propietario puede tener varias."
        shown={false}
      >
        {selected ? (
          <div className="flex flex-wrap items-start gap-4 rounded-2xl bg-secondary p-5">
            <OwnerAvatar name={selected.name} className="size-12 text-base" />
            <div className="flex min-w-0 flex-1 basis-56 flex-col gap-1.5">
              <p className="font-display text-2xl leading-tight">{selected.name}</p>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                {selected.email && (
                  <a href={`mailto:${selected.email}`} className="inline-flex w-fit items-center gap-2 hover:text-foreground">
                    <Mail className="size-4" />
                    {selected.email}
                  </a>
                )}
                {selected.phone && (
                  <a href={`tel:${selected.phone}`} className="inline-flex w-fit items-center gap-2 hover:text-foreground">
                    <Phone className="size-4" />
                    {selected.phone}
                  </a>
                )}
                {!selected.email && !selected.phone && <span>Sin datos de contacto.</span>}
              </div>
              {selected.notes && <p className="mt-1 text-sm whitespace-pre-line">{selected.notes}</p>}
            </div>
            <Button type="button" variant="ghost" className="h-9 gap-1.5 px-4" onClick={() => onChange("")}>
              <X />
              Quitar
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4 rounded-2xl bg-foreground/[0.04] p-5 text-muted-foreground">
            <span className="flex size-12 items-center justify-center rounded-full bg-foreground/[0.06]">
              <UserRound className="size-5" />
            </span>
            <p className="text-sm">Todavía no hay un propietario asignado. Elegí uno de la lista o creá uno nuevo.</p>
          </div>
        )}
      </Section>

      {selected?.accessToken && (
        <Section
          title="Acceso del propietario"
          description={`Un link de solo lectura para que ${selected.name} vea el estado de sus propiedades (disponibilidad, reservas y pagos), sin contraseña.`}
          shown={false}
        >
          <div className="flex flex-wrap items-center gap-2">
            <Input
              readOnly
              aria-label="Link de acceso del propietario"
              value={typeof window !== "undefined" ? `${getPublicOrigin()}/owner/${selected.accessToken}` : ""}
              onFocus={(event) => event.currentTarget.select()}
              className="min-w-64 flex-1"
            />
            <Button
              type="button"
              variant="outline"
              className="h-10 gap-2 px-5"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(`${getPublicOrigin()}/owner/${selected.accessToken}`);
                  toast.success("Link copiado");
                } catch {
                  toast.error("No se pudo copiar. Seleccioná el link y copialo a mano.");
                }
              }}
            >
              <Copy />
              Copiar link
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-10 gap-2 px-4"
              disabled={regenerateMutation.isPending}
              onClick={() => regenerateMutation.mutate(selected)}
            >
              {regenerateMutation.isPending ? <LoaderCircle className="animate-spin" /> : <RefreshCw />}
              Regenerar
            </Button>
          </div>
        </Section>
      )}

      {selected && <OwnerAccount owner={selected} />}

      <Section
        title="Elegir propietario"
        description="Buscá entre tus propietarios o sumá uno nuevo."
        shown={false}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-56 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre, email o teléfono"
                aria-label="Buscar propietarios"
                className="rounded-full pl-10"
              />
            </div>
            {!creating && (
              <Button type="button" variant="outline" className="h-10 gap-2 px-5" onClick={() => setCreating(true)}>
                <Plus />
                Nuevo propietario
              </Button>
            )}
          </div>

          {creating && (
            <form
              className="flex flex-col gap-4 rounded-2xl bg-foreground/[0.04] p-5"
              onSubmit={(event) => {
                event.preventDefault();
                if (draft.name.trim() && !createMutation.isPending) createMutation.mutate();
              }}
            >
              <p className="font-display text-lg">Nuevo propietario</p>
              <Field>
                <FieldLabel htmlFor="owner-name">Nombre</FieldLabel>
                <Input
                  id="owner-name"
                  autoFocus
                  value={draft.name}
                  onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="owner-email">Email (opcional)</FieldLabel>
                  <Input
                    id="owner-email"
                    type="email"
                    value={draft.email}
                    onChange={(event) => setDraft({ ...draft, email: event.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="owner-phone">Teléfono (opcional)</FieldLabel>
                  <Input
                    id="owner-phone"
                    type="tel"
                    value={draft.phone}
                    onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="owner-notes">Notas (opcional)</FieldLabel>
                <Textarea
                  id="owner-notes"
                  rows={2}
                  value={draft.notes}
                  onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
                />
              </Field>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" className="h-10 px-5" onClick={() => setCreating(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="h-10 gap-2 px-5" disabled={!draft.name.trim() || createMutation.isPending}>
                  {createMutation.isPending && <LoaderCircle className="animate-spin" />}
                  Crear y asignar
                </Button>
              </div>
            </form>
          )}

          <div role="radiogroup" aria-label="Propietarios" className="flex max-h-96 flex-col gap-1.5 overflow-y-auto">
            {isLoading && <p className="py-4 text-sm text-muted-foreground">Cargando propietarios…</p>}
            {!isLoading && visible.length === 0 && (
              <p className="py-4 text-sm text-muted-foreground">
                {term ? `Nadie coincide con «${search}».` : "Todavía no cargaste propietarios."}
              </p>
            )}
            {visible.map((owner) => {
              const active = owner.id === ownerId;
              return (
                <button
                  key={owner.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChange(owner.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    active ? "bg-secondary" : "hover:bg-foreground/5",
                  )}
                >
                  <OwnerAvatar name={owner.name} className="size-10" />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className={cn("truncate text-sm", active ? "font-semibold" : "font-medium")}>{owner.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {[owner.email, owner.phone].filter(Boolean).join(" · ") || "Sin datos de contacto"}
                    </span>
                  </span>
                  {active && <Check className="size-4 shrink-0 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      </Section>
    </div>
  );
}
