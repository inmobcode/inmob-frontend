"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { Map as MapLibreMap, Marker, NavigationControl, setWorkerUrl } from "maplibre-gl";
import { useEffect, useRef } from "react";

// Free, key-less vector tiles (OpenFreeMap) in a light style that suits the palette.
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";
// Served from /public by scripts/copy-maplibre-worker.mjs (the bundler does not emit it).
setWorkerUrl("/maplibre/maplibre-gl-worker.js");

const DEFAULT_CENTER: [number, number] = [-56.0, -33.0];

function createPin() {
  const pin = document.createElement("div");
  pin.style.cssText =
    "width:28px;height:28px;border-radius:9999px;background:var(--primary);border:4px solid var(--highlight);box-shadow:0 6px 16px -4px rgba(20,60,45,.55);cursor:grab";
  return pin;
}

export default function LocationMap({
  lat,
  lng,
  onChange,
}: {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const onChangeRef = useRef(onChange);
  const lastEmitted = useRef<string>("");
  const initial = useRef({ lat, lng });

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  function place(map: MapLibreMap, latitude: number, longitude: number) {
    if (markerRef.current) {
      markerRef.current.setLngLat([longitude, latitude]);
      return;
    }
    const marker = new Marker({ element: createPin(), draggable: true })
      .setLngLat([longitude, latitude])
      .addTo(map);
    marker.on("dragend", () => {
      const { lat: la, lng: ln } = marker.getLngLat();
      lastEmitted.current = `${la.toFixed(6)},${ln.toFixed(6)}`;
      onChangeRef.current(la, ln);
    });
    markerRef.current = marker;
  }

  useEffect(() => {
    if (!containerRef.current) return;
    const { lat: startLat, lng: startLng } = initial.current;
    const hasStart = startLat != null && startLng != null;
    const map = new MapLibreMap({
      container: containerRef.current,
      style: STYLE_URL,
      center: hasStart ? [startLng, startLat] : DEFAULT_CENTER,
      zoom: hasStart ? 14 : 3,
      attributionControl: { compact: true },
    });
    map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    map.on("click", (event) => {
      const { lat: la, lng: ln } = event.lngLat;
      lastEmitted.current = `${la.toFixed(6)},${ln.toFixed(6)}`;
      onChangeRef.current(la, ln);
    });
    mapRef.current = map;
    if (hasStart) place(map, startLat, startLng);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Follow coordinates typed in the form or taken from a link, but not our own drags/clicks.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || lat == null || lng == null) return;
    place(map, lat, lng);
    if (lastEmitted.current === `${lat.toFixed(6)},${lng.toFixed(6)}`) return;
    map.easeTo({ center: [lng, lat], zoom: Math.max(map.getZoom(), 14), duration: 900 });
  }, [lat, lng]);

  return <div ref={containerRef} className="size-full" />;
}
