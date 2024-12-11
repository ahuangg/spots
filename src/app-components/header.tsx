"use client";

import React from "react";

import AuthButton from "@/app-components/auth-button";
import { UserData } from "@/types/user";
import InfoDialog from "@/app-components/info-dialog";
import { Card } from "@/components/ui/card";

interface HeaderProps {
    userData: UserData | null;
}

const Header: React.FC<HeaderProps> = ({ userData }) => {
    return (
        <Card className="px-3 py-2 bg-white bg-opacity-40">
            <header className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                    <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent">
                        spots/explorer
                    </h1>
                </div>
                <nav className="space-x-4"></nav>
                <div className="flex">
                    {/* {userData && <GithubStatsButton userData={userData} />} */}
                    {userData && <InfoDialog userData={userData} />}
                    <AuthButton />
                </div>
            </header>
        </Card>
    );
};

export default Header;
