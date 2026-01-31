"use client";

import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    fullName: string;
    status: string;
    imageUrl?: string;
    onLogout?: () => void;
    onEditProfile?: () => void;
}

export function ProfileDropdown({ fullName, status, imageUrl, onLogout, onEditProfile }: ProfileDropdownProps) {
    const initials = fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="gap-2" variant="outline">
                    <Avatar className="h-6 w-6">
                        {imageUrl && <AvatarImage alt={fullName} src={imageUrl} />}
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{fullName}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-3 pb-2">
                        <Avatar className="h-10 w-10">
                            {imageUrl && <AvatarImage alt={fullName} src={imageUrl} />}
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                            <p className="font-medium text-sm leading-none">{fullName}</p>
                            <p className="text-muted-foreground text-xs leading-none">
                                {status}
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
