import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Community } from '@shared/schema';
import { useResolveImageUrl } from '@/hooks/useResolveImageUrl';

// Create custom marker icon with community color
const createCustomMarker = (color: string = '#2563eb') => {
  const svgIcon = `
    <svg width="30" height="45" viewBox="0 0 30 45" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.716 0 0 6.716 0 15c0 8.284 15 30 15 30s15-21.716 15-30C30 6.716 23.284 0 15 0z" fill="${color}"/>
      <circle cx="15" cy="15" r="8" fill="white"/>
    </svg>
  `;
  
  return L.divIcon({
    html: svgIcon,
    iconSize: [30, 45],
    iconAnchor: [15, 45],
    popupAnchor: [0, -45],
    className: 'custom-marker'
  });
};

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

    // Initialize map centered on Colorado with zoom disabled
    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      zoomControl: false,
      dragging: true,
    }).setView([39.6992, -104.9375], 11);
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

      // Get community color (use mainColorHex or default to primary blue)
      const markerColor = community.mainColorHex || '#2563eb';
      
      // Create popup content with centered logo, name and city
      const popupDiv = document.createElement('div');
      popupDiv.className = 'text-center p-4 min-w-[200px]';
      
      // Add logo if available
      if (community.logoImageId) {
        const logoContainer = document.createElement('div');
        logoContainer.className = 'flex justify-center mb-3';
        
        const logo = document.createElement('img');
        logo.src = `/api/images/${community.logoImageId}`;
        logo.alt = `${community.name} logo`;
        logo.className = 'h-12 w-auto object-contain';
        logo.onerror = () => {
          // Hide logo if it fails to load
          logoContainer.style.display = 'none';
        };
        
        logoContainer.appendChild(logo);
        popupDiv.appendChild(logoContainer);
      }

      // Community name - bold and centered
      const title = document.createElement('h3');
      title.className = 'font-bold text-base mb-1';
      title.style.color = markerColor;
      title.textContent = community.name;
      popupDiv.appendChild(title);

      // City name - centered
      const location = document.createElement('p');
      location.className = 'text-sm text-gray-600 mb-3';
      location.textContent = `${community.city}, ${community.state}`;
      popupDiv.appendChild(location);

      // View Details button with community color
      const button = document.createElement('button');
      button.className = 'px-4 py-2 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity w-full';
      button.style.backgroundColor = markerColor;
      button.textContent = 'View Details';
      button.onclick = () => {
        window.location.href = `/communities/${community.slug}`;
      };
      popupDiv.appendChild(button);

      // Create marker with custom color
      const marker = L.marker([lat, lng], {
        icon: createCustomMarker(markerColor)
      })
        .addTo(mapInstanceRef.current!)
        .bindPopup(popupDiv, {
          maxWidth: 250,
          className: 'custom-popup'
        });

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