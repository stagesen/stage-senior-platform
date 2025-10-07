import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Community } from '@shared/schema';

// Fix for default markers in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CommunityMapProps {
  communities: Community[];
  onCommunitySelect?: (community: Community) => void;
  selectedCommunityId?: string;
}

export default function CommunityMap({ 
  communities, 
  onCommunitySelect, 
  selectedCommunityId 
}: CommunityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map centered on Colorado
    const map = L.map(mapRef.current).setView([39.6992, -104.9375], 11);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add markers for communities with coordinates
    const validCommunities = communities.filter(
      community => community.latitude && community.longitude
    );

    if (validCommunities.length === 0) return;

    const markers: L.Marker[] = [];
    validCommunities.forEach(community => {
      const lat = parseFloat(community.latitude!);
      const lng = parseFloat(community.longitude!);

      if (isNaN(lat) || isNaN(lng)) return;

      // Create popup content safely using DOM
      const popupDiv = document.createElement('div');
      popupDiv.className = 'p-2';

      const title = document.createElement('h3');
      title.className = 'font-semibold text-sm';
      title.textContent = community.name;
      popupDiv.appendChild(title);

      const location = document.createElement('p');
      location.className = 'text-xs text-gray-600';
      location.textContent = `${community.city}, ${community.state}`;
      popupDiv.appendChild(location);

      if (community.startingPrice) {
        const price = document.createElement('p');
        price.className = 'text-xs mt-1';
        price.textContent = `Starting at $${community.startingPrice.toLocaleString()}`;
        popupDiv.appendChild(price);
      }

      const button = document.createElement('button');
      button.className = 'mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600';
      button.textContent = 'View Details';
      button.onclick = () => {
        // Navigate to the community detail page
        window.location.href = `/properties/${community.slug}`;
      };
      popupDiv.appendChild(button);

      const marker = L.marker([lat, lng])
        .addTo(mapInstanceRef.current!)
        .bindPopup(popupDiv);

      // Highlight selected community
      if (selectedCommunityId === community.id) {
        marker.openPopup();
      }

      markers.push(marker);
    });

    markersRef.current = markers;

    // Fit map to show all markers only if no community is selected
    if (markers.length > 0 && !selectedCommunityId) {
      const group = new L.FeatureGroup(markers);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [communities, selectedCommunityId, onCommunitySelect]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-96 rounded-lg z-0"
      data-testid="community-map"
    />
  );
}