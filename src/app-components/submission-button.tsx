import { Button } from "@/components/ui/button";
import useSessionStorage from "@/hooks/useSessionStorage";
import { latLngToCell } from "h3-js";
import { useEffect, useState } from "react";

const H3_RESOLUTION = 9;

const SubmissionButton = () => {
    const [initialValue, setInitialValue] = useState("");
    const [locationData, setLocationData] = useSessionStorage<string>(
        "locationData",
        initialValue
    );

    useEffect(() => {
        const existingData = sessionStorage.getItem("locationData");
        if (existingData) {
            setInitialValue(existingData);
        }
    }, []);

    const getUserLocation = () => {
        if (locationData) return;
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const h3Index = latLngToCell(
                        latitude,
                        longitude,
                        H3_RESOLUTION
                    );
                    if (h3Index) {
                        setLocationData(h3Index);
                    }
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    };

    return (
        <Button onClick={getUserLocation}>
            {locationData ? `Current H3: ${locationData}` : "Get Location"}
        </Button>
    );
};

export default SubmissionButton;
