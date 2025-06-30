"use client"

import * as React from "react"
import { Palette } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Light Themes</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Default
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("green")}>
          Green
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("orange")}>
          Orange
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Dark Themes</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Default
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark-green")}>
          Green
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark-orange")}>
          Orange
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
