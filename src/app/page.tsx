"use client";

import { useState } from "react";
import MapComponent from "@/app-components/map";
import Header from "@/app-components/header";
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
            {isMapLoaded && (
                <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10 max-w-4xl w-full px-4 ">
                    <Header userData={userData} />
                </div>
            )}
            <MapComponent onMapLoad={handleMapLoad} />
        </div>
    );
};

export default Page;
