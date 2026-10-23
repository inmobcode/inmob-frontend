import { parse, TYPE, type MessageFormatElement } from "@formatjs/icu-messageformat-parser";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { LOCALES } from "./config";

const ROOT = join(__dirname, "..", "messages");
type Tree = { [key: string]: string | Tree };

function load(locale: string): Record<string, Tree> {
  const dir = join(ROOT, locale);
  return Object.fromEntries(
    readdirSync(dir)
      .filter((file) => file.endsWith(".json"))
      .map((file) => [file, JSON.parse(readFileSync(join(dir, file), "utf8")) as Tree]),
  );
}

function flatten(tree: Tree, prefix = ""): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? { ...acc, [path]: value } : { ...acc, ...flatten(value, path) };
  }, {});
}

/** Every argument name in a parsed message, branches and rich-text tags included. */
function collect(elements: MessageFormatElement[], names: Set<string>) {
  for (const element of elements) {
    if (element.type === TYPE.literal || element.type === TYPE.pound) continue;
    if (element.type === TYPE.tag) {
      names.add(`<${element.value}>`);
      collect(element.children, names);
      continue;
    }
    names.add(element.value);
    if (element.type === TYPE.plural || element.type === TYPE.select) {
      for (const option of Object.values(element.options)) collect(option.value, names);
    }
  }
}

/**
 * The {placeholders} and <tags> of an ICU message, each once: a language with
 * more plural forms (Croatian's "few") repeats them in more branches. Throws
 * if the message isn't valid ICU, so a stray apostrophe or brace fails here.
 */
function args(message: string): string[] {
  const names = new Set<string>();
  collect(parse(message), names);
  return [...names].sort();
}

const spanish = load("es");

describe.each(LOCALES.filter((locale) => locale !== "es"))("messages in %s", (locale) => {
  const translated = load(locale);

  it("has the same files as Spanish", () => {
    expect(Object.keys(translated).sort()).toEqual(Object.keys(spanish).sort());
  });

  it.each(Object.keys(spanish))("%s has every key, and only those, with the same placeholders", (file) => {
    const base = flatten(spanish[file]);
    const other = flatten(translated[file] ?? {});
    expect(Object.keys(other).sort()).toEqual(Object.keys(base).sort());
    for (const [key, message] of Object.entries(base)) {
      expect(args(other[key] ?? ""), `${file} → ${key}`).toEqual(args(message));
    }
  });
});

describe("Spanish messages", () => {
  it("are never empty", () => {
    for (const [file, tree] of Object.entries(spanish)) {
      for (const [key, message] of Object.entries(flatten(tree))) expect(message.trim(), `${file} → ${key}`).not.toBe("");
    }
  });

  it("are valid ICU", () => {
    for (const [file, tree] of Object.entries(spanish)) {
      for (const [key, message] of Object.entries(flatten(tree))) expect(() => args(message), `${file} → ${key}`).not.toThrow();
    }
  });
});
