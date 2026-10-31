import { z } from "zod";

/** The fields a CSV row can fill in; what `createClient` accepts. */
export const IMPORT_FIELDS = ["name", "email", "phone", "notes"] as const;
export type ImportField = (typeof IMPORT_FIELDS)[number];

/** Column index in the file for each field, or null when it isn't in the file. */
export type ColumnMapping = Record<ImportField, number | null>;

export const MAX_IMPORT_ROWS = 1000;
export const MAX_IMPORT_BYTES = 2 * 1024 * 1024;

// Longest the API accepts (ClientSchema).
const MAX_NAME = 200;
const MAX_PHONE = 50;

/** Header names other tools and languages use; the ones from our own export are added by the caller. */
const ALIASES: Record<ImportField, string[]> = {
  name: ["name", "full name", "nombre", "nombre completo", "cliente", "client", "contact", "contacto", "nom", "nome", "kunde", "ime"],
  email: ["email", "e-mail", "mail", "correo", "correo electronico", "courriel", "posta", "email address"],
  phone: ["phone", "telefono", "tel", "telephone", "telefone", "mobile", "movil", "celular", "cel", "handy", "telefon", "phone number", "whatsapp"],
  notes: ["notes", "notas", "note", "comments", "comentarios", "notizen", "remarques", "observaciones"],
};

/** Lowercase, no accents, single spaces: "  Teléfono " and "telefono" are the same header. */
function normalize(header: string) {
  return header
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9@\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Guesses which column is which from the header row: an exact match first,
 * then a header that contains the name ("Email address", "Nombre y apellido").
 * A column is used for one field only.
 */
export function suggestMapping(
  headers: string[],
  extraAliases: Partial<Record<ImportField, string>> = {},
): ColumnMapping {
  const normalized = headers.map(normalize);
  const used = new Set<number>();
  const mapping: ColumnMapping = { name: null, email: null, phone: null, notes: null };

  const aliasesOf = (field: ImportField) => {
    const extra = extraAliases[field];
    return [...ALIASES[field], ...(extra ? [normalize(extra)] : [])];
  };

  for (const pass of ["exact", "contains"] as const) {
    for (const field of IMPORT_FIELDS) {
      if (mapping[field] !== null) continue;
      const aliases = aliasesOf(field);
      const index = normalized.findIndex(
        (header, i) =>
          !used.has(i) &&
          header !== "" &&
          aliases.some((alias) =>
            pass === "exact" ? header === alias : alias.length >= 4 && header.includes(alias),
          ),
      );
      if (index >= 0) {
        mapping[field] = index;
        used.add(index);
      }
    }
  }
  return mapping;
}

export interface ImportRow {
  /** Line in the file (the header is line 1), to point at problems. */
  line: number;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

export type ImportProblem = "name" | "email" | "phone";

export interface ImportPlan {
  /** Ready to create. */
  rows: ImportRow[];
  invalid: { line: number; problem: ImportProblem }[];
  /** Emails already in the agency, or repeated earlier in the file. */
  duplicates: ImportRow[];
}

const emailSchema = z.string().email();

/** Our own export defuses formulas with a leading apostrophe; undo it so a round trip is lossless. */
function clean(value: string | undefined) {
  return (value ?? "").trim().replace(/^'(?=[=+\-@])/, "");
}

/**
 * Sorts the data rows (without the header) into the ones to create, the ones
 * that can't be, and the ones that would repeat a client. Emails are compared
 * in lowercase; `existingEmails` must already be.
 */
export function planImport(
  rows: string[][],
  mapping: ColumnMapping,
  existingEmails: ReadonlySet<string>,
): ImportPlan {
  const plan: ImportPlan = { rows: [], invalid: [], duplicates: [] };
  const seen = new Set<string>();

  rows.forEach((cells, index) => {
    const line = index + 2;
    const read = (field: ImportField) => (mapping[field] === null ? "" : clean(cells[mapping[field]]));
    const name = read("name");
    const email = read("email").toLowerCase();
    const phone = read("phone");
    const notes = read("notes");

    if (name.length < 2 || name.length > MAX_NAME) return plan.invalid.push({ line, problem: "name" });
    if (!emailSchema.safeParse(email).success) return plan.invalid.push({ line, problem: "email" });
    if (phone.length > MAX_PHONE) return plan.invalid.push({ line, problem: "phone" });

    const row: ImportRow = { line, name, email, ...(phone && { phone }), ...(notes && { notes }) };
    if (existingEmails.has(email) || seen.has(email)) return plan.duplicates.push(row);
    seen.add(email);
    plan.rows.push(row);
  });
  return plan;
}
