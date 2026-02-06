"use client";

import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Facehash } from "facehash";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileDropdownProps {
    yourName: string;
    crushName: string;
    status: string;
    imageUrl?: string;
    onLogout?: () => void;
    onEditProfile?: () => void;
}


export function ProfileDropdown({ yourName, crushName, status, imageUrl, onLogout, onEditProfile }: ProfileDropdownProps) {
    const userInitials = yourName.slice(0, 2).toUpperCase();


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="gap-2 h-10 pr-4 pl-1 rounded-full border-none bg-transparent hover:bg-black/5 dark:hover:bg-white/5 shadow-none ring-0 focus-visible:ring-0 active:scale-95 transition-all" variant="ghost">
                    <div className="h-8 w-8 overflow-hidden rounded-full border border-border/50 shadow-sm">
                        <Facehash name={yourName} size={32} colors={["#87B1F9", "#CBDCFE", "#1E40AF"]} interactive />
                    </div>

                    <span className="hidden sm:inline font-semibold text-sm">{yourName}</span>
                </Button>
            </DropdownMenuTrigger>


            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-3 p-1">
                        <div className="h-10 w-10 overflow-hidden rounded-full border border-border/50 shadow-sm">
                            <Facehash name={yourName} size={40} colors={["#87B1F9", "#CBDCFE", "#1E40AF"]} interactive />
                        </div>


                        <div className="flex flex-col space-y-1">
                            <p className="font-medium text-sm leading-none">{yourName}</p>
                            <p className="text-muted-foreground text-[10px] leading-none">
                                Crush: {crushName}
                            </p>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={onEditProfile}>
                        <User />
                        Edit Profile
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={onLogout}>
                    <LogOut />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
