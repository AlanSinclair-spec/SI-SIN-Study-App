"use client";

import { useEffect, useState } from "react";
import { Link as LinkIcon, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { RELATIONSHIP_COLORS } from "@/lib/constants";

interface ConnectionData {
  id: number;
  title: string;
  description: string;
  sin_theme: string;
  si_theme: string;
  relationship: "parallel" | "contrast" | "complement" | "tension";
  detailed_analysis: string | null;
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch("/api/connections")
      .then((r) => r.json())
      .then(setConnections);
  }, []);

  const toggleExpanded = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <LinkIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Cross-Book Connections</h1>
            <p className="text-muted-foreground mt-0.5">
              How The Singularity Is Nearer and The Sovereign Individual relate.
            </p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {(["parallel", "contrast", "complement", "tension"] as const).map((rel) => (
          <span
            key={rel}
            className={cn(
              "text-xs px-2 py-1 rounded border font-medium capitalize",
              RELATIONSHIP_COLORS[rel]
            )}
          >
            {rel}
          </span>
        ))}
      </div>

      {/* Connection cards */}
      <div className="space-y-4">
        {connections.map((conn) => (
          <div
            key={conn.id}
            className="rounded-lg border border-border bg-card overflow-hidden"
          >
            <button
              onClick={() => toggleExpanded(conn.id)}
              className="w-full text-left p-5 hover:bg-accent/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-lg">{conn.title}</h3>
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded border font-medium capitalize flex-shrink-0",
                    RELATIONSHIP_COLORS[conn.relationship]
                  )}
                >
                  {conn.relationship}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{conn.description}</p>

              {/* Two-column theme display */}
              <div className="grid md:grid-cols-2 gap-3 mt-4">
                <div className="rounded-md bg-blue-500/5 border border-blue-500/20 p-3">
                  <p className="text-[10px] uppercase font-medium text-blue-400 mb-1">
                    The Singularity Is Nearer
                  </p>
                  <p className="text-sm">{conn.sin_theme}</p>
                </div>
                <div className="rounded-md bg-amber-500/5 border border-amber-500/20 p-3">
                  <p className="text-[10px] uppercase font-medium text-amber-400 mb-1">
                    The Sovereign Individual
                  </p>
                  <p className="text-sm">{conn.si_theme}</p>
                </div>
              </div>
            </button>

            {expanded.has(conn.id) && conn.detailed_analysis && (
              <div className="border-t border-border p-5 bg-muted/20">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowLeftRight className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-medium">Detailed Analysis</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {conn.detailed_analysis}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
