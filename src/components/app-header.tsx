import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FontToggle } from "./font-toggle";
import { UsageCounter } from "./usage-counter";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/practice" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="flex items-center gap-6 text-sm">
             <Link
              href="/welcome"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Welcome
            </Link>
            <Link
              href="/practice"
              className="transition-colors hover:text-foreground/80 text-foreground font-semibold"
            >
              Practice
            </Link>
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Dashboard
            </Link>
             <Link
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              About
            </Link>
            <Link
              href="/billing"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Billing
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <UsageCounter />
          </div>
          <nav className="flex items-center gap-2">
            <FontToggle />
            <ThemeToggle />
            <div className="ml-2">
                <UserNav />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
