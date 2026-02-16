"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/contexts/user-context";
import {
  Highlighter,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Highlight {
  id: string;
  user_id: string;
  book: string;
  chapter: number;
  highlighted_text: string;
  note: string | null;
  color: string;
  created_at: string;
}

interface BookOption {
  ref: string;
  title: string;
}

interface ChapterOption {
  number: number;
  title: string;
  bookRef: string;
}

const BOOKS: BookOption[] = [
  { ref: "sin", title: "The Singularity Is Nearer" },
  { ref: "si", title: "The Sovereign Individual" },
];

const HIGHLIGHT_COLORS = [
  { value: "yellow", label: "Yellow", bg: "bg-yellow-500/20", border: "border-yellow-500", dot: "bg-yellow-400" },
  { value: "green", label: "Green", bg: "bg-green-500/20", border: "border-green-500", dot: "bg-green-400" },
  { value: "blue", label: "Blue", bg: "bg-blue-500/20", border: "border-blue-500", dot: "bg-blue-400" },
  { value: "pink", label: "Pink", bg: "bg-pink-500/20", border: "border-pink-500", dot: "bg-pink-400" },
  { value: "purple", label: "Purple", bg: "bg-purple-500/20", border: "border-purple-500", dot: "bg-purple-400" },
] as const;

function getBookTitle(ref: string): string {
  return BOOKS.find((b) => b.ref === ref)?.title ?? ref;
}

function getColorConfig(color: string) {
  return (
    HIGHLIGHT_COLORS.find((c) => c.value === color) ?? HIGHLIGHT_COLORS[0]
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function HighlightsPage() {
  const { user, loading: authLoading } = useUser();

  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBook, setFilterBook] = useState("all");
  const [filterColor, setFilterColor] = useState("all");
  const [chapters, setChapters] = useState<ChapterOption[]>([]);

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(
    null
  );

  // Form state
  const [formBook, setFormBook] = useState("sin");
  const [formChapter, setFormChapter] = useState("1");
  const [formText, setFormText] = useState("");
  const [formNote, setFormNote] = useState("");
  const [formColor, setFormColor] = useState("yellow");
  const [submitting, setSubmitting] = useState(false);

  const fetchHighlights = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterBook !== "all") params.set("book", filterBook);
    if (filterColor !== "all") params.set("color", filterColor);

    const res = await fetch(`/api/highlights?${params.toString()}`);
    if (res.ok) {
      const data: Highlight[] = await res.json();
      setHighlights(data);
    }
    setLoading(false);
  }, [filterBook, filterColor]);

  const fetchChapters = useCallback(async () => {
    try {
      const res = await fetch("/api/books");
      if (res.ok) {
        const data: Array<{
          ref: string;
          chapters: Array<{ number: number; title: string; bookRef: string }>;
        }> = await res.json();
        const allChapters: ChapterOption[] = [];
        for (const book of data) {
          if (book.chapters) {
            for (const ch of book.chapters) {
              allChapters.push({
                number: ch.number,
                title: ch.title,
                bookRef: book.ref,
              });
            }
          }
        }
        setChapters(allChapters);
      }
    } catch {
      // Chapters will remain empty
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchHighlights();
      fetchChapters();
    }
  }, [user, fetchHighlights, fetchChapters]);

  const getChapterTitle = (bookRef: string, chapterNum: number): string => {
    const ch = chapters.find(
      (c) => c.bookRef === bookRef && c.number === chapterNum
    );
    return ch ? ch.title : `Chapter ${chapterNum}`;
  };

  const getChaptersForBook = (bookRef: string): ChapterOption[] => {
    return chapters.filter((c) => c.bookRef === bookRef);
  };

  const resetForm = () => {
    setFormBook("sin");
    setFormChapter("1");
    setFormText("");
    setFormNote("");
    setFormColor("yellow");
  };

  const openCreate = () => {
    resetForm();
    setCreateOpen(true);
  };

  const openEdit = (highlight: Highlight) => {
    setSelectedHighlight(highlight);
    setFormNote(highlight.note ?? "");
    setFormColor(highlight.color);
    setEditOpen(true);
  };

  const openDelete = (highlight: Highlight) => {
    setSelectedHighlight(highlight);
    setDeleteOpen(true);
  };

  const handleCreate = async () => {
    if (!formText.trim()) return;
    setSubmitting(true);

    const res = await fetch("/api/highlights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        book: formBook,
        chapter: Number(formChapter),
        highlightedText: formText.trim(),
        note: formNote.trim() || undefined,
        color: formColor,
      }),
    });

    if (res.ok) {
      setCreateOpen(false);
      resetForm();
      await fetchHighlights();
    }
    setSubmitting(false);
  };

  const handleEdit = async () => {
    if (!selectedHighlight) return;
    setSubmitting(true);

    const res = await fetch(`/api/highlights/${selectedHighlight.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        note: formNote.trim() || null,
        color: formColor,
      }),
    });

    if (res.ok) {
      setEditOpen(false);
      setSelectedHighlight(null);
      await fetchHighlights();
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!selectedHighlight) return;
    setSubmitting(true);

    const res = await fetch(`/api/highlights/${selectedHighlight.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setDeleteOpen(false);
      setSelectedHighlight(null);
      await fetchHighlights();
    }
    setSubmitting(false);
  };

  // Loading skeleton
  if (authLoading || (user && loading)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-10 w-36 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-40 bg-muted rounded animate-pulse" />
          <div className="h-10 w-40 bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">
          Please sign in to view your highlights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Highlighter className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              Highlights{" "}
              <span className="text-base font-normal text-muted-foreground">
                ({highlights.length})
              </span>
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Save and organize important passages.
            </p>
          </div>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-1.5" />
          New Highlight
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={filterBook} onValueChange={setFilterBook}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="All books" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Books</SelectItem>
            {BOOKS.map((b) => (
              <SelectItem key={b.ref} value={b.ref}>
                {b.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterColor} onValueChange={setFilterColor}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All colors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Colors</SelectItem>
            {HIGHLIGHT_COLORS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                <span className="flex items-center gap-2">
                  <span
                    className={cn("w-3 h-3 rounded-full", c.dot)}
                  />
                  {c.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Highlights list */}
      {highlights.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <Highlighter className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold text-lg mb-1">No highlights yet</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Save important passages and quotes from your reading.
          </p>
          <Button size="sm" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-1.5" />
            Create your first highlight
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {highlights.map((highlight) => {
            const colorCfg = getColorConfig(highlight.color);

            return (
              <div
                key={highlight.id}
                className={cn(
                  "rounded-lg border border-border bg-card overflow-hidden",
                  "border-l-4",
                  colorCfg.border
                )}
              >
                <div className="p-5">
                  {/* Highlighted text */}
                  <blockquote
                    className={cn(
                      "text-sm italic leading-relaxed mb-3 pl-3 border-l-2",
                      colorCfg.border
                    )}
                  >
                    &ldquo;{highlight.highlighted_text}&rdquo;
                  </blockquote>

                  {/* Optional note */}
                  {highlight.note && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {highlight.note}
                    </p>
                  )}

                  {/* Footer: reference + actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {getBookTitle(highlight.book)}
                      </span>
                      <span className="text-muted-foreground/50">/</span>
                      <span>
                        Ch. {highlight.chapter}:{" "}
                        {getChapterTitle(highlight.book, highlight.chapter)}
                      </span>
                      <span className="text-muted-foreground/50">|</span>
                      <span>{formatDate(highlight.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(highlight)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => openDelete(highlight)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Highlight</DialogTitle>
            <DialogDescription>
              Save an important passage from your reading.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="hl-create-book">Book</Label>
                <Select value={formBook} onValueChange={setFormBook}>
                  <SelectTrigger id="hl-create-book">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BOOKS.map((b) => (
                      <SelectItem key={b.ref} value={b.ref}>
                        {b.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hl-create-chapter">Chapter</Label>
                <Select value={formChapter} onValueChange={setFormChapter}>
                  <SelectTrigger id="hl-create-chapter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getChaptersForBook(formBook).length > 0
                      ? getChaptersForBook(formBook).map((ch) => (
                          <SelectItem
                            key={ch.number}
                            value={String(ch.number)}
                          >
                            Ch. {ch.number}: {ch.title}
                          </SelectItem>
                        ))
                      : Array.from({ length: 10 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            Chapter {i + 1}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hl-create-text">Highlighted Text</Label>
              <Textarea
                id="hl-create-text"
                placeholder="Paste or type the passage you want to highlight..."
                rows={4}
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Highlight Color</Label>
              <RadioGroup
                value={formColor}
                onValueChange={setFormColor}
                className="flex gap-3"
              >
                {HIGHLIGHT_COLORS.map((c) => (
                  <div key={c.value} className="flex items-center gap-1.5">
                    <RadioGroupItem
                      value={c.value}
                      id={`color-create-${c.value}`}
                      className={cn(
                        "border-2",
                        formColor === c.value ? c.border : "border-muted"
                      )}
                    />
                    <Label
                      htmlFor={`color-create-${c.value}`}
                      className="flex items-center gap-1 cursor-pointer text-sm"
                    >
                      <span className={cn("w-3 h-3 rounded-full", c.dot)} />
                      {c.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hl-create-note">Note (optional)</Label>
              <Textarea
                id="hl-create-note"
                placeholder="Add a note about this highlight..."
                rows={2}
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={submitting || !formText.trim()}
            >
              {submitting ? "Creating..." : "Create Highlight"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Highlight</DialogTitle>
            <DialogDescription>
              Update the color or note for this highlight.
            </DialogDescription>
          </DialogHeader>
          {selectedHighlight && (
            <div className="space-y-4">
              {/* Show the highlighted text as read-only */}
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <p className="text-sm italic text-muted-foreground">
                  &ldquo;{selectedHighlight.highlighted_text}&rdquo;
                </p>
              </div>
              <div className="space-y-2">
                <Label>Highlight Color</Label>
                <RadioGroup
                  value={formColor}
                  onValueChange={setFormColor}
                  className="flex gap-3"
                >
                  {HIGHLIGHT_COLORS.map((c) => (
                    <div key={c.value} className="flex items-center gap-1.5">
                      <RadioGroupItem
                        value={c.value}
                        id={`color-edit-${c.value}`}
                        className={cn(
                          "border-2",
                          formColor === c.value ? c.border : "border-muted"
                        )}
                      />
                      <Label
                        htmlFor={`color-edit-${c.value}`}
                        className="flex items-center gap-1 cursor-pointer text-sm"
                      >
                        <span
                          className={cn("w-3 h-3 rounded-full", c.dot)}
                        />
                        {c.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hl-edit-note">Note (optional)</Label>
                <Textarea
                  id="hl-edit-note"
                  placeholder="Add a note about this highlight..."
                  rows={2}
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={submitting}>
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Highlight</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this highlight? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedHighlight && (
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <p className="text-sm italic text-muted-foreground line-clamp-3">
                &ldquo;{selectedHighlight.highlighted_text}&rdquo;
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
