import { Suspense, useMemo, useRef, useState } from "react";

import axios from "axios";
import { useSetAtom } from "jotai";
import { latLngToCell, cellToLatLng } from "h3-js";

import { UserData } from "@/types/user";
import { LANGUAGES } from "@/lib/languages";
import { locationAtom } from "@/jotai/atoms";
import { H3_RESOLUTION } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Loader2, MapPin, Navigation } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface InfoDialogProps {
    userData: UserData | null;
    setUserData: (userData: UserData) => void;
}

const InfoDialog = ({ userData, setUserData }: InfoDialogProps) => {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [h3Location, setH3Location] = useState("");
    const [language, setLanguage] = useState("");
    const formRef = useRef<HTMLFormElement>(null);
    const setMapLocation = useSetAtom(locationAtom);

    const handleDialogChange = (open: boolean) => {
        setIsDialogOpen(open);
        setLanguage("");
        setH3Location("");
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
                    h3Index: h3Location,
                    language,
                }
            );

            setUserData({
                ...userData,
                h3Index: h3Location,
                favoriteLanguage: language,
            });

            const [lat, lng] = cellToLatLng(h3Location);
            setMapLocation({
                lat,
                lng,
                zoom: 10,
            });

            toast({
                description:
                    response.data.message || "Data saved successfully!",
            });

            setH3Location("");
            setLanguage("");
            setIsDialogOpen(false);
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
                                <MapPin
                                    style={{
                                        height: "22px",
                                        width: "22px",
                                    }}
                                />
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
                    <DialogTitle>Manage Point</DialogTitle>
                    <DialogDescription>
                        Update your favorite programming language on the map.
                    </DialogDescription>
                </DialogHeader>

                <Suspense fallback={<div>Loading...</div>}>
                    <UpdateContent
                        formRef={formRef}
                        location={h3Location}
                        setLocation={setH3Location}
                        setLanguage={setLanguage}
                        handleFormSubmit={handleFormSubmit}
                        languages={memoizedLanguages}
                    />
                </Suspense>

                <Footer
                    toast={toast}
                    handleDialogChange={handleDialogChange}
                    location={h3Location}
                    language={language}
                    handleFormSubmit={handleFormSubmit}
                />
            </DialogContent>
        </Dialog>
    );
};

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
    const [isLoading, setIsLoading] = useState(false);

    const handleGetLocation = () => {
        if ("geolocation" in navigator) {
            setIsLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const h3Index = latLngToCell(
                        latitude,
                        longitude,
                        H3_RESOLUTION
                    );
                    setLocation(h3Index);
                    setIsLoading(false);
                },
                (error) => {
                    console.log(error);
                    setIsLoading(false);
                }
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
                    className="flex col-span-1 justify-end font-semibold"
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
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Navigation className="h-4 w-4 mr-1" />
                    )}
                </Button>

                <Label
                    htmlFor="language"
                    className=" col-span-1 flex justify-end font-semibold"
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
