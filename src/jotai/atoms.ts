import { atom } from 'jotai';

export const refreshAtom = atom(false);

interface MapLocation {
    lat: number;
    lng: number;
    zoom?: number;
}

export const locationAtom = atom<MapLocation | null>(null);