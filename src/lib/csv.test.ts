import { describe, expect, it } from "vitest";

import { csvCell, csvSeparator, toCsv } from "./csv";

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
