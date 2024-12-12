"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Map, { NavigationControl, ViewStateChangeEvent } from "react-map-gl";
import { useAtomValue } from "jotai";
import { locationAtom } from "@/jotai/atoms";
import * as d3 from "d3-ease";

import H3Layer from "@/components/h3-layer";
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
    const [zoom, setZoom] = useState(INITIAL_MAP_VIEW_STATE.zoom);
    const { theme } = useTheme();
    const location = useAtomValue(locationAtom);

    const handleLoad = () => {
        onMapLoad(true);
    };

    const handleMove = (evt: ViewStateChangeEvent) => {
        setViewState(evt.viewState);
        setZoom(evt.viewState.zoom);
    };

    useEffect(() => {
        if (location) {
            setViewState((prev) => ({
                ...prev,
                latitude: location.lat,
                longitude: location.lng,
                zoom: location.zoom || 13,
                transitionDuration: 2000,
                transitionEasing: d3.easeCubicOut,
            }));
        }
    }, [location]);

    return (
        <div className="absolute inset-0">
            <Map
                {...viewState}
                style={MAP_CONTAINER_STYLE}
                mapStyle={
                    theme === "dark"
                        ? "mapbox://styles/mapbox/dark-v11"
                        : "mapbox://styles/mapbox/light-v11"
                }
                projection={{
                    name: "mercator",
                }}
                minZoom={MIN_MAP_ZOOM}
                maxZoom={MAX_MAP_ZOOM}
                renderWorldCopies={true}
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                attributionControl={false}
                dragRotate={false}
                onMove={handleMove}
                onLoad={handleLoad}
            >
                <NavigationControl position="bottom-left" showCompass={false} />
                <H3Layer currentZoom={zoom} />
            </Map>
        </div>
    );
};

export default MapComponent;
