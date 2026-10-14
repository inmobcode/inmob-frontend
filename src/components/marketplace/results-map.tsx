"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { LngLatBounds, Map as MapLibreMap, Marker, NavigationControl, setWorkerUrl } from "maplibre-gl";
import { useEffect, useRef } from "react";

import { shortPrice } from "@/components/marketplace/listing-card";
import type { MarketplaceProperty } from "@/lib/api/marketplace";

// Same key-less tiles as the property editor's map.
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";
setWorkerUrl("/maplibre/maplibre-gl-worker.js");

function priceTag(property: MarketplaceProperty) {
  const tag = document.createElement("button");
  tag.type = "button";
  tag.textContent = shortPrice(property)?.replace(/\s/, " ") ?? "Consultar";
  tag.setAttribute("aria-label", `${property.title}, ${tag.textContent}`);
  tag.style.cssText =
    "padding:6px 10px;border-radius:9999px;font:600 13px/1 var(--font-dm-sans),sans-serif;white-space:nowrap;cursor:pointer;transition:transform .15s ease,background .15s ease,color .15s ease;box-shadow:0 6px 16px -6px rgba(15,53,36,.45)";
  return tag;
}

function paint(tag: HTMLElement, active: boolean) {
  tag.style.background = active ? "#164832" : "#fbfbf8";
  tag.style.color = active ? "#fbfbf8" : "#14281f";
  tag.style.transform = active ? "scale(1.08)" : "scale(1)";
  tag.style.zIndex = active ? "2" : "1";
}

/**
 * The results on a map, each as a price tag. Hovering a card lights up its
 * tag and clicking a tag brings its card into view.
 */
export default function ResultsMap({
  properties,
  activeId,
  onSelect,
}: {
  properties: MarketplaceProperty[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const tagsRef = useRef<Map<string, HTMLElement>>(new Map());
  const boundsRef = useRef<LngLatBounds | null>(null);

  // Frame the results once the map has loaded and has its real size; the
  // container only gets its final width after the layout around it settles.
  function fit(map: MapLibreMap) {
    const bounds = boundsRef.current;
    if (!bounds) return;
    const run = () => map.fitBounds(bounds, { padding: 64, maxZoom: 12, duration: 0 });
    if (map.loaded()) run();
    else map.once("load", run);
  }

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new MapLibreMap({
      container: containerRef.current,
      style: STYLE_URL,
      center: [-58.4, -34.6],
      zoom: 3,
      attributionControl: { compact: true },
    });
    map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;
    const observer = new ResizeObserver(() => {
      map.resize();
      fit(map);
    });
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
    };
     
  }, []);

  // Markers follow the results; the view fits them.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const located = properties.filter((property) => property.lat != null && property.lng != null);
    const markers = located.map((property) => {
      const tag = priceTag(property);
      paint(tag, false);
      tag.addEventListener("click", () => onSelect(property.id));
      tagsRef.current.set(property.id, tag);
      return new Marker({ element: tag }).setLngLat([property.lng!, property.lat!]).addTo(map);
    });
    if (located.length > 0) {
      const bounds = new LngLatBounds();
      for (const property of located) bounds.extend([property.lng!, property.lat!]);
      boundsRef.current = bounds;
      fit(map);
    } else boundsRef.current = null;
    const tags = tagsRef.current;
    return () => {
      for (const marker of markers) marker.remove();
      tags.clear();
    };
     
  }, [properties, onSelect]);

  useEffect(() => {
    for (const [id, tag] of tagsRef.current) paint(tag, id === activeId);
  }, [activeId, properties]);

  return <div ref={containerRef} className="size-full" />;
}
