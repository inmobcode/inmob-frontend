import { describe, expect, it } from "vitest";

import { csvCell, csvSeparator, parseCsv, toCsv } from "./csv";

describe("csvCell", () => {
  it("quotes and doubles inner quotes", () => {
    expect(csvCell('Casa "La Loma"')).toBe('"Casa ""La Loma"""');
    expect(csvCell(null)).toBe('""');
    expect(csvCell(1250)).toBe('"1250"');
  });

  it("defuses text a spreadsheet would run as a formula", () => {
    expect(csvCell("=HYPERLINK(\"x\")")).toBe('"\'=HYPERLINK(""x"")"');
    expect(csvCell("@SUM(A1)")).toBe('"\'@SUM(A1)"');
    expect(csvCell("-2+3 cmd")).toBe('"\'-2+3 cmd"');
  });

  it("leaves phone numbers and negative numbers alone", () => {
    expect(csvCell("+54 9 11 5555-0000")).toBe('"+54 9 11 5555-0000"');
    expect(csvCell(-20)).toBe('"-20"');
  });
});

describe("toCsv", () => {
  it("joins rows with the separator, after a BOM", () => {
    expect(toCsv([["Nombre", "Email"], ["Lucía", "lucia@demo.com"]], ";")).toBe(
      '﻿"Nombre";"Email"\r\n"Lucía";"lucia@demo.com"',
    );
  });

  it("uses a comma only in English", () => {
    expect(csvSeparator("en")).toBe(",");
    expect(csvSeparator("es")).toBe(";");
    expect(csvSeparator("de")).toBe(";");
  });
});

describe("parseCsv", () => {
  it("reads quoted cells, doubled quotes and line breaks inside a cell", () => {
    expect(parseCsv('a,b\r\n"x, y","say ""hi"""\n"two\nlines",z')).toEqual([
      ["a", "b"],
      ["x, y", 'say "hi"'],
      ["two\nlines", "z"],
    ]);
  });

  it("guesses a semicolon or tab from the first line and ignores a BOM", () => {
    expect(parseCsv("\uFEFFNombre;Email\nLucía;lucia@demo.com")).toEqual([
      ["Nombre", "Email"],
      ["Lucía", "lucia@demo.com"],
    ]);
    expect(parseCsv("a\tb\n1\t2")).toEqual([["a", "b"], ["1", "2"]]);
  });

  it("drops empty rows and keeps a last row with no line break", () => {
    expect(parseCsv("a,b\n\n,\n1,2")).toEqual([["a", "b"], ["1", "2"]]);
  });

  it("reads what toCsv writes", () => {
    const rows = [["Nombre", "Notas"], ['Ana "A"', "=cmd"], ["Bo; b", "uno\ndos"]];
    expect(parseCsv(toCsv(rows, ";"))).toEqual([["Nombre", "Notas"], ['Ana "A"', "'=cmd"], ["Bo; b", "uno\ndos"]]);
  });
});
