import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Community } from "@shared/schema";
import { cn } from "@/lib/utils";

// Ensure default marker assets load correctly in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export function getCommunityCoordinates(community: Community) {
  const parseCoordinate = (value: unknown): number | null => {
    if (value === null || value === undefined) return null;
    if (typeof value === "number") return Number.isFinite(value) ? value : null;
    const parsed = parseFloat(String(value));
    return Number.isFinite(parsed) ? parsed : null;
  };

  const lat =
    parseCoordinate(community.latitude) ??
    parseCoordinate((community as Record<string, unknown>).lat);
  const lng =
    parseCoordinate(community.longitude) ??
    parseCoordinate((community as Record<string, unknown>).lng);

  if (lat === null || lng === null) {
    return null;
  }

  return { lat, lng };
}

interface CommunityLocationMapProps {
  community: Community;
  coordinates: { lat: number; lng: number };
  className?: string;
  zoom?: number;
}

export default function CommunityLocationMap({
  community,
  coordinates,
  className,
  zoom = 14,
}: CommunityLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [coordinates.lat, coordinates.lng],
      zoom,
      scrollWheelZoom: false,
      doubleClickZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const marker = L.marker([coordinates.lat, coordinates.lng]).addTo(map);
    marker.bindPopup(
      `<strong>${community.name}</strong><br/>${
        community.address || `${community.city}, ${community.state}`
      }`
    );

    // Defer size invalidation to ensure Leaflet renders correctly inside React layouts
    setTimeout(() => {
      map.invalidateSize();
    }, 0);

    return () => {
      map.remove();
    };
  }, [community.address, community.city, community.name, community.state, coordinates.lat, coordinates.lng, zoom]);

  return (
    <div
      ref={mapRef}
      className={cn("w-full h-full rounded-lg", className)}
      role="img"
      aria-label={`Map showing ${community.name} location`}
    />
  );
}
