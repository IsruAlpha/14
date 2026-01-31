import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/ui/empty";
import { Home } from "lucide-react";

interface ComingSoonPageProps {
    onEditProfile: () => void;
}

export function ComingSoonPage({ onEditProfile }: ComingSoonPageProps) {
    return (
        <div className="w-full flex justify-center py-24 px-6 sm:py-32 sm:px-12">
            <Empty>
                <EmptyHeader>
                    <EmptyTitle className="font-mono text-3xl font-black sm:text-5xl md:text-6xl lg:text-7xl text-center leading-[1.1] tracking-tight text-gray-900">
                        Next Feature <br /> Coming Soon...
                    </EmptyTitle>
                    <EmptyDescription className="text-sm sm:text-lg mt-4 max-w-xs sm:max-w-md mx-auto text-gray-600">
                        I'm working on something amazing!
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <div className="flex flex-col gap-3 sm:flex-row mt-10 w-full sm:w-auto">
                        <Button
                            onClick={onEditProfile}
                            className="w-full sm:w-auto h-12 px-8 text-base font-medium shadow-sm active:scale-95 transition-transform"
                        >
                            <Home className="mr-2 h-4 w-4" /> Edit Profile
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            className="w-full sm:w-auto h-12 px-8 text-base font-medium bg-white shadow-sm active:scale-95 transition-transform"
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
                </EmptyContent>
            </Empty>
        </div>
    );
}
