/**
 * Datos de la empresa que aparecen en los Términos y en la Política de
 * privacidad. Los valores entre corchetes están pendientes: completarlos antes
 * de publicar (la Ley 25.326, art. 6, pide identificar al responsable y su
 * domicilio).
 */
export const LEGAL_ENTITY = {
  name: "[Razón social]",
  taxId: "[CUIT]",
  address: "[Domicilio legal]",
  jurisdiction: "[Ciudad Autónoma de Buenos Aires]",
  contactEmail: "hola@tivvo.app",
  privacyEmail: "privacidad@tivvo.app",
} as const;

/** Fecha desde la que rige la versión publicada de ambos documentos. */
export const LEGAL_UPDATED_AT = "14 de octubre de 2026";
