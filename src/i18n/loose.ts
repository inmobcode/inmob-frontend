/**
 * A translator without next-intl's typed keys, for helpers shared by Server and
 * Client Components (they get one from getTranslations() or useTranslations()
 * and pass it as `t as unknown as LooseTranslator`).
 */
export type LooseTranslator = (key: string, values?: Record<string, string | number>) => string;
