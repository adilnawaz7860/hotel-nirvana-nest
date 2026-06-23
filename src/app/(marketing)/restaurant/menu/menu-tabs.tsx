"use client";

import { Leaf, Drumstick, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MENU_CATEGORIES } from "@/lib/constants/menu";
import { formatINR } from "@/lib/utils/pricing";

export function MenuTabs() {
  return (
    <Tabs defaultValue={MENU_CATEGORIES[0].id}>
      <TabsList className="flex h-auto flex-wrap justify-start gap-2 bg-transparent">
        {MENU_CATEGORIES.map((cat) => (
          <TabsTrigger
            key={cat.id}
            value={cat.id}
            className="rounded-full border border-border px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
          >
            {cat.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {MENU_CATEGORIES.map((cat) => (
        <TabsContent key={cat.id} value={cat.id} className="mt-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {cat.items.map((item) => (
              <div
                key={item.name}
                className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <div>
                  <div className="flex items-center gap-2">
                    {item.isVeg ? (
                      <Leaf className="size-4 text-green-500" />
                    ) : (
                      <Drumstick className="size-4 text-red-400" />
                    )}
                    <h3 className="font-heading text-base font-semibold text-foreground">{item.name}</h3>
                    {item.isSignature && (
                      <Badge className="gap-1 bg-primary/15 text-primary">
                        <Sparkles className="size-3" /> Signature
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{item.description}</p>
                </div>
                <span className="shrink-0 font-heading font-semibold text-gradient-gold">
                  {formatINR(item.price)}
                </span>
              </div>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
