"use client";

import AuthButton from "@/app-components/auth-button";
import GithubStatsButton from "@/app-components/github-stats-button";
import SubmissionButton from "@/app-components/submission-button";
import { UserData } from "@/types/user";

interface ActionBarProps {
    userData: UserData | null;
}

const ActionBar: React.FC<ActionBarProps> = ({ userData }) => {
    return (
        <div className="absolute right-4 z-20 flex gap-2">
            {userData && <SubmissionButton userId={userData.id} />}
            {userData &&<GithubStatsButton userData={userData} />}
            <AuthButton />
        </div>
    );
};

export default ActionBar;
