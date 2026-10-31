import { describe, expect, it } from "vitest";

import { planImport, suggestMapping } from "./clients-import";

describe("suggestMapping", () => {
  it("recognizes headers in several languages, with accents and spacing", () => {
    expect(suggestMapping(["Nombre", " E-mail ", "Teléfono", "Notas"])).toEqual({
      name: 0,
      email: 1,
      phone: 2,
      notes: 3,
    });
    expect(suggestMapping(["Full Name", "Email address", "Phone number"])).toEqual({
      name: 0,
      email: 1,
      phone: 2,
      notes: null,
    });
  });

  it("uses the headers of our own export in the person's language", () => {
    expect(suggestMapping(["Kunde", "Adresse", "Rufnummer"], { email: "Adresse", phone: "Rufnummer" })).toMatchObject({
      name: 0,
      email: 1,
      phone: 2,
    });
  });

  it("leaves unknown columns out and never uses one twice", () => {
    expect(suggestMapping(["Id", "Color", "Email"])).toEqual({ name: null, email: 2, phone: null, notes: null });
  });
});

describe("planImport", () => {
  const mapping = { name: 0, email: 1, phone: 2, notes: 3 };

  it("sorts rows into create, invalid and duplicates, counting lines from the header", () => {
    const plan = planImport(
      [
        ["Ana Pérez", "ANA@demo.com", "+54 9 11 5555-0000", "VIP"],
        ["A", "a@demo.com", "", ""],
        ["Beto Ruiz", "no-es-un-email", "", ""],
        ["Ana Otra", "ana@demo.com", "", ""],
        ["Carla Gil", "carla@demo.com", "", ""],
        ["Dani Sosa", "dani@demo.com", "1".repeat(60), ""],
      ],
      mapping,
      new Set(["carla@demo.com"]),
    );
    expect(plan.rows).toEqual([
      { line: 2, name: "Ana Pérez", email: "ana@demo.com", phone: "+54 9 11 5555-0000", notes: "VIP" },
    ]);
    expect(plan.invalid).toEqual([
      { line: 3, problem: "name" },
      { line: 4, problem: "email" },
      { line: 7, problem: "phone" },
    ]);
    expect(plan.duplicates.map((row) => row.line)).toEqual([5, 6]);
  });

  it("undoes the apostrophe our export adds and tolerates a column missing from the file", () => {
    const plan = planImport([["Ana Pérez", "ana@demo.com", "", "'=nota"]], { ...mapping, phone: null }, new Set());
    expect(plan.rows[0]).toEqual({ line: 2, name: "Ana Pérez", email: "ana@demo.com", notes: "=nota" });
  });
});
