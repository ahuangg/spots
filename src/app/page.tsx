"use client";

import { useState } from "react";
import MapComponent from "@/app-components/map";
import ActionBar from "@/app-components/action-bar";

const Page: React.FC = () => {
    const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

    const handleMapLoad = (loaded: boolean) => {
        setIsMapLoaded(loaded);
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <MapComponent onMapLoad={handleMapLoad} />
            {isMapLoaded && (
                <div className="absolute top-4 right-4 z-10">
                    <ActionBar />
                </div>
            )}
        </div>
    );
};

export default Page;
