/**
 * The anchors of /docs, so the dashboard can link into the guide without
 * importing its content module (screenshots and all) into its own bundle.
 * `DocEntry` in docs-content.tsx is typed against this union, so renaming a
 * section there stops the build until the links here follow.
 */
export type DocSectionId =
  | "primeros-pasos"
  | "consultas"
  | "clientes"
  | "propiedades"
  | "propietarios"
  | "importar"
  | "ofertas"
  | "reservas"
  | "disponibilidad"
  | "servicios"
  | "portal"
  | "lo-que-ven-tus-clientes"
  | "equipo"
  | "configuracion"
  | "perfil"
  | "atajos";

export function docsHref(section: DocSectionId) {
  return `/docs#${section}`;
}
