"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { compressManySmart } from "@/lib/image-compression";
import { ApiError } from "@/lib/api/client";
import {
  removePropertyPhoto,
  updateProperty,
  uploadPropertyPhoto,
  type PhotoSection,
  type Property,
} from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";
import { PHOTO_SECTIONS } from "@/lib/property-catalogs";

export function PhotosTab({ property }: { property: Property }) {
  const [section, setSection] = useState<PhotoSection>("GENERAL");
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const isRealEstate = property.listingType === "SALE";

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["property", property.id] });
  }

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);

      setIsCompressing(true);
      const compressed = await compressManySmart(
        files,
        isRealEstate ? { targetWidth: 2000, targetHeight: 1500 } : { maxSide: 2048 },
      );
      setIsCompressing(false);

      setProgress({ done: 0, total: compressed.length });
      for (const file of compressed) {
        await uploadPropertyPhoto(token, property.id, file, {
          section,
          isCover: property.photos.length === 0,
        });
        setProgress((prev) => (prev ? { done: prev.done + 1, total: prev.total } : prev));
      }
    },
    onSuccess: () => {
      setProgress(null);
      setError(null);
      invalidate();
    },
    onError: (err) => {
      setProgress(null);
      setIsCompressing(false);
      setError(err instanceof ApiError ? err.message : "No se pudieron subir las fotos");
    },
  });

  const removeMutation = useMutation({
    mutationFn: (photoId: string) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return removePropertyPhoto(token, property.id, photoId);
    },
    onSuccess: invalidate,
  });

  const watermarkMutation = useMutation({
    mutationFn: (watermarkPhotos: boolean) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return updateProperty(token, property.id, { watermarkPhotos });
    },
    onSuccess: invalidate,
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo guardar"),
  });

  const videosMutation = useMutation({
    mutationFn: (videoUrls: { url: string }[]) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return updateProperty(token, property.id, { videoUrls });
    },
    onSuccess: invalidate,
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo guardar"),
  });

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    uploadMutation.mutate(Array.from(fileList));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function addVideo() {
    if (!newVideoUrl.trim()) return;
    videosMutation.mutate([...property.videoUrls, { url: newVideoUrl.trim() }]);
    setNewVideoUrl("");
  }

  function removeVideo(url: string) {
    videosMutation.mutate(property.videoUrls.filter((v) => v.url !== url));
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={section} onValueChange={(value) => setSection(value as PhotoSection)}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PHOTO_SECTIONS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/jpg,image/webp,image/heic"
            onChange={(e) => handleFilesSelected(e.target.files)}
            className="hidden"
            id="photo-upload-input"
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
          >
            Subir fotos
          </Button>
          {isCompressing && <span className="text-sm text-zinc-500">Comprimiendo a WebP...</span>}
          {progress && (
            <span className="text-sm text-zinc-500">
              Subiendo {progress.done}/{progress.total}...
            </span>
          )}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}

        {property.photos.length === 0 ? (
          <p className="text-sm text-zinc-500">Todavía no agregaste fotos.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {property.photos.map((photo) => (
              <div key={photo.id} className="group relative overflow-hidden rounded-md border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="" className="h-32 w-full object-cover" />
                <span className="absolute left-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                  {photo.section}
                </span>
                {photo.isCover && (
                  <span className="absolute left-1 bottom-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                    Portada
                  </span>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100"
                  onClick={() => removeMutation.mutate(photo.id)}
                >
                  Quitar
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">Marca de agua</p>
          <p className="text-sm text-zinc-500">
            Agrega el logo de tu agencia sobre las fotos publicadas.
          </p>
        </div>
        <Switch
          checked={property.watermarkPhotos}
          onCheckedChange={(checked) => watermarkMutation.mutate(checked)}
        />
      </div>

      <Separator />

      <div className="space-y-3">
        <p className="text-sm font-medium">Videos</p>
        <div className="flex gap-2">
          <Input
            placeholder="https://youtube.com/watch?v=..."
            value={newVideoUrl}
            onChange={(e) => setNewVideoUrl(e.target.value)}
          />
          <Button type="button" variant="outline" onClick={addVideo} disabled={!newVideoUrl.trim()}>
            Agregar
          </Button>
        </div>
        {property.videoUrls.length > 0 && (
          <ul className="space-y-1">
            {property.videoUrls.map((video) => (
              <li
                key={video.url}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <a
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-blue-600 hover:underline"
                >
                  {video.url}
                </a>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeVideo(video.url)}>
                  Quitar
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
