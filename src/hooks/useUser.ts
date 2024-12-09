import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";

interface UserData {
    id: number;
    username: string;
    languageStats: Array<{
        language: string;
        percentage: string;
    }>;
    h3Index: string | null;
}

export function useUser() {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (!session?.user?.githubId) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `/api/users/${session.user.githubId}`
                );
                setUserData(response.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        if (status === "authenticated") {
            fetchUser();
        } else if (status === "unauthenticated") {
            setLoading(false);
        }
    }, [session, status]);

    return { userData, loading };
}
