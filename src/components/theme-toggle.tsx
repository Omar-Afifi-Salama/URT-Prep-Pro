"use client"

import * as React from "react"
import { Palette, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const THEME_CONFIG = [
  { name: 'Default', color: 'default', swatch: 'hsl(180 100% 25.1%)' },
  { name: 'Green', color: 'green', swatch: 'hsl(142 76% 36%)' },
  { name: 'Orange', color: 'orange', swatch: 'hsl(25 95% 53%)' },
  { name: 'Blue', color: 'blue', swatch: 'hsl(217 91% 60%)' },
  { name: 'Violet', color: 'violet', swatch: 'hsl(262 82% 58%)' },
];

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
      <DropdownMenuContent align="end" className="w-48">
        {THEME_CONFIG.map(({name, color, swatch}) => (
          <DropdownMenuSub key={color}>
            <DropdownMenuSubTrigger>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: swatch }} />
                <span>{name}</span>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme(color === 'default' ? 'light' : color)}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme(color === 'default' ? 'dark' : `dark-${color}`)}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
