"use client";

import React, { useState } from "react";
import { UserData } from "@/types/user";
import UserStatus from "@/components/user-status";
import InfoDialog from "@/components/info-dialog";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import LocationSearch from "@/components/location-search";
import AuthButton from "@/components/auth-button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface HeaderProps {
    userData: UserData | null;
    setUserData: (userData: UserData) => void;
}

const Header = ({ userData, setUserData }: HeaderProps) => {
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    return (
        <Card className="px-4 py-2 bg-white bg-opacity-40 dark:bg-black dark:bg-opacity-40 border-0">
            <header className="flex items-center justify-between">
                <div
                    className={cn(
                        "flex items-center gap-4",
                        isSearchExpanded ? "hidden sm:flex" : "flex"
                    )}
                >
                    <h1
                        className={cn(
                            "text-lg font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent",
                            userData ? "hidden sm:block" : "block"
                        )}
                    >
                        spots/explorer
                    </h1>

                    {userData && (
                        <div
                            className={cn(
                                "flex items-center gap-2",
                                isSearchExpanded ? "hidden sm:flex" : "flex"
                            )}
                        >
                            <Separator
                                orientation="vertical"
                                className="hidden sm:block h-4 bg-gray-400"
                            />
                            <UserStatus userData={userData} />
                        </div>
                    )}
                </div>

                <div
                    className={cn(
                        "flex items-center gap-2",
                        isSearchExpanded ? "w-full sm:w-auto" : "w-auto"
                    )}
                >
                    <LocationSearch
                        isExpanded={isSearchExpanded}
                        setIsExpanded={setIsSearchExpanded}
                    />

                    <div
                        className={cn(
                            "flex items-center gap-2",
                            isSearchExpanded ? "hidden sm:flex" : "flex"
                        )}
                    >
                        {userData && (
                            <InfoDialog
                                userData={userData}
                                setUserData={setUserData}
                            />
                        )}
                        <ThemeToggle />
                        <AuthButton />
                    </div>
                </div>
            </header>
        </Card>
    );
};

export default Header;
