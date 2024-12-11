import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const H3_RESOLUTION = 5;

export const MIN_MAP_ZOOM = 2;
export const MAX_MAP_ZOOM = 14;

export const INITIAL_MAP_VIEW_STATE = {
    longitude: -95.7129,
    latitude: 37.0902,
    zoom: 2,
    pitch: 0,
    bearing: 0,
};

export const MAP_CONTAINER_STYLE: React.CSSProperties = {
    height: "100vh",
    width: "100vw",
};
