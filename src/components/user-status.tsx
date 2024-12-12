import React from "react";
import { UserData } from "@/types/user";
import { Button } from "@/components/ui/button";
import { LANGUAGE_COLOR } from "@/lib/languages";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSetAtom } from "jotai";
import { locationAtom } from "@/jotai/atoms";
import { cellToLatLng } from "h3-js";
import { cn } from "@/lib/utils";

interface UserStatusProps {
    userData: UserData;
}

const UserStatus: React.FC<UserStatusProps> = ({ userData }) => {
    const setLocation = useSetAtom(locationAtom);

    const handleLocationClick = () => {
        if (userData?.h3Index) {
            const [lat, lng] = cellToLatLng(userData.h3Index);
            setLocation({
                lat,
                lng,
                zoom: 10,
            });
        }
    };

    return (
        <div
            className={cn(
                "nav-items flex items-center",
                document.body.classList.contains("search-expanded")
                    ? "hidden sm:flex"
                    : "flex"
            )}
        >
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 px-2 h-8"
                            onClick={handleLocationClick}
                        >
                            <span className="text-muted-foreground">
                                {userData?.h3Index || "None"}
                            </span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Your Pinned Location</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 px-2 h-8"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                        backgroundColor:
                                            userData.favoriteLanguage
                                                ? LANGUAGE_COLOR[
                                                      userData.favoriteLanguage as keyof typeof LANGUAGE_COLOR
                                                  ]?.color ?? "#6e7681"
                                                : "#6e7681",
                                    }}
                                />
                                <span className="text-muted-foreground">
                                    {userData.favoriteLanguage || "None"}
                                </span>
                            </div>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Programming Language</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default UserStatus;
