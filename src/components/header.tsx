"use client";

import React from "react";
import { UserData } from "@/types/user";
import UserStatus from "@/components/user-status";
import InfoDialog from "@/components/info-dialog";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import LocationSearch from "@/components/location-search";
import AuthButton from "@/components/auth-button";
import { Separator } from "@/components/ui/separator";

interface HeaderProps {
    userData: UserData | null;
    setUserData: (userData: UserData) => void;
}

const Header = ({ userData, setUserData }: HeaderProps) => {
    return (
        <Card className="px-4 py-2 bg-white bg-opacity-40 dark:bg-black dark:bg-opacity-40 border-0">
            <header className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent">
                        spots/explorer
                    </h1>
                    {userData && (
                        <>
                            <Separator
                                orientation="vertical"
                                className="h-4 bg-gray-400 p-0 m-0"
                            />
                            <UserStatus userData={userData} />
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <LocationSearch />
                    {userData && (
                        <InfoDialog
                            userData={userData}
                            setUserData={setUserData}
                        />
                    )}

                    <ThemeToggle />
                    <AuthButton />
                </div>
            </header>
        </Card>
    );
};

export default Header;
