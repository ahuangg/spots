"use client";

import { useState } from "react";

import Map, { NavigationControl } from "react-map-gl";

import H3Layer from "@/app-components/h3-layer";
import {
    INITIAL_MAP_VIEW_STATE,
    MAP_CONTAINER_STYLE,
    MAX_MAP_ZOOM,
    MIN_MAP_ZOOM,
} from "@/lib/utils";

import "mapbox-gl/dist/mapbox-gl.css";
interface MapComponentProps {
    onMapLoad: (loaded: boolean) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onMapLoad }) => {
    const [viewState, setViewState] = useState(INITIAL_MAP_VIEW_STATE);

    const handleLoad = () => {
        onMapLoad(true);
    };

    return (
        <div className="absolute inset-0">
            <Map
                {...viewState}
                style={MAP_CONTAINER_STYLE}
                mapStyle="mapbox://styles/mapbox/light-v11"
                projection={{
                    name: "mercator",
                }}
                minZoom={MIN_MAP_ZOOM}
                maxZoom={MAX_MAP_ZOOM}
                renderWorldCopies={true}
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                attributionControl={false}
                dragRotate={false}
                onMove={(evt) => {
                    setViewState(evt.viewState);
                }}
                onLoad={handleLoad}
            >
                <NavigationControl position="bottom-left" showCompass={false} />
                <H3Layer />
            </Map>
        </div>
    );
};

export default MapComponent;
