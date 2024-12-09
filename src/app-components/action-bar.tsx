"use client";

import AuthButton from "@/app-components/auth-button";
import GithubStatsButton from "@/app-components/github-stats-button";
import SubmissionButton from "@/app-components/submission-button";

const ActionBar = () => {
    return (
        <div className="absolute right-4 z-20 flex gap-2">
            <SubmissionButton />
            <AuthButton />
            <GithubStatsButton />
        </div>
    );
};

export default ActionBar;
