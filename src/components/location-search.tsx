import React, { useState, useRef, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { useSetAtom } from "jotai";
import { locationAtom } from "@/jotai/atoms";

interface SearchResult {
    place_id: string;
    display_name: string;
    lat: string;
    lon: string;
}

const LocationSearch = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const setLocation = useSetAtom(locationAtom);

    const debouncedSearch = useDebounce(searchQuery, 300);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setShowResults(false);
                if (!searchQuery) {
                    setIsExpanded(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [searchQuery]);

    useEffect(() => {
        const searchLocations = async () => {
            if (!debouncedSearch) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${debouncedSearch}&format=json&limit=5`
                );
                const data = await response.json();
                setResults(data.slice(0, 5));
                setShowResults(true);
            } catch (error) {
                console.error("Error searching locations:", error);
            } finally {
                setLoading(false);
            }
        };

        searchLocations();
    }, [debouncedSearch]);

    const handleLocationSelect = (result: SearchResult) => {
        setLocation({
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            zoom: 10,
        });
        setShowResults(false);
        setSearchQuery("");
        setIsExpanded(false);
    };

    return (
        <div className="relative" ref={searchRef}>
            <div className="flex items-center">
                <div
                    className={cn(
                        "relative transition-all duration-300 ease-in-out",
                        isExpanded ? "w-[300px]" : "w-9"
                    )}
                >
                    {!isExpanded ? (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-9 p-0"
                                        onClick={() => setIsExpanded(true)}
                                    >
                                        <Search
                                            style={{
                                                height: "22px",
                                                width: "22px",
                                            }}
                                        />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Search Location</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search location..."
                                className="w-full pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                onFocus={() => setShowResults(true)}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div
                className={cn(
                    "absolute z-50 w-full mt-2 rounded-md bg-background border shadow-lg transition-all duration-300 ease-in-out",
                    showResults && results.length > 0
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                )}
            >
                {loading && (
                    <div className="flex justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                )}
                {!loading &&
                    results.map((result) => (
                        <button
                            key={result.place_id}
                            className="w-full px-4 py-2 text-left hover:bg-accent/50 transition-colors"
                            onClick={() => handleLocationSelect(result)}
                        >
                            {result.display_name}
                        </button>
                    ))}
            </div>
        </div>
    );
};

export default LocationSearch;
