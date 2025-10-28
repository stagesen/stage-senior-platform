import { useEffect, useRef, useState } from 'react';
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
  const isInitialBoundsSet = useRef(false);
  const lastCommunityIds = useRef<string>('');
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize Google Maps
  useEffect(() => {
    if (!mapRef.current) return;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error('CommunityMap: Google Maps API key is missing');
      return;
    }

    // Function to initialize the map once Google Maps is loaded
    const initializeMap = () => {
      if (mapRef.current && window.google && window.google.maps && !mapInstanceRef.current) {
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
        setIsMapReady(true);
      }
    };

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Load Google Maps script dynamically
    const existingScript = document.getElementById('google-maps-script');
    
    if (existingScript) {
      // Script is already loading or loaded, wait for it
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMaps);
          initializeMap();
        }
      }, 100);

      return () => clearInterval(checkGoogleMaps);
    }

    // Create and load the script
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Wait for google.maps to be fully available
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMaps);
          initializeMap();
        }
      }, 50);

      // Timeout after 5 seconds
      setTimeout(() => clearInterval(checkGoogleMaps), 5000);
    };

    script.onerror = () => {
      console.error('CommunityMap: Failed to load Google Maps script');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup markers and info windows
      markersRef.current.forEach(marker => marker.setMap(null));
      infoWindowsRef.current.forEach(infoWindow => infoWindow.close());
      markersRef.current = [];
      infoWindowsRef.current = [];
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when communities change
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google || !isMapReady) {
      return;
    }

    // Clear existing markers and info windows
    markersRef.current.forEach(marker => marker.setMap(null));
    infoWindowsRef.current.forEach(infoWindow => infoWindow.close());
    markersRef.current = [];
    infoWindowsRef.current = [];

    // Filter communities with valid coordinates
    const validCommunities = communities.filter(community => {
      if (!community.latitude || !community.longitude) {
        return false;
      }
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

      // Create marker with custom colored icon
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
          // Call the selection callback if provided
          if (onCommunitySelect) {
            onCommunitySelect(community);
          }
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

    // Create a stable identifier for the current set of communities
    const currentCommunityIds = validCommunities.map(c => c.id).sort().join(',');
    const shouldAdjustBounds = !isInitialBoundsSet.current || lastCommunityIds.current !== currentCommunityIds;
    
    if (markers.length > 0 && shouldAdjustBounds) {
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
      
      isInitialBoundsSet.current = true;
      lastCommunityIds.current = currentCommunityIds;
    }
  }, [communities, selectedCommunityId, showPopups, isMapReady]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full z-0"
      data-testid="community-map"
    />
  );
}
