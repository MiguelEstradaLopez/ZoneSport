'use client';

import { useEffect, useRef, useState } from 'react';

interface MapPickerProps {
    onLocationSelect: (data: {
        lat: number;
        lng: number;
        address: string;
        mapsUrl: string;
    }) => void;
    initialLat?: number;
    initialLng?: number;
}

export default function MapPicker({ onLocationSelect, initialLat, initialLng }: MapPickerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<{
        lat: number;
        lng: number;
        address: string;
    } | null>(null);
    const geocoderRef = useRef<google.maps.Geocoder | null>(null);
    const [mapScript, setMapScript] = useState(false);

    // Cargar Google Maps API
    useEffect(() => {
        if (mapScript) return;

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAX5MOeaGndzsTJlDashCrjtaHcy4uplM8&libraries=places`;
        script.async = true;
        script.onload = () => {
            setMapScript(true);
        };
        document.head.appendChild(script);

        return () => {
            // No remover el script para evitar problemas
        };
    }, [mapScript]);

    // Inicializar mapa cuando Google Maps esté listo
    useEffect(() => {
        if (!mapScript || !mapRef.current || map) return;

        const defaultLat = initialLat || 4.5709;
        const defaultLng = initialLng || -74.2973;

        const newMap = new google.maps.Map(mapRef.current, {
            zoom: 6,
            center: { lat: defaultLat, lng: defaultLng },
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: true,
        });

        geocoderRef.current = new google.maps.Geocoder();

        // Si hay ubicación inicial, colocar marcador
        if (initialLat && initialLng) {
            const initialMarker = new google.maps.Marker({
                position: { lat: initialLat, lng: initialLng },
                map: newMap,
                draggable: true,
            });

            setMarker(initialMarker);
            reverseGeocode(initialLat, initialLng, initialMarker);

            initialMarker.addListener('dragend', () => {
                const pos = initialMarker.getPosition();
                if (pos) {
                    reverseGeocode(pos.lat(), pos.lng(), initialMarker);
                }
            });
        }

        // Click en mapa para colocar marcador
        newMap.addListener('click', (event: google.maps.MapMouseEvent) => {
            const lat = event.latLng?.lat();
            const lng = event.latLng?.lng();

            if (lat !== undefined && lng !== undefined) {
                // Remover marcador anterior
                if (marker) {
                    marker.setMap(null);
                }

                // Crear nuevo marcador
                const newMarker = new google.maps.Marker({
                    position: { lat, lng },
                    map: newMap,
                    draggable: true,
                });

                setMarker(newMarker);
                reverseGeocode(lat, lng, newMarker);

                // Permitir arrastrar marcador
                newMarker.addListener('dragend', () => {
                    const pos = newMarker.getPosition();
                    if (pos) {
                        reverseGeocode(pos.lat(), pos.lng(), newMarker);
                    }
                });
            }
        });

        setMap(newMap);
    }, [mapScript, mapRef, initialLat, initialLng]);

    // Obtener dirección desde coordenadas
    const reverseGeocode = (lat: number, lng: number, currentMarker: google.maps.Marker) => {
        if (!geocoderRef.current) return;

        geocoderRef.current.geocode(
            { location: { lat, lng } },
            (results: google.maps.GeocoderResult[], status: string) => {
                let address = '';

                if (status === 'OK' && results[0]) {
                    address = results[0].formatted_address;
                } else {
                    address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                }

                setSelectedLocation({ lat, lng, address });
            }
        );
    };

    const handleConfirm = () => {
        if (!selectedLocation) return;

        const mapsUrl = `https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`;

        onLocationSelect({
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
            address: selectedLocation.address,
            mapsUrl,
        });
    };

    return (
        <div className="space-y-4">
            {/* Mapa */}
            <div
                ref={mapRef}
                className="w-full h-96 rounded-lg border border-zinc-700 bg-zinc-800"
                style={{ minHeight: '400px' }}
            />

            {/* Información de ubicación */}
            {selectedLocation && (
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 space-y-3">
                    <div>
                        <p className="text-xs text-zinc-400 mb-1">Coordenadas seleccionadas:</p>
                        <p className="text-sm font-mono font-semibold text-white">
                            {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-zinc-400 mb-1">Dirección:</p>
                        <p className="text-sm text-white break-words">{selectedLocation.address}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={`https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-400 hover:text-green-300 transition underline flex items-center gap-1"
                        >
                            Ver en Google Maps →
                        </a>
                    </div>

                    <button
                        onClick={handleConfirm}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition"
                    >
                        ✓ Confirmar ubicación
                    </button>
                </div>
            )}

            {/* Instrucción */}
            {!selectedLocation && (
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
                    <p className="text-sm text-zinc-300">
                        👆 Haz click en el mapa para seleccionar la ubicación del evento
                    </p>
                </div>
            )}
        </div>
    );
}
