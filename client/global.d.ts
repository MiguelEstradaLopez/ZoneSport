declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare namespace google {
    namespace maps {
        class Map {
            constructor(element: HTMLElement, options: google.maps.MapOptions);
            addListener(eventName: string, callback: Function): google.maps.MapsEventListener;
        }
        class Marker {
            constructor(options: google.maps.MarkerOptions);
            setPosition(latlng: google.maps.LatLngLiteral | google.maps.LatLng): void;
            getPosition(): google.maps.LatLng | undefined;
            setDraggable(draggable: boolean): void;
            setMap(map: google.maps.Map | null): void;
            addListener(eventName: string, callback: Function): google.maps.MapsEventListener;
        }
        class Geocoder {
            geocode(request: google.maps.GeocoderRequest, callback: (results: google.maps.GeocoderResult[], status: string) => void): void;
        }
        interface MapOptions {
            center?: google.maps.LatLngLiteral | google.maps.LatLng;
            zoom?: number;
            [key: string]: any;
        }
        interface MarkerOptions {
            position?: google.maps.LatLngLiteral | google.maps.LatLng;
            map?: google.maps.Map;
            draggable?: boolean;
            [key: string]: any;
        }
        interface LatLngLiteral {
            lat: number;
            lng: number;
        }
        interface LatLng {
            lat(): number;
            lng(): number;
        }
        interface GeocoderRequest {
            location?: google.maps.LatLngLiteral | google.maps.LatLng;
            [key: string]: any;
        }
        interface GeocoderResult {
            formatted_address: string;
            [key: string]: any;
        }
        type GeocoderStatus = 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR';
        interface MapMouseEvent {
            latLng?: google.maps.LatLng;
            [key: string]: any;
        }
        interface MapsEventListener {
            remove(): void;
        }
    }
}