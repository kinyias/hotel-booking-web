"use client";

import { useState } from "react";
import * as LucideIcons from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface IconExplorerProps {
  onSelect?: (icon: string) => void;
  selectedIcon?: string;
  className?: string;
}

export default function IconExplorer({ onSelect, selectedIcon, className }: IconExplorerProps) {
  const [filter, setFilter] = useState("");
  const allIcons = Object.keys(LucideIcons);

  const filteredIcons = allIcons.filter((name) =>
    name.toLowerCase().includes(filter.toLowerCase())
  );

  // Limit rendering to prevent freezing if filter is empty
  const displayIcons = filteredIcons.slice(0, 100);

  return (
    <div className={cn("p-8 border rounded-lg bg-background my-8", className)}>
      <h2 className="text-2xl font-bold mb-4">Icon Explorer</h2>
      <div className="mb-6">
        <Input
          placeholder="Search icons..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-md"
        />
        <p className="text-sm text-muted-foreground mt-2">
          Showing {displayIcons.length} of {filteredIcons.length} matches
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {displayIcons.map((name) => {
          const Icon = (LucideIcons as any)[name];
          if (!Icon) return null;
          
          // Some exports from lucide-react might not be components (e.g. types), verify simple check
          // Usually components have a render function or are functions/objects.
          // Lucide exports 'icons' which is an object, but * as imports everything including types.
          // Usually keys starting with uppercase are components.
          if (name === "icons" || name === "createReactComponent" || name === "default") return null;

          const isSelected = selectedIcon === name;

          return (
            <button
              key={name}
              type="button"
              onClick={() => onSelect?.(name)}
              className={cn(
                "flex flex-col items-center justify-center p-4 border rounded hover:bg-muted/50 transition-colors cursor-pointer",
                isSelected && "border-primary bg-primary/10 ring-2 ring-primary ring-offset-2"
              )}
            >
              <Icon className="w-8 h-8 mb-2" />
              <span className="text-xs text-center break-all">{name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
