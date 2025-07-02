"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
import { useGenkit } from "@genkit-ai/next/client";
import { ApiKeyDialog } from "./api-key-dialog";

export function UserNav() {
  const { apiKey } = useGenkit();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const isApiKeySet = !!apiKey;

  useEffect(() => {
    // Open the dialog on initial load if the key is not set
    if (!isApiKeySet) {
      setDialogOpen(true);
    }
  }, [isApiKeySet]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://placehold.co/40x40.png" alt="@user" data-ai-hint="user avatar" />
              <AvatarFallback>UP</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">User</p>
              <p className="text-xs leading-none text-muted-foreground">
                user@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setDialogOpen(true)}>
                Set API Key
            </DropdownMenuItem>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/login">Log out</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <ApiKeyDialog open={isDialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
