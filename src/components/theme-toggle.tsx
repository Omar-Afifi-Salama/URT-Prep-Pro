"use client"

import * as React from "react"
import { Palette } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Default (Light)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Default (Dark)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("orange")}>
          Orange (Light)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark-orange")}>
          Orange (Dark)
        </DropdownMenuItem>
         <DropdownMenuItem onClick={() => setTheme("green")}>
          Green (Light)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark-green")}>
          Green (Dark)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
