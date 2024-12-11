import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { UserData } from "@/types/user";
import axios from "axios";

export function useUser() {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (status === "loading") return;
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

        fetchUser();
    }, [session, status]);

    return { userData, loading };
}
