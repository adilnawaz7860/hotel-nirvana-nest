"use client";

import { Languages } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LANGUAGE_OPTIONS = [
  { code: "en" as const, label: "English" },
  { code: "hi" as const, label: "हिन्दी" },
];

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className={cn("gap-1.5 text-foreground/80 hover:text-primary hover:bg-foreground/5", className)}
          >
            <Languages className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wide">{locale}</span>
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="min-w-32">
        {LANGUAGE_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.code}
            onClick={() => setLocale(option.code)}
            className={cn(option.code === locale && "text-primary font-medium")}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
