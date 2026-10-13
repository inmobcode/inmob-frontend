"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { AgencyPortal } from "@/components/public/agency-portal";
import type { PublicAgency } from "@/lib/api/agency";
import type { Property } from "@/lib/api/properties";
import type { ResolvedSite } from "@/lib/site-theme";
import { cn } from "@/lib/utils";

export type Viewport = "desktop" | "mobile";

export const DEVICE_WIDTH: Record<Viewport, number> = {
  desktop: 1280,
  mobile: 390,
};
const MOBILE_HEIGHT = 844;

/**
 * Renders `children` into a same-origin iframe, so the page inside answers to
 * the iframe's width: breakpoints and viewport units behave like on a real
 * phone or laptop. The app's stylesheets and font classes are copied in.
 * People can scroll the preview but not click through it.
 */
function DeviceFrame({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: React.ReactNode;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [body, setBody] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write("<!doctype html><html><head></head><body></body></html>");
    doc.close();
    // Mount the page only once the copied stylesheets have loaded, so it never
    // shows unstyled (blue links fading to their real color) for a moment.
    const loading: Promise<unknown>[] = [];
    document.head
      .querySelectorAll('link[rel="stylesheet"], style')
      .forEach((node) => {
        const copy = node.cloneNode(true) as HTMLElement;
        if (copy instanceof HTMLLinkElement) {
          loading.push(
            new Promise((resolve) => {
              copy.addEventListener("load", resolve, { once: true });
              copy.addEventListener("error", resolve, { once: true });
            }),
          );
        }
        doc.head.appendChild(copy);
      });
    doc.documentElement.className = document.documentElement.className;
    doc.documentElement.classList.remove("dark");
    doc.body.style.margin = "0";
    // A preview is for looking: links and buttons inside it do nothing.
    const block = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    doc.addEventListener("click", block, true);
    doc.addEventListener("submit", block, true);
    let cancelled = false;
    Promise.all(loading).then(() => {
      if (!cancelled) setBody(doc.body);
    });
    return () => {
      cancelled = true;
      doc.removeEventListener("click", block, true);
      doc.removeEventListener("submit", block, true);
    };
  }, []);

  return (
    <>
      <iframe
        ref={iframeRef}
        title="Vista previa del portal"
        style={{ width, height, border: 0, display: "block" }}
      />
      {body && createPortal(children, body)}
    </>
  );
}

/**
 * The agency's real public page with the unsaved changes, filling the space
 * it's given. On desktop it's drawn 1280 px wide and scaled down to fit; on
 * mobile it's a phone-sized frame centered in the space.
 */
export function SitePreview({
  viewport,
  agencySlug,
  agency,
  site,
  properties,
  className,
}: {
  viewport: Viewport;
  agencySlug: string;
  agency: PublicAgency;
  site: ResolvedSite;
  properties: Property[];
  className?: string;
}) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [area, setArea] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = areaRef.current;
    if (!element) return;
    const observer = new ResizeObserver(() =>
      setArea({ width: element.clientWidth, height: element.clientHeight }),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const width = DEVICE_WIDTH[viewport];
  const ready = area.width > 0 && area.height > 0;
  // Desktop fills the width; mobile keeps phone proportions and fits the height.
  const scale =
    viewport === "desktop"
      ? Math.min(1, area.width / width)
      : Math.min(1, area.height / MOBILE_HEIGHT, area.width / width);
  const height = viewport === "desktop" ? area.height / scale : MOBILE_HEIGHT;

  return (
    <div
      ref={areaRef}
      className={cn(
        "flex min-h-0 min-w-0 items-start justify-center",
        className,
      )}
    >
      {ready && (
        <div
          className={cn(
            "overflow-hidden bg-white shadow-[0_1px_3px_rgb(0_0_0/0.06),0_20px_50px_-20px_rgb(0_0_0/0.25)] ring-1 ring-foreground/10",
            viewport === "mobile" ? "rounded-[2rem]" : "rounded-xl",
          )}
          style={{ width: width * scale, height: height * scale }}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <DeviceFrame key={viewport} width={width} height={height}>
              <Suspense fallback={null}>
                <AgencyPortal
                  agencySlug={agencySlug}
                  agency={agency}
                  site={site}
                  initialProperties={properties}
                  preview
                />
              </Suspense>
            </DeviceFrame>
          </div>
        </div>
      )}
    </div>
  );
}
