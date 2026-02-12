"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Link as LinkIcon, ArrowLeftRight, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { RELATIONSHIP_COLORS } from "@/lib/constants";

interface ConnectionData {
  id: string;
  title: string;
  description: string;
  sin_theme: string;
  si_theme: string;
  relationship: "parallel" | "contrast" | "complement" | "tension";
  detailed_analysis: string | null;
}

interface CrossReference {
  id: string;
  source_concept: string;
  target_concept: string;
  relationship_type: string;
  note: string | null;
  created_at: string;
}

export default function ConnectionsPage() {
  const { user, isLoading } = useAuth();
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const [crossRefs, setCrossRefs] = useState<CrossReference[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Form state for creating cross-references
  const [showForm, setShowForm] = useState(false);
  const [formSource, setFormSource] = useState("");
  const [formTarget, setFormTarget] = useState("");
  const [formRelType, setFormRelType] = useState("parallel");
  const [formNote, setFormNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/connections")
      .then((r) => r.json())
      .then(setConnections)
      .catch(() => {});

    if (user) {
      fetch("/api/cross-references")
        .then((r) => r.json())
        .then(setCrossRefs)
        .catch(() => {});
    }
  }, [user]);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCreateCrossRef = async () => {
    if (!formSource.trim() || !formTarget.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/cross-references", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceConcept: formSource.trim(),
          targetConcept: formTarget.trim(),
          relationshipType: formRelType,
          note: formNote.trim() || null,
        }),
      });
      if (res.ok) {
        const newRef = await res.json();
        setCrossRefs((prev) => [newRef, ...prev]);
        setFormSource("");
        setFormTarget("");
        setFormNote("");
        setShowForm(false);
      }
    } catch {}
    setSubmitting(false);
  };

  const handleDeleteCrossRef = async (id: string) => {
    try {
      const res = await fetch(`/api/cross-references/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCrossRefs((prev) => prev.filter((r) => r.id !== id));
      }
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

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

      {/* User Cross-References Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Cross-References</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Source Concept</label>
                <input
                  value={formSource}
                  onChange={(e) => setFormSource(e.target.value)}
                  placeholder="e.g., Law of Accelerating Returns"
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Concept</label>
                <input
                  value={formTarget}
                  onChange={(e) => setFormTarget(e.target.value)}
                  placeholder="e.g., Megapolitical Forces"
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Relationship Type</label>
              <select
                value={formRelType}
                onChange={(e) => setFormRelType(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="parallel">Parallel</option>
                <option value="contrast">Contrast</option>
                <option value="complement">Complement</option>
                <option value="tension">Tension</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Note (optional)</label>
              <textarea
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
                placeholder="Why do you see this connection?"
                rows={2}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowForm(false)}
                className="px-3 py-1.5 rounded-md border border-border text-sm hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCrossRef}
                disabled={submitting || !formSource.trim() || !formTarget.trim()}
                className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {submitting ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        )}

        {/* List of user cross-references */}
        {crossRefs.length > 0 ? (
          <div className="space-y-3">
            {crossRefs.map((ref) => (
              <div
                key={ref.id}
                className="rounded-lg border border-border bg-card p-4 flex items-start justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{ref.source_concept}</span>
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded border font-medium capitalize",
                        RELATIONSHIP_COLORS[ref.relationship_type as keyof typeof RELATIONSHIP_COLORS] || "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      {ref.relationship_type}
                    </span>
                    <span className="text-sm font-medium">{ref.target_concept}</span>
                  </div>
                  {ref.note && (
                    <p className="text-sm text-muted-foreground mt-1">{ref.note}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteCrossRef(ref.id)}
                  className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                  title="Delete cross-reference"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          !showForm && (
            <p className="text-sm text-muted-foreground">
              You haven&apos;t created any cross-references yet. Click &ldquo;Add&rdquo; to create one.
            </p>
          )
        )}
      </div>
    </div>
  );
}
