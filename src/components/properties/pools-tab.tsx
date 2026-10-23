"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLabels } from "@/lib/labels";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckboxGroup } from "@/components/properties/checkbox-group";
import { ApiError } from "@/lib/api/client";
import { createPool, deletePool, listPools, updatePool, type PoolEntityType } from "@/lib/api/pools";
import { getAccessToken } from "@/lib/auth/session";
import { JACUZZI_TYPES, POOL_TYPES } from "@/lib/property-catalogs";

function PoolSection({ propertyId, type }: { propertyId: string; type: PoolEntityType }) {
  const t = useTranslations("properties.pools");
  const labels = useLabels();
  const queryClient = useQueryClient();
  const catalog = type === "POOL" ? POOL_TYPES : JACUZZI_TYPES;

  const { data: pools } = useQuery({
    queryKey: ["pools", propertyId],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listPools(token, propertyId);
    },
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["pools", propertyId] });
  }

  const addMutation = useMutation({
    mutationFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return createPool(token, propertyId, { type, quantity: 1, poolType: [] });
    },
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ poolId, quantity, poolType }: { poolId: string; quantity?: number; poolType?: string[] }) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return updatePool(token, propertyId, poolId, { quantity, poolType });
    },
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (poolId: string) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return deletePool(token, propertyId, poolId);
    },
    onSuccess: invalidate,
  });

  const items = pools?.filter((p) => p.type === type) ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{type === "POOL" ? t("pools") : t("jacuzzis")}</h4>
        <Button type="button" size="sm" variant="outline" onClick={() => addMutation.mutate()}>
          {type === "POOL" ? t("addPool") : t("addJacuzzi")}
        </Button>
      </div>
      {items.map((pool) => (
        <div key={pool.id} className="space-y-2 rounded-md border p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">{t("quantity")}</span>
            <Input
              type="number"
              className="w-24"
              defaultValue={pool.quantity}
              onBlur={(e) => updateMutation.mutate({ poolId: pool.id, quantity: Number(e.target.value) })}
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="ml-auto"
              onClick={() => removeMutation.mutate(pool.id)}
            >
              {t("remove")}
            </Button>
          </div>
          <CheckboxGroup
            options={catalog}
            labelOf={type === "POOL" ? labels.poolType : labels.jacuzziType}
            value={pool.poolType}
            onChange={(value) => updateMutation.mutate({ poolId: pool.id, poolType: value })}
          />
        </div>
      ))}
    </div>
  );
}

export function PoolsTab({ propertyId }: { propertyId: string }) {
  return (
    <div className="space-y-6">
      <PoolSection propertyId={propertyId} type="POOL" />
      <PoolSection propertyId={propertyId} type="JACUZZI" />
    </div>
  );
}
