import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/ui/empty";
import { Home, ArrowDown } from "lucide-react";
import { RoundedPieChart } from "./ui/rounded-pie-chart";
import { Facehash } from "facehash";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";



interface ComingSoonPageProps {
    onEditProfile: () => void;
    crushName: string;
    crushImageUrl?: string;
}



export function ComingSoonPage({
    onEditProfile,
    crushName,
    crushImageUrl
}: ComingSoonPageProps) {

    return (
        <div className="w-full flex flex-col items-center">


            {/* First Screen: Coming Soon Message */}

            <div className="h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6">
                <div className="w-full max-w-2xl">
                    <Empty>
                        <EmptyHeader>
                            <EmptyTitle className="font-serif text-4xl font-black sm:text-5xl md:text-6xl lg:text-7xl text-center leading-[1.1] tracking-tight text-foreground">
                                Your crush replies now.
                            </EmptyTitle>
                            <EmptyDescription className="text-sm sm:text-lg mt-4 max-w-xs sm:max-w-md mx-auto text-muted-foreground text-center">
                                shoot your shot. safely.
                            </EmptyDescription>
                        </EmptyHeader>

                        <EmptyContent>
                            <div className="flex flex-col gap-3 sm:flex-row mt-10 w-full sm:w-auto items-center justify-center">
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full sm:w-auto h-auto py-2 px-4 text-base font-medium shadow-sm active:scale-95 transition-transform bg-background/50 backdrop-blur-sm border-border/40 flex items-center gap-3 rounded-2xl group"
                                >
                                    <Link href="/chat">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8 border border-border/50 shadow-sm">
                                                {crushImageUrl && <AvatarImage src={crushImageUrl} alt={crushName} />}
                                                <div className="flex items-center justify-center bg-card w-full h-full">
                                                    <Facehash name={crushName} size={32} colors={["#87B1F9", "#CBDCFE", "#1E40AF"]} interactive />
                                                </div>
                                            </Avatar>

                                            <div className="flex flex-col items-start px-2">
                                                <span className="text-sm font-semibold leading-none">{crushName}</span>
                                            </div>
                                        </div>
                                        <div className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M144,140a12,12,0,1,1-12-12A12,12,0,0,1,144,140Zm44-12a12,12,0,1,0,12,12A12,12,0,0,0,188,128Zm51.34,83.47a16,16,0,0,1-19.87,19.87l-24.71-7.27A80,80,0,0,1,86.43,183.42a79,79,0,0,1-25.19-7.35l-24.71,7.27a16,16,0,0,1-19.87-19.87l7.27-24.71A80,80,0,1,1,169.58,72.59a80,80,0,0,1,62.49,114.17ZM81.3,166.3a79.94,79.94,0,0,1,70.38-93.87A64,64,0,0,0,39.55,134.19a8,8,0,0,1,.63,6L32,168l27.76-8.17a8,8,0,0,1,6,.63A63.45,63.45,0,0,0,81.3,166.3Zm135.15,15.89a64,64,0,1,0-26.26,26.26,8,8,0,0,1,6-.63L224,216l-8.17-27.76A8,8,0,0,1,216.45,182.19Z"></path></svg>
                                        </div>
                                    </Link>
                                </Button>



                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full sm:w-auto h-12 px-8 text-base font-medium bg-transparent shadow-sm active:scale-95 transition-transform font-bold"
                                >
                                    <a href="https://x.com/IFirew91900" target="_blank" rel="noopener noreferrer">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="mr-2 h-4 w-4"
                                            fill="currentColor"
                                        >
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                        Twitter
                                    </a>
                                </Button>
                            </div>

                            <div className="mt-16 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
                                <span className="text-sm font-medium">Scroll for real-time stats</span>
                                <ArrowDown className="h-4 w-4" />
                            </div>
                        </EmptyContent>
                    </Empty>
                </div>
            </div>

            {/* Second Screen: Chart Results */}
            <div className="w-full max-w-2xl px-4 py-20 sm:px-6 sm:py-32">
                <div className="rounded-3xl border border-border/40 bg-card/30 p-4 backdrop-blur-md sm:p-8">
                    <RoundedPieChart />
                </div>
            </div>
        </div>
    );
}
