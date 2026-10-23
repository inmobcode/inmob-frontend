"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRightLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Play,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { FormSection as Section } from "@/components/properties/form-section";
import { Segmented } from "@/components/properties/segmented";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ApiError } from "@/lib/api/client";
import {
  removePropertyPhoto,
  reorderPropertyPhotos,
  updateProperty,
  updatePropertyPhoto,
  uploadPropertyPhoto,
  type PhotoSection,
  type Property,
  type PropertyPhoto,
} from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";
import { gsap, useGSAP } from "@/lib/gsap";
import { compressManySmart } from "@/lib/image-compression";
import { distance, duration, ease, media, stagger } from "@/lib/motion";
import { PHOTO_SECTIONS } from "@/lib/property-catalogs";
import { useLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { IMAGE_WIDTH, sizedImage } from "@/lib/image-url";

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

function youtubeThumbnail(url: string) {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null;
}

function PhotoTile({
  photo,
  sections,
  onOpen,
  onCover,
  onMove,
  onRemove,
}: {
  photo: PropertyPhoto;
  sections: { value: string; label: string }[];
  onOpen: () => void;
  onCover: () => void;
  onMove: (section: PhotoSection) => void;
  onRemove: () => void;
}) {
  const t = useTranslations("properties.photos");
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: photo.id });
  const [confirming, setConfirming] = useState(false);

  // Buttons must not start a drag.
  const stop = (event: React.PointerEvent) => event.stopPropagation();

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      data-photo-tile
      className={cn(
        "group relative aspect-[4/3] cursor-grab touch-none overflow-hidden rounded-2xl bg-secondary ring-1 ring-foreground/5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        isDragging && "z-20 cursor-grabbing shadow-[0_24px_48px_-16px_oklch(0.3_0.05_160/0.5)]",
      )}
      {...attributes}
      {...listeners}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={sizedImage(photo.url, IMAGE_WIDTH.thumb)}
        alt=""
        draggable={false}
        onClick={onOpen}
        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {photo.isCover && (
        <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
          <Star className="size-3 fill-amber-400 text-amber-400" />
          {t("cover")}
        </span>
      )}

      <div
        className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-1.5 bg-gradient-to-t from-black/55 to-transparent p-2.5 opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100"
        onPointerDown={stop}
      >
        {!photo.isCover && (
          <button
            type="button"
            aria-label={t("makeCover")}
            title={t("makeCover")}
            onClick={onCover}
            className="flex size-8 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur transition-colors outline-none hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Star className="size-4" />
          </button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={t("move")}
              title={t("move")}
              className="flex size-8 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur transition-colors outline-none hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <ArrowRightLeft className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1.5">
            {sections.map((section) => (
              <DropdownMenuItem
                key={section.value}
                disabled={section.value === photo.section}
                onSelect={() => onMove(section.value)}
                className="rounded-xl py-2"
              >
                {section.label}
                {section.value === photo.section && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          type="button"
          aria-label={confirming ? t("confirmRemove") : t("remove")}
          title={confirming ? t("clickAgain") : t("remove")}
          onClick={() => {
            if (!confirming) {
              setConfirming(true);
              window.setTimeout(() => setConfirming(false), 3000);
              return;
            }
            onRemove();
          }}
          className={cn(
            "flex h-8 items-center justify-center gap-1.5 rounded-full px-2.5 text-xs font-medium backdrop-blur transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            confirming ? "bg-destructive text-white" : "w-8 bg-card/90 text-foreground hover:bg-card",
          )}
        >
          <Trash2 className="size-4" />
          {confirming && t("removeShort")}
        </button>
      </div>
    </div>
  );
}

export function PhotosTab({ property }: { property: Property }) {
  const t = useTranslations("properties.photos");
  const labels = useLabels();
  const queryClient = useQueryClient();
  const queryKey = ["property", property.id];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [uploadSection, setUploadSection] = useState<PhotoSection>("GENERAL");
  const [dragOver, setDragOver] = useState(false);
  const [stage, setStage] = useState<"idle" | "compressing" | "uploading">("idle");
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [videoError, setVideoError] = useState<string | null>(null);
  const [pendingSections, setPendingSections] = useState<string[]>([]);
  const [addingSection, setAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  const isRealEstate = property.listingType === "SALE";
  const ordered = [...property.photos].sort((a, b) => a.position - b.position);
  const known = new Set(PHOTO_SECTIONS);
  // Any section value already in use that isn't one of the fixed ones is a
  // custom section the agent created — each gets its own named group, not a
  // shared "Otras" bucket.
  const customValues = [...new Set(ordered.map((photo) => photo.section).filter((value) => !known.has(value)))];
  for (const value of pendingSections) if (!customValues.includes(value)) customValues.push(value);

  const sections = [
    ...PHOTO_SECTIONS.map((value) => ({ value, label: labels.photoSection(value) })),
    ...customValues.map((value) => ({ value, label: value })),
  ];
  const sectionLabel = (value: string) => sections.find((section) => section.value === value)?.label ?? value;

  const groups = sections
    .map((section) => ({ section, photos: ordered.filter((photo) => photo.section === section.value) }))
    .filter((group) => group.photos.length > 0);
  const flat = groups.flatMap((group) => group.photos);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const refresh = () => queryClient.invalidateQueries({ queryKey });

  /** Applies a change to the cached property right away; the server response replaces it later. */
  function patchCache(change: (photos: PropertyPhoto[]) => PropertyPhoto[]) {
    queryClient.setQueryData<Property>(queryKey, (old) => (old ? { ...old, photos: change(old.photos) } : old));
  }

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const token = requireToken();
      setStage("compressing");
      const compressed = await compressManySmart(
        files,
        isRealEstate ? { targetWidth: 2000, targetHeight: 1500 } : { maxSide: 2048 },
      );
      setStage("uploading");
      setProgress({ done: 0, total: compressed.length });
      let hasCover = property.photos.length > 0;
      for (const file of compressed) {
        await uploadPropertyPhoto(token, property.id, file, { section: uploadSection, isCover: !hasCover });
        hasCover = true;
        setProgress((prev) => ({ ...prev, done: prev.done + 1 }));
      }
    },
    onSuccess: () => setUploadError(null),
    onError: (err) => setUploadError(err instanceof ApiError ? err.message : t("uploadFailed")),
    onSettled: () => {
      setStage("idle");
      refresh();
    },
  });

  const removeMutation = useMutation({
    mutationFn: (photoId: string) => removePropertyPhoto(requireToken(), property.id, photoId),
    onMutate: (photoId) => patchCache((photos) => photos.filter((photo) => photo.id !== photoId)),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("removeFailed")),
    onSettled: refresh,
  });

  const coverMutation = useMutation({
    mutationFn: (photoId: string) => updatePropertyPhoto(requireToken(), property.id, photoId, { isCover: true }),
    onMutate: (photoId) => patchCache((photos) => photos.map((photo) => ({ ...photo, isCover: photo.id === photoId }))),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("coverFailed")),
    onSettled: refresh,
  });

  const moveMutation = useMutation({
    mutationFn: ({ photoId, section }: { photoId: string; section: PhotoSection }) =>
      updatePropertyPhoto(requireToken(), property.id, photoId, { section }),
    onMutate: ({ photoId, section }) =>
      patchCache((photos) => photos.map((photo) => (photo.id === photoId ? { ...photo, section } : photo))),
    onSuccess: (_, { section }) => toast.success(t("moved", { section: sectionLabel(section) })),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("moveFailed")),
    onSettled: refresh,
  });

  const reorderMutation = useMutation({
    mutationFn: (ids: string[]) => reorderPropertyPhotos(requireToken(), property.id, ids),
    onMutate: (ids) =>
      patchCache((photos) =>
        photos.map((photo) => ({ ...photo, position: ids.indexOf(photo.id) })),
      ),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("orderFailed")),
    onSettled: refresh,
  });

  const watermarkMutation = useMutation({
    mutationFn: (watermarkPhotos: boolean) => updateProperty(requireToken(), property.id, { watermarkPhotos }),
    onSuccess: refresh,
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("saveFailed")),
  });

  const videosMutation = useMutation({
    mutationFn: (videoUrls: { url: string }[]) => updateProperty(requireToken(), property.id, { videoUrls }),
    onSuccess: refresh,
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("saveFailed")),
  });

  function addCustomSection() {
    const name = newSectionName.trim();
    if (!name) return;
    if (!sections.some((section) => section.value === name)) {
      setPendingSections((current) => [...current, name]);
    }
    setUploadSection(name);
    setNewSectionName("");
    setAddingSection(false);
  }

  function startUpload(list: FileList | File[] | null) {
    if (!list || list.length === 0) return;
    const images = Array.from(list).filter((file) => file.type.startsWith("image/") || /\.hei[cf]$/i.test(file.name));
    if (images.length === 0) {
      setUploadError(t("onlyImages"));
      return;
    }
    setUploadError(null);
    uploadMutation.mutate(images);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDragEnd(groupPhotos: PropertyPhoto[], event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = groupPhotos.findIndex((photo) => photo.id === active.id);
    const to = groupPhotos.findIndex((photo) => photo.id === over.id);
    if (from < 0 || to < 0) return;
    const reorderedGroup = arrayMove(groupPhotos, from, to);
    // Rebuild the full order: every group in display order, with this one replaced.
    const ids = groups.flatMap((group) =>
      group.photos[0]?.section === groupPhotos[0].section
        ? reorderedGroup.map((photo) => photo.id)
        : group.photos.map((photo) => photo.id),
    );
    reorderMutation.mutate(ids);
  }

  function addVideo() {
    const value = newVideoUrl.trim();
    if (!value) return;
    try {
      const parsed = new URL(value);
      if (!/^https?:$/.test(parsed.protocol)) throw new Error("protocol");
    } catch {
      setVideoError(t("videoInvalid"));
      return;
    }
    if (property.videoUrls.some((video) => video.url === value)) {
      setVideoError(t("videoDuplicate"));
      return;
    }
    setVideoError(null);
    videosMutation.mutate([...property.videoUrls, { url: value }]);
    setNewVideoUrl("");
  }

  // The tiles settle in one after another the first time the gallery shows up.
  const galleryKey = flat.length > 0 ? "has-photos" : "empty";
  useGSAP(
    () => {
      if (flat.length === 0) return;
      const mm = gsap.matchMedia();
      mm.add(media.allowMotion, () => {
        gsap.from("[data-photo-tile]", {
          opacity: 0,
          y: distance.md,
          duration: duration.macro,
          ease: ease.out,
          stagger: stagger.tight,
        });
      });
      return () => mm.revert();
    },
    { scope: galleryRef, dependencies: [galleryKey] },
  );

  const busy = stage !== "idle";
  const percent = stage === "uploading" && progress.total > 0 ? (progress.done / progress.total) * 100 : 0;
  const current = lightbox != null ? flat[lightbox] : null;

  return (
    <div className="flex max-w-5xl min-w-0 flex-col gap-12">
      <Section
        title={t("gallery.title")}
        description={t("gallery.description")}
        shown
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">{t("gallery.uploadTo")}</p>
            <div className="flex flex-wrap items-center gap-1.5">
              <Segmented label={t("gallery.target")} value={uploadSection} options={sections} onChange={setUploadSection} />
              {addingSection ? (
                <Input
                  autoFocus
                  placeholder={t("gallery.newName")}
                  aria-label={t("gallery.newNameLabel")}
                  value={newSectionName}
                  onChange={(event) => setNewSectionName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addCustomSection();
                    }
                    if (event.key === "Escape") {
                      setAddingSection(false);
                      setNewSectionName("");
                    }
                  }}
                  onBlur={() => (newSectionName.trim() ? addCustomSection() : setAddingSection(false))}
                  className="h-9 w-40 rounded-full border-transparent bg-foreground/[0.07] px-4 text-sm dark:bg-foreground/10"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingSection(true)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground/[0.07] px-4 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-foreground/10 dark:hover:bg-foreground/15"
                >
                  <Plus className="size-3.5" />
                  {t("add")}
                </button>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/jpg,image/webp,image/heic"
            onChange={(event) => startUpload(event.target.files)}
            className="hidden"
            id="photo-upload-input"
          />
          <div
            role="button"
            tabIndex={0}
            aria-label={t("gallery.upload")}
            onClick={() => !busy && fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if ((event.key === "Enter" || event.key === " ") && !busy) {
                event.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragOver(false);
              if (!busy) startUpload(event.dataTransfer.files);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-3 rounded-3xl px-6 py-10 text-center transition-all duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              dragOver ? "scale-[1.01] bg-primary/10 ring-2 ring-primary/40" : "bg-foreground/[0.04] hover:bg-foreground/[0.07]",
              busy && "pointer-events-none",
            )}
          >
            <span
              className={cn(
                "flex size-12 items-center justify-center rounded-full transition-colors",
                dragOver ? "bg-primary text-primary-foreground" : "bg-secondary text-primary",
              )}
            >
              <ImagePlus className="size-5" />
            </span>
            {busy ? (
              <div className="flex w-full max-w-xs flex-col items-center gap-2">
                <p className="text-sm font-medium">
                  {stage === "compressing"
                    ? t("gallery.optimizing")
                    : t("gallery.uploading", { current: Math.min(progress.done + 1, progress.total), total: progress.total })}
                </p>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
                    style={{ width: `${stage === "compressing" ? 8 : percent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">
                  {dragOver ? t("gallery.drop") : t("gallery.drag")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("gallery.formats")}
                </p>
              </div>
            )}
          </div>
          {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}

          <div ref={galleryRef} className="flex flex-col gap-10">
            {groups.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("gallery.empty")}</p>
            ) : (
              groups.map((group) => (
                <div key={group.section.value} className="flex flex-col gap-4">
                  <h4 className="flex items-baseline gap-2 text-sm font-semibold">
                    {group.section.label}
                    <span className="font-normal text-muted-foreground tabular-nums">{group.photos.length}</span>
                  </h4>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => handleDragEnd(group.photos, event)}
                  >
                    <SortableContext items={group.photos.map((photo) => photo.id)} strategy={rectSortingStrategy}>
                      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,200px),1fr))] gap-4">
                        {group.photos.map((photo) => (
                          <PhotoTile
                            key={photo.id}
                            photo={photo}
                            sections={sections}
                            onOpen={() => setLightbox(flat.findIndex((item) => item.id === photo.id))}
                            onCover={() => coverMutation.mutate(photo.id)}
                            onMove={(section) => moveMutation.mutate({ photoId: photo.id, section })}
                            onRemove={() => removeMutation.mutate(photo.id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              ))
            )}
          </div>
        </div>
      </Section>

      <Section title={t("watermark.title")} description={t("watermark.description")} shown={null}>
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-foreground/[0.04] p-4">
          <label htmlFor="watermark" className="text-sm font-medium">
            {t("watermark.label")}
          </label>
          <Switch
            id="watermark"
            checked={property.watermarkPhotos}
            onCheckedChange={(checked) => watermarkMutation.mutate(checked)}
          />
        </div>
      </Section>

      <Section title={t("videos.title")} description={t("videos.description")} shown={null}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex max-w-xl gap-2">
              <Input
                placeholder="https://youtube.com/watch?v=…"
                aria-label={t("videos.link")}
                aria-invalid={Boolean(videoError)}
                value={newVideoUrl}
                onChange={(event) => {
                  setNewVideoUrl(event.target.value);
                  setVideoError(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addVideo();
                  }
                }}
              />
              <Button type="button" variant="outline" className="h-10 px-5" onClick={addVideo} disabled={!newVideoUrl.trim()}>
                {t("add")}
              </Button>
            </div>
            {videoError && <p className="text-sm text-destructive">{videoError}</p>}
          </div>

          {property.videoUrls.length > 0 && (
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-4">
              {property.videoUrls.map((video) => {
                const thumbnail = video.thumbnail ?? youtubeThumbnail(video.url);
                let host = video.url;
                try {
                  host = new URL(video.url).hostname.replace(/^www\./, "");
                } catch {}
                return (
                  <li key={video.url} className="group flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/5">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noreferrer"
                      className="relative flex aspect-video items-center justify-center bg-secondary outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {thumbnail && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumbnail} alt="" className="absolute inset-0 size-full object-cover" />
                      )}
                      <span className="relative flex size-11 items-center justify-center rounded-full bg-card/90 text-primary shadow-md transition-transform duration-300 group-hover:scale-110">
                        <Play className="size-5 fill-current" />
                      </span>
                    </a>
                    <div className="flex items-center justify-between gap-2 p-3">
                      <span className="truncate text-sm text-muted-foreground">{host}</span>
                      <button
                        type="button"
                        aria-label={t("videos.remove")}
                        onClick={() => videosMutation.mutate(property.videoUrls.filter((item) => item.url !== video.url))}
                        className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-foreground/5 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Section>

      <Dialog open={current != null} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent
          showCloseButton
          className="gap-0 rounded-3xl p-3 sm:max-w-4xl"
          onKeyDown={(event) => {
            if (lightbox == null) return;
            if (event.key === "ArrowRight") setLightbox((lightbox + 1) % flat.length);
            if (event.key === "ArrowLeft") setLightbox((lightbox - 1 + flat.length) % flat.length);
          }}
        >
          <DialogTitle className="sr-only">{t("lightbox.title")}</DialogTitle>
          {current && (
            <div className="relative flex flex-col gap-3">
              <div className="flex max-h-[75vh] min-h-64 items-center justify-center overflow-hidden rounded-2xl bg-secondary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={current.url} alt="" className="max-h-[75vh] w-auto max-w-full object-contain" />
              </div>
              <div className="flex items-center justify-between gap-3 px-1 text-sm">
                <span className="text-muted-foreground">
                  {sectionLabel(current.section)} · {t("lightbox.position", { current: (lightbox ?? 0) + 1, total: flat.length })}
                </span>
                {current.isCover && (
                  <span className="inline-flex items-center gap-1 font-medium">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    {t("cover")}
                  </span>
                )}
              </div>
              {flat.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label={t("lightbox.previous")}
                    onClick={() => setLightbox(((lightbox ?? 0) - 1 + flat.length) % flat.length)}
                    className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 shadow-md backdrop-blur transition-colors outline-none hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    aria-label={t("lightbox.next")}
                    onClick={() => setLightbox(((lightbox ?? 0) + 1) % flat.length)}
                    className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 shadow-md backdrop-blur transition-colors outline-none hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
