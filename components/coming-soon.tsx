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

interface ComingSoonPageProps {
    onEditProfile: () => void;
}

export function ComingSoonPage({ onEditProfile }: ComingSoonPageProps) {
    return (
        <div className="w-full flex flex-col items-center">
            {/* First Screen: Coming Soon Message */}
            <div className="h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6">
                <div className="w-full max-w-2xl">
                    <Empty>
                        <EmptyHeader>
                            <EmptyTitle className="font-mono text-3xl font-black sm:text-5xl md:text-6xl lg:text-7xl text-center leading-[1.1] tracking-tight text-foreground">
                                Next Feature <br /> Coming Soon...
                            </EmptyTitle>
                            <EmptyDescription className="text-sm sm:text-lg mt-4 max-w-xs sm:max-w-md mx-auto text-muted-foreground text-center">
                                I'm working on something amazing!
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <div className="flex flex-col gap-3 sm:flex-row mt-10 w-full sm:w-auto items-center justify-center">
                                <Button
                                    onClick={onEditProfile}
                                    className="w-full sm:w-auto h-12 px-8 text-base font-medium shadow-sm active:scale-95 transition-transform"
                                >
                                    <Home className="mr-2 h-4 w-4" /> Edit Profile
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
