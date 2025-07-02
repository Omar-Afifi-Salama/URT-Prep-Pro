"use client";

import { useState } from 'react';
import { useGenkit } from '@genkit-ai/next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiKeyDialog({ open, onOpenChange }: ApiKeyDialogProps) {
  const { apiKey, setApiKey } = useGenkit();
  const [localKey, setLocalKey] = useState(apiKey || '');
  const { toast } = useToast();

  const handleSave = () => {
    if (localKey.trim()) {
      setApiKey(localKey);
      onOpenChange(false);
      toast({
        title: 'API Key Saved',
        description: 'Your Google AI API key has been saved.',
      });
    } else {
      toast({
        title: 'Invalid Key',
        description: 'Please enter a valid API key.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Google AI API Key</DialogTitle>
          <DialogDescription>
            You need to provide your own Google AI API key to use the generative features of this app. Your key is stored only in your browser.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-right">
              API Key
            </Label>
            <Input
              id="api-key"
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              className="col-span-3"
              placeholder="Enter your API key"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>
            Save Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
