"use client";
import AuthButton from "@/app-components/auth-button";
import SubmissionButton from "@/app-components/submission-button";
import GithubStatsButton from "@/app-components/github-stats-button";

export default function Page() {
    return (
        <div>
            <SubmissionButton />
            <AuthButton />
            <GithubStatsButton />
        </div>
    );
}
