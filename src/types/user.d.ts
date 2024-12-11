export interface UserData {
    id: number;
    username: string;
    languageStats: Array<{
        language: string;
        percentage: string;
    }>;
    h3Index: string | null;
    favoriteLanguage: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface GithubLanguage {
    language: string;
    percentage: string;
}
