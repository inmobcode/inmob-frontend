export default function DashboardLoading() {
  return (
    <div role="status" aria-label="Cargando" className="flex flex-1 items-center justify-center py-24">
      <div className="size-6 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
    </div>
  );
}
