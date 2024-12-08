"use client";
export default function ErrorPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">Authentication Error</h1>
            <p className="mt-4">There was an error during authentication.</p>
        </div>
    );
}
