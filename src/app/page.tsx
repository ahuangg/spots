"use client";

import { useState, Suspense } from "react";
import MapComponent from "@/components/map";
import Header from "@/components/header";
import { useUser } from "@/hooks/useUser";
import Loading from "@/components/loading";

const Page: React.FC = () => {
    const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
    const { userData, setUserData, loading } = useUser();

    const handleMapLoad = (loaded: boolean) => {
        setIsMapLoaded(loaded);
    };

    if (loading) return <Loading />;

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <Suspense fallback={<Loading />}>
                {isMapLoaded && (
                    <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10 max-w-4xl w-full px-4 space-y-4">
                        <Header userData={userData} setUserData={setUserData} />
                    </div>
                )}
                <MapComponent onMapLoad={handleMapLoad} />
            </Suspense>
        </div>
    );
};

export default Page;
