"use client";

import { ArrowRight } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { PropertiesPagination } from "@/components/properties/properties-pagination";
import {
  listAvailabilityBlocks,
  createAvailabilityBlock,
  deleteAvailabilityBlock,
  syncIcal,
} from "@/lib/api/availability";
import { ApiError } from "@/lib/api/client";
import type { Property } from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000";
const BLOCKS_PAGE_SIZE = 10;

export function AvailabilityTab({ property }: { property: Property }) {
  const t = useTranslations("properties.availability");
  const tc = useTranslations("common");
  const queryClient = useQueryClient();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [note, setNote] = useState("");
  const [icalUrl, setIcalUrl] = useState(property.icalImportUrl ?? "");
  const [blocksPage, setBlocksPage] = useState(1);

  const { data: blocks, isLoading } = useQuery({
    queryKey: ["availability", property.id],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listAvailabilityBlocks(token, property.id);
    },
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["availability", property.id] });
  }

  const createMutation = useMutation({
    mutationFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return createAvailabilityBlock(token, property.id, { startDate, endDate, note: note || undefined });
    },
    onSuccess: () => {
      setStartDate("");
      setEndDate("");
      setNote("");
      invalidate();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("blockFailed")),
  });

  const deleteMutation = useMutation({
    mutationFn: (blockId: string) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return deleteAvailabilityBlock(token, property.id, blockId);
    },
    onSuccess: invalidate,
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("unblockFailed")),
  });

  const syncMutation = useMutation({
    mutationFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return syncIcal(token, property.id, icalUrl);
    },
    onSuccess: (result) => {
      toast.success(t("synced", { count: result.importedCount }));
      invalidate();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("syncFailed")),
  });

  const blocksPageCount = Math.max(1, Math.ceil((blocks?.length ?? 0) / BLOCKS_PAGE_SIZE));
  const safeBlocksPage = Math.min(blocksPage, blocksPageCount);
  const pagedBlocks = (blocks ?? []).slice(
    (safeBlocksPage - 1) * BLOCKS_PAGE_SIZE,
    safeBlocksPage * BLOCKS_PAGE_SIZE,
  );

  const exportUrl =
    property.agencySlug && property.status === "PUBLISHED"
      ? `${API_URL}/api/public/${property.agencySlug}/properties/${property.slug}/availability.ics`
      : null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">{t("manual")}</h3>
        <div className="flex flex-wrap items-end gap-2">
          <div className="w-full sm:w-72">
            <DateRangePicker
              start={startDate}
              end={endDate}
              countAs="days"
              placeholder={t("dates")}
              hints={{ first: t("firstDay"), second: t("lastDay") }}
              onChange={(from, to) => {
                setStartDate(from);
                setEndDate(to);
              }}
            />
          </div>
          <Input
            placeholder={t("note")}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-48"
          />
          <Button
            type="button"
            disabled={!startDate || !endDate || createMutation.isPending}
            onClick={() => createMutation.mutate()}
          >
            {t("block")}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">{t("blocked")}</h3>
        {isLoading && <p className="text-sm text-zinc-500">{t("loading")}</p>}
        {blocks && blocks.length === 0 && (
          <p className="text-sm text-zinc-500">{t("noBlocks")}</p>
        )}
        {blocks && blocks.length > 0 && (
          <>
            <ul className="space-y-2">
              {pagedBlocks.map((block) => (
                <li
                  key={block.id}
                  className="flex items-center justify-between rounded-md border p-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{block.source}</Badge>
                    <span>
                      {block.startDate} <ArrowRight className="inline size-3.5 align-[-2px]" /> {block.endDate}
                    </span>
                    {block.note && <span className="text-zinc-500">({block.note})</span>}
                  </div>
                  {block.source === "MANUAL" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(block.id)}
                    >
                      {t("remove")}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
            <PropertiesPagination page={safeBlocksPage} pageCount={blocksPageCount} onChange={setBlocksPage} />
          </>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">{t("sync")}</h3>
        <div className="flex gap-2">
          <Input
            placeholder="https://www.airbnb.com/calendar/ical/..."
            value={icalUrl}
            onChange={(e) => setIcalUrl(e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            disabled={!icalUrl || syncMutation.isPending}
            onClick={() => syncMutation.mutate()}
          >
            {syncMutation.isPending ? t("syncing") : t("syncNow")}
          </Button>
        </div>
      </div>

      {exportUrl && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">{t("export")}</h3>
          <p className="text-xs text-zinc-500">{t("exportHint")}</p>
          <div className="flex gap-2">
            <Input readOnly value={exportUrl} />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(exportUrl);
                toast.success(tc("linkCopied"));
              }}
            >
              {t("copy")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
