'use client';

import { APIProvider, Map as GoogleMap, Marker, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';

interface MapProps {
    address: string;
}

const GeocodedMap = ({ address }: MapProps) => {
    const geocodingLibrary = useMapsLibrary('geocoding');
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!geocodingLibrary) return;

        const geocoder = new geocodingLibrary.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const location = results[0].geometry.location;
                setPosition({ lat: location.lat(), lng: location.lng() });
            } else {
                console.error(`Geocode failed: ${status}`);
                setPosition(null);
            }
            setLoading(false);
        });
    }, [geocodingLibrary, address]);

    if (loading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>;
    }
    if (!position) {
         return <div className="flex items-center justify-center h-full"><p>No se pudo encontrar la dirección.</p></div>;
    }

    return (
        <GoogleMap defaultCenter={position} defaultZoom={15} gestureHandling={'greedy'} disableDefaultUI={true} style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}>
            <Marker position={position} />
        </GoogleMap>
    );
};

export const Map = ({ address }: MapProps) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return (
            <div className="h-full w-full bg-border flex flex-col items-center justify-center rounded-lg text-center">
                <MapPin className="w-12 h-12 text-foreground/30 mb-4" />
                <h3 className="font-bold text-foreground/80">Mapa de Google</h3>
                <p className="text-foreground/50 text-sm px-4 mt-1">La API Key no está configurada.</p>
            </div>
        );
    }

    return (
        <APIProvider apiKey={apiKey}>
            <GeocodedMap address={address} />
        </APIProvider>
    );
};