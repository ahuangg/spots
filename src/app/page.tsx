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
        <div className="relative w-screen h-screen">
            <MapComponent onMapLoad={handleMapLoad} />
            {isMapLoaded && <ActionBar />}
        </div>
    );
};

export default Page;
