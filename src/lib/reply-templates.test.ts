import { describe, expect, it } from "vitest";

import { fillPlaceholders } from "./reply-templates";

describe("fillPlaceholders", () => {
  it("fills every known placeholder", () => {
    expect(
      fillPlaceholders("Hola {firstName}, «{property}» sigue disponible. {me} de {agency}", {
        firstName: "Lucía",
        property: "Casa en La Barra",
        me: "Ana",
        agency: "Inmobiliaria Sol",
      }),
    ).toBe("Hola Lucía, «Casa en La Barra» sigue disponible. Ana de Inmobiliaria Sol");
  });

  it("leaves unknown tokens as typed", () => {
    expect(fillPlaceholders("Precio {precio}", {})).toBe("Precio {precio}");
  });

  it("tidies the gap a missing value leaves", () => {
    expect(fillPlaceholders("Hola {firstName}, ¿cómo estás?", {})).toBe("Hola, ¿cómo estás?");
    expect(fillPlaceholders("Gracias {name} por escribir", { name: null })).toBe("Gracias por escribir");
  });

  it("keeps line breaks", () => {
    expect(fillPlaceholders("Hola {firstName},\n\nSaludos", { firstName: "Tomás" })).toBe("Hola Tomás,\n\nSaludos");
  });
});
