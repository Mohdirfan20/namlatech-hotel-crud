import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';

// Fix standard Leaflet default icon path issue in Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Custom user location marker icon (emerald/blue circle)
const userLocationIcon = new L.DivIcon({
  className: 'custom-user-marker',
  html: `<div style="background-color: #2563EB; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(37,99,235,0.8); animation: pulse 1.5s infinite;"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

// Helper component to re-center map dynamically
const MapRecenter = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 13, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

/**
 * Calculate distance between two lat/lng points using Haversine formula
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

const HotelMap = ({ hotelTitle, latitude, longitude }) => {
  const hotelLat = parseFloat(latitude) || 0;
  const hotelLng = parseFloat(longitude) || 0;

  const [userLocation, setUserLocation] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [locating, setLocating] = useState(false);
  const [mapCenter, setMapCenter] = useState([hotelLat, hotelLng]);
  const [mapZoom, setMapZoom] = useState(13);

  useEffect(() => {
    setMapCenter([hotelLat, hotelLng]);
  }, [hotelLat, hotelLng]);

  // Handle Geolocation API request
  const handleLocateMe = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your current browser.');
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        setUserLocation({ lat: uLat, lng: uLng });
        setLocating(false);

        const dist = calculateDistance(uLat, uLng, hotelLat, hotelLng);
        setDistanceKm(dist.toFixed(1));

        // Center between user and hotel
        const midLat = (uLat + hotelLat) / 2;
        const midLng = (uLng + hotelLng) / 2;
        setMapCenter([midLat, midLng]);
        setMapZoom(6);
      },
      (err) => {
        setLocating(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setGeoError('Location permission denied. Please allow location access in your browser settings.');
            break;
          case err.POSITION_UNAVAILABLE:
            setGeoError('Location information is currently unavailable.');
            break;
          case err.TIMEOUT:
            setGeoError('The request to get user location timed out.');
            break;
          default:
            setGeoError('An unknown error occurred while requesting geolocation.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Map Control Bar */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-gray-900 flex items-center">
            <MapPin className="w-4 h-4 mr-1.5 text-blue-600" /> Hotel Geographic Location
          </h4>
          <p className="text-xs text-gray-500">
            Coordinates: {hotelLat.toFixed(6)}, {hotelLng.toFixed(6)}
          </p>
        </div>

        {/* Locate Me Button */}
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={locating}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
        >
          {locating ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Determining Location...</span>
            </>
          ) : (
            <>
              <Navigation className="w-3.5 h-3.5" />
              <span>Locate Me & Calculate Distance</span>
            </>
          )}
        </button>
      </div>

      {/* Geolocation Feedback / Distance banner */}
      {distanceKm !== null && (
        <div className="bg-emerald-50 border-b border-emerald-100 p-3 text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              Your current distance to <strong>{hotelTitle}</strong> is approximately{' '}
              <strong className="text-emerald-900 font-bold">{distanceKm} km</strong> ({((distanceKm) * 0.621371).toFixed(1)} miles).
            </span>
          </div>
          <button
            onClick={() => {
              setMapCenter([hotelLat, hotelLng]);
              setMapZoom(14);
            }}
            className="text-xs text-emerald-700 underline font-semibold hover:text-emerald-900 ml-2"
          >
            Zoom back to Hotel
          </button>
        </div>
      )}

      {/* Geolocation Error Alert */}
      {geoError && (
        <div className="bg-amber-50 border-b border-amber-100 p-3 text-xs text-amber-800 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Interactive Leaflet Map */}
      <div className="h-80 sm:h-96 w-full relative">
        <MapContainer
          center={[hotelLat, hotelLng]}
          zoom={mapZoom}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <MapRecenter center={mapCenter} zoom={mapZoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Hotel Location Marker */}
          <Marker position={[hotelLat, hotelLng]}>
            <Popup>
              <div className="p-1">
                <h5 className="font-bold text-sm text-gray-900">{hotelTitle}</h5>
                <p className="text-xs text-gray-600 mt-1">
                  Lat: {hotelLat.toFixed(4)}, Lng: {hotelLng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>

          {/* User Location Marker (if located) */}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
              <Popup>
                <div className="p-1 text-xs">
                  <strong className="text-blue-700">Your Current Position</strong>
                  <p className="mt-1">Distance to hotel: {distanceKm} km</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default HotelMap;
