import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

function GeoCenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 13, { duration: 1.5 });
    }
  }, [map, position]);
  return null;
}

export default function HospitalMap({ hospitals, onSelect }) {
  const [position, setPosition] = useState([20.5937, 78.9629]);
  const markers = useMemo(
    () => hospitals.map((hospital) => ({
      position: [hospital.location?.coordinates?.[1] || 20.5937, hospital.location?.coordinates?.[0] || 78.9629],
      hospital,
    })),
    [hospitals]
  );

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setPosition([coords.latitude, coords.longitude]),
      () => undefined,
      { timeout: 5000 }
    );
  }, []);

  const handleLocateMe = () => {
     if (!navigator.geolocation) return;
     navigator.geolocation.getCurrentPosition(({ coords }) => setPosition([coords.latitude, coords.longitude]));
  };

  return (
    <div className="relative h-[600px] rounded-neu-lg p-2 bg-neu-bg shadow-[inset_6px_6px_14px_#b8bec7,_inset_-6px_-6px_14px_#ffffff]">
      <div className="h-full w-full rounded-neu overflow-hidden border border-neu-dark/30 shadow-inner relative z-0">
         <MapContainer center={position} zoom={13} scrollWheelZoom className="h-full w-full">
           <GeoCenter position={position} />
           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
           {markers.map((marker) => (
             <Marker key={marker.hospital._id || marker.hospital.id} position={marker.position}>
               <Popup className="neu-popup">
                 <div className="space-y-3 p-1 min-w-[200px]">
                   <p className="font-bold text-gray-800 text-base border-b border-gray-200 pb-2">{marker.hospital.name}</p>
                   <p className="text-xs text-gray-600 font-medium">{marker.hospital.address}</p>
                   <p className="text-xs text-brand-600 font-bold mb-2">Vaccines: {marker.hospital.vaccines?.length || 0}</p>
                   <div className="flex gap-2 justify-end pt-2">
                      <Link
                        to={`/hospital/${marker.hospital._id || marker.hospital.id}`}
                        className="bg-brand-600 px-4 py-2 text-white text-xs font-bold rounded-lg shadow-md hover:bg-brand-700 transition"
                      >
                        Details
                      </Link>
                   </div>
                 </div>
               </Popup>
             </Marker>
           ))}
         </MapContainer>
      </div>

      <button
        onClick={handleLocateMe}
         className="absolute bottom-6 right-6 z-[1000] neu-btn bg-neu-bg p-3 !rounded-full"
         aria-label="Center map on my location"
         title="Center map on my location"
      >
        <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
      </button>

      <style>{`
        .leaflet-popup-content-wrapper {
          border-radius: 16px;
          box-shadow: 6px 6px 14px rgba(0,0,0,0.1), -2px -2px 10px rgba(255,255,255,0.8);
        }
        .leaflet-popup-tip {
          box-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
