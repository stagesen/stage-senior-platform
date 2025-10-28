import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getCityState } from '@/lib/communityContact';
import type { Community } from '@shared/schema';
import { useResolveImageUrl } from '@/hooks/useResolveImageUrl';

// Create custom marker icon with community color (48x48 for accessibility)
const createCustomMarker = (color: string = '#2563eb') => {
  const svgIcon = `
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 0C15.163 0 8 7.163 8 16c0 8 16 32 16 32s16-24 16-32C40 7.163 32.837 0 24 0z" fill="${color}"/>
      <circle cx="24" cy="16" r="8" fill="white"/>
    </svg>
  `;
  
  return L.divIcon({
    html: svgIcon,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
    className: 'custom-marker'
  });
};

interface CommunityMapProps {
  communities: Community[];
  onCommunitySelect?: (community: Community) => void;
  selectedCommunityId?: string;
  showPopups?: boolean;
}

export default function CommunityMap({ 
  communities, 
  onCommunitySelect, 
  selectedCommunityId,
  showPopups = true
}: CommunityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map centered on Denver metro area with a broader view
    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      zoomControl: false,
      dragging: true,
    }).setView([39.7392, -104.9903], 10);
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

    // Add markers for communities with valid coordinates
    const validCommunities = communities.filter(community => {
      if (!community.latitude || !community.longitude) return false;
      const lat = parseFloat(community.latitude);
      const lng = parseFloat(community.longitude);
      return !isNaN(lat) && !isNaN(lng);
    });

    if (validCommunities.length === 0) return;

    const markers: L.Marker[] = [];
    const markerCommunityMap = new Map<L.Marker, Community>();
    
    validCommunities.forEach(community => {
      const lat = parseFloat(community.latitude!);
      const lng = parseFloat(community.longitude!);

      // Get community color (use mainColorHex or default to primary blue)
      const markerColor = community.mainColorHex || '#2563eb';
      
      // Create popup content with hero image, name and city
      const popupDiv = document.createElement('div');
      popupDiv.className = 'overflow-hidden min-w-[280px]';
      
      // Add hero image if available
      if (community.imageId) {
        const heroContainer = document.createElement('div');
        heroContainer.className = 'relative h-32 mb-3 -mt-3 -mx-3';
        
        const hero = document.createElement('img');
        hero.src = `/api/images/${community.imageId}`;
        hero.alt = `${community.name}`;
        hero.className = 'w-full h-full object-cover';
        hero.onerror = () => {
          // Hide hero if it fails to load
          heroContainer.style.display = 'none';
        };
        
        heroContainer.appendChild(hero);
        popupDiv.appendChild(heroContainer);
      }

      // Content container
      const contentDiv = document.createElement('div');
      contentDiv.className = 'px-4 pb-4';

      // Add logo if available (small version next to title)
      const headerDiv = document.createElement('div');
      headerDiv.className = 'flex items-center justify-center gap-2 mb-2';
      
      if (community.logoImageId) {
        const logo = document.createElement('img');
        logo.src = `/api/images/${community.logoImageId}`;
        logo.alt = `${community.name} logo`;
        logo.className = 'h-8 w-auto object-contain';
        logo.onerror = () => {
          // Hide logo if it fails to load
          logo.style.display = 'none';
        };
        headerDiv.appendChild(logo);
      }

      // Community name - bold and centered
      const title = document.createElement('h3');
      title.className = 'font-bold text-lg';
      title.style.color = markerColor;
      title.textContent = community.name;
      headerDiv.appendChild(title);
      
      contentDiv.appendChild(headerDiv);

      // City name - centered
      const location = document.createElement('p');
      location.className = 'text-sm text-gray-600 mb-3 text-center';
      location.textContent = getCityState(community);
      contentDiv.appendChild(location);

      // View Details button with community color
      const button = document.createElement('button');
      button.className = 'px-4 py-2 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity w-full';
      button.style.backgroundColor = markerColor;
      button.textContent = 'View Details';
      button.onclick = () => {
        window.location.href = `/communities/${community.slug}`;
      };
      contentDiv.appendChild(button);
      
      popupDiv.appendChild(contentDiv);

      // Create marker with custom color
      const marker = L.marker([lat, lng], {
        icon: createCustomMarker(markerColor)
      })
        .addTo(mapInstanceRef.current!);

      // Bind popup only if showPopups is true
      if (showPopups) {
        marker.bindPopup(popupDiv, {
          maxWidth: 250,
          className: 'custom-popup'
        });

        // Highlight selected community
        if (selectedCommunityId === community.id) {
          marker.openPopup();
        }
      }

      markers.push(marker);
      markerCommunityMap.set(marker, community);
    });

    markersRef.current = markers;

    // Fit map to show all markers with appropriate zoom
    if (markers.length > 0) {
      if (markers.length === 1) {
        // Single community: center on it with appropriate zoom level
        const marker = markers[0];
        const latlng = marker.getLatLng();
        mapInstanceRef.current.setView(latlng, 13);
        
        // Open popup for single community if selected
        if (selectedCommunityId && showPopups) {
          marker.openPopup();
        }
      } else {
        // Multiple communities: fit bounds to show all with padding
        const group = new L.FeatureGroup(markers);
        mapInstanceRef.current.fitBounds(group.getBounds(), {
          padding: [50, 50],
          maxZoom: 12
        });
        
        // If a community is selected, ensure it's visible and highlighted
        if (selectedCommunityId && showPopups) {
          const selectedMarker = markers.find(marker => 
            markerCommunityMap.get(marker)?.id === selectedCommunityId
          );
          if (selectedMarker) {
            selectedMarker.openPopup();
          }
        }
      }
    }
  }, [communities, selectedCommunityId, onCommunitySelect, showPopups]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full z-0"
      data-testid="community-map"
    />
  );
}