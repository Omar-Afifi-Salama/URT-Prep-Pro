"use client"

import * as React from "react"
import { CaseSensitive } from "lucide-react"
import { useFont } from "@/context/font-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function FontToggle() {
  const { setFont } = useFont()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <CaseSensitive className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle font</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setFont('font-sans')}>
          Inter (Sans-serif)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFont('font-serif')}>
          Lora (Serif)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFont('font-mono')}>
          Roboto Mono (Monospace)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
