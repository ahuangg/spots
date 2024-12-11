"use client";

import AuthButton from "@/app-components/auth-button";
import GithubStatsButton from "@/app-components/github-stats-button";
import { UserData } from "@/types/user";
import InfoDialog from "./info-dialog";

interface ActionBarProps {
    userData: UserData | null;
}

const ActionBar: React.FC<ActionBarProps> = ({ userData }) => {
    return (
        <div className="absolute right-4 z-20 flex gap-2">
            {userData && <GithubStatsButton userData={userData} />}
            {userData && <InfoDialog userData={userData} />}
            <AuthButton />
        </div>
    );
};

export default ActionBar;
