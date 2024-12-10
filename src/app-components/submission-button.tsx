import { Button } from "@/components/ui/button";
import useSessionStorage from "@/hooks/useSessionStorage";
import { latLngToCell } from "h3-js";
import { useEffect, useState } from "react";
import axios from "axios";

const H3_RESOLUTION = 9;

const SubmissionButton = ({ userId }: { userId: number }) => {
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

    const getUserLocation = async () => {
        if (!locationData && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const h3Index = latLngToCell(
                        latitude,
                        longitude,
                        H3_RESOLUTION
                    );

                    setLocationData(h3Index);
                },
                (error) => {
                    console.log(error);
                }
            );
        }
        if (locationData) {
            await axios.post(`/api/users/${userId}/${locationData}`);
        }
    };

    return (
        <Button onClick={getUserLocation}>
            {locationData ? `Current H3: ${locationData}` : "Get Location"}
        </Button>
    );
};

export default SubmissionButton;
