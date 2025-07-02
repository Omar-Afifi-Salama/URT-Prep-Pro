
"use client";

import { useUsage } from '@/context/usage-provider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Cpu, Fuel } from 'lucide-react';

export function UsageCounter() {
    const { requests, tokens, limit, tpm_limit } = useUsage();

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
                    <p className="font-semibold">Free Tier Usage</p>
                    <p className="text-xs text-muted-foreground">Based on browser storage. Resets daily.</p>
                    <div className="mt-2 space-y-1.5 text-xs">
                        <div className="flex justify-between gap-4">
                          <span>Daily Requests:</span>
                          <span className="font-medium">{requests} / {limit}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>Daily Tokens Used:</span>
                          <span className="font-medium">{tokens.toLocaleString()}</span>
                        </div>
                         <div className="flex justify-between gap-4">
                          <span>Tokens Per Minute:</span>
                          <span className="font-medium">Up to {tpm_limit.toLocaleString()}</span>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">The main daily limit is on requests, not tokens.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
