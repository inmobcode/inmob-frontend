"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ApiError } from "@/lib/api/client";
import { updateProperty, type Property } from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";

export function EssentialsTab({ property }: { property: Property }) {
  const queryClient = useQueryClient();
  const c = property.classification;
  const [form, setForm] = useState({
    managementName: c?.managementName ?? "",
    managementEmail: c?.managementEmail ?? "",
    managementPhone: c?.managementPhone ?? "",
    managementCompany: c?.managementCompany ?? "",
    vendorPropertyName: c?.vendorPropertyName ?? "",
    website: c?.website ?? "",
    commission: c?.commission ?? "",
    license: c?.license ?? "",
  });
  const [thirdPartyPermission, setThirdPartyPermission] = useState(
    c?.thirdPartyPermission ?? false,
  );

  const saveMutation = useMutation({
    mutationFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return updateProperty(token, property.id, {
        classification: { ...form, thirdPartyPermission },
      });
    },
    onSuccess: () => {
      toast.success("Essentials guardado");
      queryClient.invalidateQueries({ queryKey: ["property", property.id] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo guardar"),
  });

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [field]: e.target.value });
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h3 className="mb-2 text-sm font-medium">Management</h3>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="managementName">Nombre</FieldLabel>
            <Input id="managementName" value={form.managementName} onChange={set("managementName")} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="managementEmail">Email</FieldLabel>
              <Input id="managementEmail" value={form.managementEmail} onChange={set("managementEmail")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="managementPhone">Teléfono</FieldLabel>
              <Input id="managementPhone" value={form.managementPhone} onChange={set("managementPhone")} />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="managementCompany">Empresa</FieldLabel>
            <Input id="managementCompany" value={form.managementCompany} onChange={set("managementCompany")} />
          </Field>
        </FieldGroup>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Vendor & Licensing</h3>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="vendorPropertyName">Nombre de la propiedad (vendor)</FieldLabel>
            <Input id="vendorPropertyName" value={form.vendorPropertyName} onChange={set("vendorPropertyName")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="website">Sitio web del vendor</FieldLabel>
            <Input id="website" value={form.website} onChange={set("website")} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="commission">Comisión</FieldLabel>
              <Input id="commission" value={form.commission} onChange={set("commission")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="license">N° de licencia</FieldLabel>
              <Input id="license" value={form.license} onChange={set("license")} />
            </Field>
          </div>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="thirdPartyPermission">
              Permiso para publicar en portales de terceros
            </FieldLabel>
            <Switch
              id="thirdPartyPermission"
              checked={thirdPartyPermission}
              onCheckedChange={setThirdPartyPermission}
            />
          </Field>
        </FieldGroup>
      </div>

      <Button type="button" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
        Guardar
      </Button>
    </div>
  );
}
