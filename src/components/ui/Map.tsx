
'client';

import { APIProvider, Map as GoogleMap, Marker } from '@vis.gl/react-google-maps';
import { MapPin } from 'lucide-react';

interface MapProps {
    lat: number;
    lng: number;
}

export const Map = ({ lat, lng }: MapProps) => {
    const position = { lat, lng };
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;


    if (!apiKey) {
        return (
            <div className="h-full w-full bg-border flex flex-col items-center justify-center rounded-lg text-center">
                <MapPin className="w-12 h-12 text-foreground/30 mb-4" />
                <h3 className="font-bold text-foreground/80">Mapa de Google</h3>
                <p className="text-foreground/50 text-sm px-4 mt-1">
                    El mapa se mostrará aquí una vez que la API Key esté activa.
                </p>
            </div>
        );
    }
    // --------------------------------------------------

    return (
        <APIProvider apiKey={apiKey}>
            <GoogleMap
                style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
                defaultCenter={position}
                defaultZoom={15}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
            >
                <Marker position={position} />
            </GoogleMap>
        </APIProvider>
    );
};