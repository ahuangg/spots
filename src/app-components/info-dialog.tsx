import { Suspense, useMemo, useRef, useState } from "react";

import axios from "axios";
import { useAtom } from "jotai";
import { latLngToCell } from "h3-js";

import { UserData } from "@/types/user";
import { LANGUAGES } from "@/lib/languages";
import { refreshAtom } from "@/jotai/atoms";
import { H3_RESOLUTION } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const InfoDialog = ({ userData }: { userData: UserData | null }) => {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [location, setLocation] = useState("");
    const [language, setLanguage] = useState("");
    const formRef = useRef<HTMLFormElement>(null);
    const [, setRefresh] = useAtom(refreshAtom);

    const handleDialogChange = (open: boolean) => {
        setIsDialogOpen(open);
        setLanguage("");
        setLocation("");
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userData) {
            toast({ description: "User data is not available." });
            return;
        }

        try {
            const response = await axios.post(
                `/api/users/${userData.id}/updatepoint`,
                {
                    h3Index: location,
                    language,
                }
            );

            toast({
                description:
                    response.data.message || "Data saved successfully!",
            });
            setRefresh((prev) => !prev);
        } catch {
            toast({
                description: "Failed to save data. Please try again.",
            });
        }
    };

    const memoizedLanguages = useMemo(() => LANGUAGES, []);

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
                <Button>Point</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Point</DialogTitle>
                    <DialogDescription>
                        Manage your favorite language on the map here.
                    </DialogDescription>
                </DialogHeader>
                <CurrentContent userData={userData} />
                <Suspense fallback={<div>Loading...</div>}>
                    <UpdateContent
                        formRef={formRef}
                        location={location}
                        setLocation={setLocation}
                        setLanguage={setLanguage}
                        handleFormSubmit={handleFormSubmit}
                        languages={memoizedLanguages}
                    />
                </Suspense>
                <Footer
                    toast={toast}
                    handleDialogChange={handleDialogChange}
                    location={location}
                    language={language}
                    handleFormSubmit={handleFormSubmit}
                />
            </DialogContent>
        </Dialog>
    );
};

const CurrentContent = ({ userData }: { userData: UserData | null }) => (
    <div>
        <h1>current</h1>
        <div className="flex flex-row items-center w-full gap-3">
            <Avatar>
                <AvatarImage
                    src={`https://github.com/${userData?.username}.png`}
                    alt={`@${userData?.username}`}
                />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
                <div>{userData?.h3Index || "no location"}</div>
                <div>{userData?.favoriteLanguage || "no language"}</div>
            </div>
        </div>
    </div>
);

const UpdateContent = ({
    formRef,
    location,
    setLocation,
    setLanguage,
    handleFormSubmit,
    languages,
}: {
    formRef: React.RefObject<HTMLFormElement | null>;
    location: string;
    setLocation: React.Dispatch<React.SetStateAction<string>>;
    setLanguage: React.Dispatch<React.SetStateAction<string>>;
    handleFormSubmit: (e: React.FormEvent) => void;
    languages: string[];
}) => {
    const handleGetLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const h3Index = latLngToCell(
                        latitude,
                        longitude,
                        H3_RESOLUTION
                    );
                    setLocation(h3Index);
                },
                (error) => console.log(error)
            );
        }
    };

    return (
        <div>
            <h1>Update</h1>
            <form
                ref={formRef}
                onSubmit={handleFormSubmit}
                className="grid gap-4 py-4"
            >
                <div className="grid grid-cols-3 items-center gap-2">
                    <Label htmlFor="location" className="self-center">
                        Location
                    </Label>
                    <Input
                        value={location}
                        placeholder="Get Location"
                        className="col-span-1"
                        readOnly
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleGetLocation}
                    >
                        Get
                    </Button>
                </div>
                <div className="grid grid-cols-3 items-center gap-2">
                    <Label htmlFor="language" className="self-center">
                        Language
                    </Label>
                    <Select onValueChange={setLanguage}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map((language) => (
                                <SelectItem key={language} value={language}>
                                    {language}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </form>
        </div>
    );
};

const Footer = ({
    toast,
    handleDialogChange,
    location,
    language,
    handleFormSubmit,
}: {
    toast: (options: { description: string }) => void;
    handleDialogChange: (isOpen: boolean) => void;
    location: string;
    language: string;
    handleFormSubmit: (e: React.FormEvent) => void;
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        handleFormSubmit(e);
        toast({
            description: "Saving your favorite language to the H3 index.",
        });
        handleDialogChange(false);
    };

    return (
        <DialogFooter>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline" disabled={!location || !language}>
                        Update
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            <DialogDescription>
                                This action cannot be undone. Your
                                location&apos;s H3 index will be permanently
                                stored on our servers.
                            </DialogDescription>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DialogFooter>
    );
};

export default InfoDialog;
