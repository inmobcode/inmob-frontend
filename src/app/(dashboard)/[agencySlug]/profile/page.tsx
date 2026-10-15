"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, CircleQuestionMark, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { initials } from "@/components/dashboard/user-menu";
import { docsHref } from "@/components/docs/docs-sections";
import { FormSection } from "@/components/properties/form-section";
import { RolePill } from "@/components/team/team-parts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword, getProfile, updateProfile, uploadAvatar } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { getAccessToken, updateSessionUser } from "@/lib/auth/session";
import { compressToWebp } from "@/lib/image-compression";
import { useActionBarStore } from "@/lib/store/action-bar-store";

const profileSchema = z.object({
  name: z.string().min(2, "Ingresá tu nombre"),
  email: z.string().email("Email inválido"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Ingresá tu contraseña actual"),
    newPassword: z.string().min(8, "Mínimo 8 caracteres"),
    repeat: z.string(),
  })
  .refine((values) => values.newPassword === values.repeat, { path: ["repeat"], message: "Las contraseñas no coinciden" });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

function PasswordField({
  id,
  label,
  error,
  registration,
  autoComplete,
}: {
  id: string;
  label: string;
  error?: string;
  registration: React.ComponentProps<typeof Input>;
  autoComplete: string;
}) {
  const [shown, setShown] = useState(false);
  return (
    <div className="flex flex-col gap-2.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={shown ? "text" : "password"}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          className="h-11 px-4 pr-12"
          {...registration}
        />
        <button
          type="button"
          aria-label={shown ? "Ocultar contraseña" : "Mostrar contraseña"}
          onClick={() => setShown((current) => !current)}
          className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {shown ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const setActions = useActionBarStore((state) => state.setActions);
  const resetActions = useActionBarStore((state) => state.reset);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(requireToken()),
  });

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "" },
  });
  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", repeat: "" },
  });
  const errors = form.formState.errors;
  const passwordErrors = passwordForm.formState.errors;
  const isDirty = form.formState.isDirty;

  useEffect(() => {
    if (profile) form.reset({ name: profile.name, email: profile.email });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const saveMutation = useMutation({
    mutationFn: (values: ProfileValues) => updateProfile(requireToken(), values),
    onSuccess: (updated) => {
      queryClient.setQueryData(["profile"], updated);
      updateSessionUser({ name: updated.name, email: updated.email });
      form.reset({ name: updated.name, email: updated.email });
      toast.success("Perfil actualizado");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo guardar el perfil"),
  });

  const avatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const token = requireToken();
      setIsCompressing(true);
      const compressed = await compressToWebp(file, { maxSide: 512 });
      setIsCompressing(false);
      return uploadAvatar(token, compressed);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["profile"], updated);
      updateSessionUser({ avatarUrl: updated.avatarUrl ?? null });
      toast.success("Foto actualizada");
    },
    onError: (err) => {
      setIsCompressing(false);
      toast.error(err instanceof ApiError ? err.message : "No se pudo subir la foto");
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (values: PasswordValues) =>
      changePassword(requireToken(), { currentPassword: values.currentPassword, newPassword: values.newPassword }),
    onSuccess: () => {
      passwordForm.reset();
      toast.success("Contraseña cambiada");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo cambiar la contraseña"),
  });

  useEffect(() => {
    setActions({
      title: "Mi perfil",
      isSubmitting: saveMutation.isPending,
      isDirty,
      canSubmit: true,
      saveLabel: "Guardar",
      onSave: form.handleSubmit((values) => saveMutation.mutate(values)),
      onPublish: null,
      onCancel: null,
      extra: (
        <div className="flex items-center gap-1 sm:mr-2">
          <Button type="button" variant="ghost" className="gap-1.5" asChild>
            <a href={docsHref("perfil")} target="_blank" rel="noreferrer" title="Ayuda con mi perfil">
              <CircleQuestionMark />
              <span className="hidden md:inline">Ayuda</span>
            </a>
          </Button>
        </div>
      ),
    });
    return resetActions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, saveMutation.isPending]);

  if (isLoading || !profile) {
    return (
      <div className="flex max-w-2xl animate-pulse flex-col gap-12">
        {[0, 1].map((index) => (
          <div key={index} className="flex flex-col gap-4">
            <div className="h-6 w-48 rounded-full bg-muted" />
            <div className="h-11 w-full rounded-xl bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  const uploading = isCompressing || avatarMutation.isPending;

  return (
    <div className="flex max-w-2xl min-w-0 flex-col gap-12">
      <h1 className="sr-only">Mi perfil</h1>

      <form onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}>
        <FormSection title="Tus datos" description="Cómo te ven los demás en la cuenta de la agencia." shown={false}>
          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label="Cambiar la foto"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="group relative shrink-0 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Avatar className="size-24">
                {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt="" />}
                <AvatarFallback className="bg-secondary font-display text-3xl text-secondary-foreground">
                  {initials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/55 text-background opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {uploading ? <LoaderCircle className="size-5 animate-spin" /> : <Camera className="size-5" />}
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) avatarMutation.mutate(file);
                event.target.value = "";
              }}
            />
            <div className="flex min-w-0 flex-col gap-2">
              <RolePill role={profile.role} className="self-start" />
              <p className="text-sm text-muted-foreground">Tocá la foto para cambiarla.</p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-5">
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" autoComplete="name" aria-invalid={Boolean(errors.name)} className="h-11 px-4" {...form.register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} className="h-11 px-4" {...form.register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
          </div>
        </FormSection>
      </form>

      <form onSubmit={passwordForm.handleSubmit((values) => passwordMutation.mutate(values))}>
        <FormSection title="Contraseña" description="Usá al menos 8 caracteres. Te pedimos la actual para confirmar que sos vos." shown={false}>
          <div className="flex flex-col gap-5">
            <PasswordField
              id="currentPassword"
              label="Contraseña actual"
              autoComplete="current-password"
              error={passwordErrors.currentPassword?.message}
              registration={passwordForm.register("currentPassword")}
            />
            <PasswordField
              id="newPassword"
              label="Contraseña nueva"
              autoComplete="new-password"
              error={passwordErrors.newPassword?.message}
              registration={passwordForm.register("newPassword")}
            />
            <PasswordField
              id="repeat"
              label="Repetí la contraseña nueva"
              autoComplete="new-password"
              error={passwordErrors.repeat?.message}
              registration={passwordForm.register("repeat")}
            />
            <Button type="submit" variant="outline" className="h-10 gap-2 self-start rounded-full px-5" disabled={passwordMutation.isPending}>
              {passwordMutation.isPending ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Cambiando…
                </>
              ) : (
                "Cambiar contraseña"
              )}
            </Button>
          </div>
        </FormSection>
      </form>
    </div>
  );
}
