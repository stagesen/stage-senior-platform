import { useEffect, useRef } from 'react';
import { getCityState } from '@/lib/communityContact';
import type { Community } from '@shared/schema';

// Create custom marker icon SVG with community color
const createCustomMarkerIcon = (color: string = '#2563eb'): string => {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 0C15.163 0 8 7.163 8 16c0 8 16 32 16 32s16-24 16-32C40 7.163 32.837 0 24 0z" fill="${color}"/>
      <circle cx="24" cy="16" r="8" fill="white"/>
    </svg>
  `)}`;
};

interface CommunityMapProps {
  communities: Community[];
  onCommunitySelect?: (community: Community) => void;
  selectedCommunityId?: string;
  showPopups?: boolean;
}

// Declare google maps types
declare global {
  interface Window {
    google: any;
  }
  const google: any;
}

export default function CommunityMap({ 
  communities, 
  onCommunitySelect, 
  selectedCommunityId,
  showPopups = true
}: CommunityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowsRef = useRef<any[]>([]);

  // Initialize Google Maps
  useEffect(() => {
    if (!mapRef.current) return;

    // Load the Google Maps API using dynamic script loading
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (mapRef.current && window.google) {
        // Initialize map centered on Denver metro area
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 39.7392, lng: -104.9903 },
          zoom: 10,
          scrollwheel: false,
          disableDoubleClickZoom: true,
          gestureHandling: 'greedy',
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        mapInstanceRef.current = map;
      }
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup
      markersRef.current.forEach(marker => marker.setMap(null));
      infoWindowsRef.current.forEach(infoWindow => infoWindow.close());
      markersRef.current = [];
      infoWindowsRef.current = [];
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers when communities change
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;

    // Clear existing markers and info windows
    markersRef.current.forEach(marker => marker.setMap(null));
    infoWindowsRef.current.forEach(infoWindow => infoWindow.close());
    markersRef.current = [];
    infoWindowsRef.current = [];

    // Filter communities with valid coordinates
    const validCommunities = communities.filter(community => {
      if (!community.latitude || !community.longitude) return false;
      const lat = parseFloat(community.latitude);
      const lng = parseFloat(community.longitude);
      return !isNaN(lat) && !isNaN(lng);
    });

    if (validCommunities.length === 0) return;

    const markers: any[] = [];
    const infoWindows: any[] = [];
    const bounds = new window.google.maps.LatLngBounds();

    validCommunities.forEach(community => {
      const lat = parseFloat(community.latitude!);
      const lng = parseFloat(community.longitude!);
      const position = { lat, lng };

      // Get community color
      const markerColor = community.mainColorHex || '#2563eb';

      // Create marker
      const marker = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current!,
        icon: {
          url: createCustomMarkerIcon(markerColor),
          scaledSize: new window.google.maps.Size(48, 48),
          anchor: new window.google.maps.Point(24, 48),
        },
        title: community.name,
      });

      // Create popup content
      if (showPopups) {
        const popupDiv = document.createElement('div');
        popupDiv.className = 'overflow-hidden min-w-[280px]';
        
        // Add hero image if available
        if (community.imageId) {
          const heroContainer = document.createElement('div');
          heroContainer.className = 'relative h-32 mb-3';
          
          const hero = document.createElement('img');
          hero.src = `/api/images/${community.imageId}`;
          hero.alt = `${community.name}`;
          hero.className = 'w-full h-full object-cover';
          hero.onerror = () => {
            heroContainer.style.display = 'none';
          };
          
          heroContainer.appendChild(hero);
          popupDiv.appendChild(heroContainer);
        }

        // Content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'px-4 pb-4';

        // Header with logo and title
        const headerDiv = document.createElement('div');
        headerDiv.className = 'flex items-center justify-center gap-2 mb-2';
        
        if (community.logoImageId) {
          const logo = document.createElement('img');
          logo.src = `/api/images/${community.logoImageId}`;
          logo.alt = `${community.name} logo`;
          logo.className = 'h-8 w-auto object-contain';
          logo.onerror = () => {
            logo.style.display = 'none';
          };
          headerDiv.appendChild(logo);
        }

        // Community name
        const title = document.createElement('h3');
        title.className = 'font-bold text-lg';
        title.style.color = markerColor;
        title.textContent = community.name;
        headerDiv.appendChild(title);
        
        contentDiv.appendChild(headerDiv);

        // City name
        const location = document.createElement('p');
        location.className = 'text-sm text-gray-600 mb-3 text-center';
        location.textContent = getCityState(community);
        contentDiv.appendChild(location);

        // View Details button
        const button = document.createElement('button');
        button.className = 'px-4 py-2 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity w-full';
        button.style.backgroundColor = markerColor;
        button.textContent = 'View Details';
        button.onclick = () => {
          window.location.href = `/communities/${community.slug}`;
        };
        contentDiv.appendChild(button);
        
        popupDiv.appendChild(contentDiv);

        // Create InfoWindow
        const infoWindow = new window.google.maps.InfoWindow({
          content: popupDiv,
          maxWidth: 280,
        });

        // Add click listener to marker
        marker.addListener('click', () => {
          // Close all other info windows
          infoWindows.forEach(iw => iw.close());
          infoWindow.open(mapInstanceRef.current!, marker);
        });

        infoWindows.push(infoWindow);

        // Open popup for selected community
        if (selectedCommunityId === community.id) {
          infoWindow.open(mapInstanceRef.current!, marker);
        }
      }

      markers.push(marker);
      bounds.extend(position);
    });

    markersRef.current = markers;
    infoWindowsRef.current = infoWindows;

    // Fit map to show all markers
    if (markers.length > 0) {
      if (markers.length === 1) {
        // Single community: center on it with appropriate zoom level
        const marker = markers[0];
        const position = marker.getPosition();
        if (position) {
          mapInstanceRef.current!.setCenter(position);
          mapInstanceRef.current!.setZoom(13);
        }
      } else {
        // Multiple communities: fit bounds to show all
        mapInstanceRef.current!.fitBounds(bounds, {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        });
        
        // Limit max zoom
        const listener = window.google.maps.event.addListenerOnce(mapInstanceRef.current!, 'bounds_changed', () => {
          const currentZoom = mapInstanceRef.current!.getZoom();
          if (currentZoom && currentZoom > 12) {
            mapInstanceRef.current!.setZoom(12);
          }
        });
      }
    }
  }, [communities, selectedCommunityId, showPopups]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full z-0"
      data-testid="community-map"
    />
  );
}
