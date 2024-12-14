import { useEffect, useState } from "react";

import axios from "axios";
import { useAtom } from "jotai";
import { cellToBoundary } from "h3-js";
import { Layer, Source } from "react-map-gl";

import { refreshAtom } from "@/jotai/atoms";
import { LANGUAGE_COLOR } from "@/lib/languages";

interface H3Cell {
    index: string;
    dominantLanguage: string;
    totalUsers: number;
}

interface H3LayerProps {
    currentZoom: number;
}

const H3Layer: React.FC<H3LayerProps> = () => {
    const [refresh] = useAtom(refreshAtom);
    const [h3Cells, setH3Cells] = useState<H3Cell[]>([]);

    useEffect(() => {
        const fetchH3Cells = async () => {
            try {
                const response = await axios.get("/api/h3cells");
                setH3Cells(response.data);
            } catch (error) {
                console.error("Error fetching H3 cells:", error);
            }
        };

        fetchH3Cells();
    }, [refresh]);

    const getHexagonCoordinates = (h3Index: string) => {
        try {
            const boundary = cellToBoundary(h3Index, true);
            return [boundary];
        } catch (error) {
            console.error(
                `Error converting H3 index ${h3Index} to coordinates:`,
                error
            );
            return [];
        }
    };

    const hexagonFeatures = h3Cells.map((cell) => {
        const coordinates = getHexagonCoordinates(cell.index);
        const color =
            LANGUAGE_COLOR[cell.dominantLanguage as keyof typeof LANGUAGE_COLOR]
                ?.color || "#000000";

        const opacity = Math.max(0.3, Math.min(1, cell.totalUsers / 20));

        return {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: coordinates,
            },
            properties: {
                fillColor: color,
                totalUsers: cell.totalUsers,
                opacity: opacity,
            },
        };
    });

    // const getIconSize = (zoom: number) => {
    //     const baseSize = 40;
    //     const scale = Math.pow(0.8, 12 - zoom);
    //     return Math.max(20, Math.min(baseSize * scale, 60));
    // };

    return (
        <>
            <Source
                type="geojson"
                data={{
                    type: "FeatureCollection",
                    features: hexagonFeatures,
                }}
            >
                <Layer
                    id="h3-hexagons"
                    type="fill"
                    paint={{
                        "fill-color": ["get", "fillColor"],
                        "fill-opacity": ["get", "opacity"],
                    }}
                />
            </Source>
            {/* 
            {currentZoom >= 10 &&
                h3Cells.map((cell) => {
                    const [lat, lng] = cellToLatLng(cell.index);
                    const iconSize = getIconSize(currentZoom);

                    return (
                        <Marker key={cell.index} latitude={lat} longitude={lng}>
                            <div
                                className="flex items-center justify-center"
                                style={{
                                    width: `${iconSize}px`,
                                    height: `${iconSize}px`,
                                    position: "relative",
                                }}
                            >
                                <Image
                                    src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${cell.dominantLanguage.toLowerCase()}/${cell.dominantLanguage.toLowerCase()}-original.svg`}
                                    alt={cell.dominantLanguage}
                                    fill
                                    style={{
                                        filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.3)",
                                    }}
                                    unoptimized
                                />
                            </div>
                        </Marker>
                    );
                })} */}
        </>
    );
};

export default H3Layer;
