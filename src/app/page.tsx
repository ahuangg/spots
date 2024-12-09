"use client";

import { useState } from "react";
import MapComponent from "@/app-components/map";
import ActionBar from "@/app-components/action-bar";
import { useUser } from "@/hooks/useUser";

const Page: React.FC = () => {
    const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
    const { userData, loading } = useUser();

    const handleMapLoad = (loaded: boolean) => {
        setIsMapLoaded(loaded);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <MapComponent onMapLoad={handleMapLoad} />
            {isMapLoaded && (
                <div className="absolute top-4 right-4 z-10">
                    <ActionBar userData={userData} />
                </div>
            )}
        </div>
    );
};

export default Page;
