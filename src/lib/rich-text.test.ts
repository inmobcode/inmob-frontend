import { describe, expect, it } from "vitest";

import { isHtml, richTextHtml, richTextPlain } from "./rich-text";

describe("richTextHtml", () => {
  it("wraps plain text lines in paragraphs and escapes them", () => {
    expect(richTextHtml("uno\n\n<b>dos</b>")).toBe("<p>uno</p><p>&lt;b&gt;dos&lt;/b&gt;</p>");
  });

  it("keeps editor formatting", () => {
    expect(richTextHtml("<p>Hola <strong>mundo</strong></p>")).toBe("<p>Hola <strong>mundo</strong></p>");
  });

  it("strips scripts, handlers and javascript: links", () => {
    const out = richTextHtml('<p onclick="x()">a</p><script>alert(1)</script><a href="javascript:alert(1)">l</a><img src=x onerror=alert(1)>');
    expect(out).not.toMatch(/script|onclick|onerror|javascript:|<img/i);
  });

  it("opens links safely", () => {
    expect(richTextHtml('<p><a href="https://a.com">a</a></p>')).toContain('rel="noopener noreferrer nofollow"');
  });
});

describe("richTextPlain / isHtml", () => {
  it("flattens html to words", () => {
    expect(richTextPlain("<p>Hola</p><p>a &amp; b</p>")).toBe("Hola a & b");
  });
  it("detects html", () => {
    expect(isHtml("  <p>x</p>")).toBe(true);
    expect(isHtml("x")).toBe(false);
  });
});
