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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPinPlus } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

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
            <DialogTrigger>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost">
                                <MapPinPlus />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Manage Point</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Point</DialogTitle>
                    <DialogDescription>
                        Manage your favorite language on the map here.
                    </DialogDescription>
                </DialogHeader>
                <CurrentContent userData={userData} />
                <Card className="p-3">
                    <CardHeader className="p-0">
                        <CardTitle className="p-0 ">Update Point</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
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
                    </CardContent>
                    <Footer
                        toast={toast}
                        handleDialogChange={handleDialogChange}
                        location={location}
                        language={language}
                        handleFormSubmit={handleFormSubmit}
                    />
                </Card>
            </DialogContent>
        </Dialog>
    );
};

const CurrentContent = ({ userData }: { userData: UserData | null }) => (
    <div>
        <div className="flex flex-row items-center w-full gap-3">
            <Avatar>
                <AvatarImage
                    src={`https://github.com/${userData?.username}.png`}
                    alt={`@${userData?.username}`}
                />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="grid grid-cols-2 text-sm gap-0">
                <p>{"Location: "}</p>
                <p className="text-muted-foreground">
                    {userData?.h3Index || "undefined"}
                </p>
                <p>Language: </p>
                <p className="text-muted-foreground">
                    {userData?.favoriteLanguage || "no language"}
                </p>
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
        <form
            ref={formRef}
            onSubmit={handleFormSubmit}
            className="grid gap-4 py-4"
        >
            <div className="grid grid-cols-5 items-center gap-2">
                <Label
                    htmlFor="location"
                    className="flex col-span-1 justify-end"
                >
                    Location
                </Label>
                <Input
                    value={location}
                    placeholder="Get Location"
                    className="col-span-3"
                    readOnly
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleGetLocation}
                    className="col-span-1"
                >
                    Get
                </Button>

                <Label
                    htmlFor="language"
                    className=" col-span-1 flex justify-end"
                >
                    Language
                </Label>
                <div className="col-span-4">
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
                    </Select>{" "}
                </div>
            </div>
        </form>
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
