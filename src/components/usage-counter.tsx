
"use client";

import { useUsage } from '@/context/usage-provider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Cpu, Fuel } from 'lucide-react';

export function UsageCounter() {
    const { requests, tokens, limit } = useUsage();

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center gap-4 text-sm font-mono text-muted-foreground">
                            <div className="flex items-center gap-1.5" aria-label={`${tokens.toLocaleString()} tokens used today`}>
                            <Cpu className="h-4 w-4" />
                            <span>{tokens.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5" aria-label={`${requests} of ${limit} requests used today`}>
                            <Fuel className="h-4 w-4" />
                            <span>{requests}/{limit}</span>
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="font-semibold">Daily API Usage (Free Tier)</p>
                    <p className="text-xs text-muted-foreground">Resets daily.</p>
                    <div className="mt-2 space-y-1 text-xs">
                        <p>Tokens Used: {tokens.toLocaleString()}</p>
                        <p>Requests Used: {requests} of {limit}</p>
                    </div>
                        <p className="text-xs text-muted-foreground mt-2">Based on browser storage.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
