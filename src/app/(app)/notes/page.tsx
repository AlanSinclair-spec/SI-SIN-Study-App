"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/contexts/user-context";
import {
  StickyNote,
  Plus,
  Search,
  Pencil,
  Trash2,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

interface Note {
  id: string;
  user_id: string;
  book: string;
  chapter: number;
  section: string | null;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
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

function getBookTitle(ref: string): string {
  return BOOKS.find((b) => b.ref === ref)?.title ?? ref;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NotesPage() {
  const { user, loading: authLoading } = useUser();

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBook, setFilterBook] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [chapters, setChapters] = useState<ChapterOption[]>([]);

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Form state
  const [formBook, setFormBook] = useState("sin");
  const [formChapter, setFormChapter] = useState("1");
  const [formContent, setFormContent] = useState("");
  const [formSection, setFormSection] = useState("");
  const [formTags, setFormTags] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterBook !== "all") {
      params.set("book", filterBook);
    }
    const res = await fetch(`/api/notes?${params.toString()}`);
    if (res.ok) {
      const data: Note[] = await res.json();
      setNotes(data);
    }
    setLoading(false);
  }, [filterBook]);

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
      // Chapters will remain empty; selectors will show numbers only
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotes();
      fetchChapters();
    }
  }, [user, fetchNotes, fetchChapters]);

  const getChapterTitle = (bookRef: string, chapterNum: number): string => {
    const ch = chapters.find(
      (c) => c.bookRef === bookRef && c.number === chapterNum
    );
    return ch ? ch.title : `Chapter ${chapterNum}`;
  };

  const getChaptersForBook = (bookRef: string): ChapterOption[] => {
    return chapters.filter((c) => c.bookRef === bookRef);
  };

  const filteredNotes = notes.filter((note) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        note.content.toLowerCase().includes(query) ||
        note.tags.some((t) => t.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const toggleExpanded = (id: string) => {
    setExpandedNotes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const resetForm = () => {
    setFormBook("sin");
    setFormChapter("1");
    setFormContent("");
    setFormSection("");
    setFormTags("");
  };

  const openCreate = () => {
    resetForm();
    setCreateOpen(true);
  };

  const openEdit = (note: Note) => {
    setSelectedNote(note);
    setFormBook(note.book);
    setFormChapter(String(note.chapter));
    setFormContent(note.content);
    setFormSection(note.section ?? "");
    setFormTags(note.tags.join(", "));
    setEditOpen(true);
  };

  const openDelete = (note: Note) => {
    setSelectedNote(note);
    setDeleteOpen(true);
  };

  const handleCreate = async () => {
    if (!formContent.trim()) return;
    setSubmitting(true);
    const tags = formTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        book: formBook,
        chapter: Number(formChapter),
        content: formContent.trim(),
        section: formSection.trim() || undefined,
        tags,
      }),
    });

    if (res.ok) {
      setCreateOpen(false);
      resetForm();
      await fetchNotes();
    }
    setSubmitting(false);
  };

  const handleEdit = async () => {
    if (!selectedNote || !formContent.trim()) return;
    setSubmitting(true);
    const tags = formTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const res = await fetch(`/api/notes/${selectedNote.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: formContent.trim(),
        section: formSection.trim() || null,
        tags,
      }),
    });

    if (res.ok) {
      setEditOpen(false);
      setSelectedNote(null);
      await fetchNotes();
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!selectedNote) return;
    setSubmitting(true);
    const res = await fetch(`/api/notes/${selectedNote.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setDeleteOpen(false);
      setSelectedNote(null);
      await fetchNotes();
    }
    setSubmitting(false);
  };

  const exportNotes = () => {
    const grouped: Record<string, Record<number, Note[]>> = {};
    for (const note of notes) {
      if (!grouped[note.book]) grouped[note.book] = {};
      if (!grouped[note.book][note.chapter]) grouped[note.book][note.chapter] = [];
      grouped[note.book][note.chapter].push(note);
    }

    let md = "# My Study Notes\n";

    for (const book of BOOKS) {
      const bookNotes = grouped[book.ref];
      if (!bookNotes) continue;

      md += `\n## ${book.title}\n`;

      const chapterNums = Object.keys(bookNotes)
        .map(Number)
        .sort((a, b) => a - b);

      for (const chNum of chapterNums) {
        const chTitle = getChapterTitle(book.ref, chNum);
        md += `\n### Chapter ${chNum}: ${chTitle}\n`;

        const chapterNotes = bookNotes[chNum];
        for (let i = 0; i < chapterNotes.length; i++) {
          md += `\n${chapterNotes[i].content}\n`;
          if (chapterNotes[i].tags.length > 0) {
            md += `\nTags: ${chapterNotes[i].tags.join(", ")}\n`;
          }
          if (i < chapterNotes.length - 1) {
            md += "\n---\n";
          }
        }
      }
    }

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "study-notes.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Loading skeleton
  if (authLoading || (user && loading)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-10 w-28 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-40 bg-muted rounded animate-pulse" />
          <div className="h-10 flex-1 bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Please sign in to view your notes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <StickyNote className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              My Notes{" "}
              <span className="text-base font-normal text-muted-foreground">
                ({filteredNotes.length})
              </span>
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Capture and organize your study notes.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {notes.length > 0 && (
            <Button variant="outline" size="sm" onClick={exportNotes}>
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </Button>
          )}
          <Button size="sm" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-1.5" />
            New Note
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={filterBook} onValueChange={(v) => setFilterBook(v)}>
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
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Notes list */}
      {filteredNotes.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <StickyNote className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold text-lg mb-1">No notes yet</h3>
          <p className="text-muted-foreground text-sm mb-4">
            {searchQuery
              ? "No notes match your search. Try a different query."
              : "Start capturing your thoughts and insights as you study."}
          </p>
          {!searchQuery && (
            <Button size="sm" onClick={openCreate}>
              <Plus className="w-4 h-4 mr-1.5" />
              Create your first note
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => {
            const isExpanded = expandedNotes.has(note.id);
            const isLong = note.content.length > 200;
            const displayContent =
              isLong && !isExpanded
                ? note.content.slice(0, 200) + "..."
                : note.content;

            return (
              <div
                key={note.id}
                className="rounded-lg border border-border bg-card overflow-hidden"
              >
                <div className="p-5">
                  {/* Book + Chapter reference */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {getBookTitle(note.book)}
                      </span>
                      <span className="text-muted-foreground/50">/</span>
                      <span>
                        Ch. {note.chapter}: {getChapterTitle(note.book, note.chapter)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(note)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => openDelete(note)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {displayContent}
                  </p>

                  {isLong && (
                    <button
                      onClick={() => toggleExpanded(note.id)}
                      className="text-xs text-primary hover:underline mt-2 flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>
                          Show less <ChevronUp className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          Show more <ChevronDown className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  )}

                  {/* Tags + Date */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-wrap gap-1.5">
                      {note.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatDate(note.created_at)}
                    </span>
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
            <DialogTitle>New Note</DialogTitle>
            <DialogDescription>
              Add a new study note for a specific book and chapter.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="create-book">Book</Label>
                <Select value={formBook} onValueChange={setFormBook}>
                  <SelectTrigger id="create-book">
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
                <Label htmlFor="create-chapter">Chapter</Label>
                <Select value={formChapter} onValueChange={setFormChapter}>
                  <SelectTrigger id="create-chapter">
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
              <Label htmlFor="create-section">Section (optional)</Label>
              <Input
                id="create-section"
                placeholder="e.g., Key Arguments, Summary"
                value={formSection}
                onChange={(e) => setFormSection(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-content">Note Content</Label>
              <Textarea
                id="create-content"
                placeholder="Write your note here..."
                rows={6}
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-tags">Tags (comma-separated)</Label>
              <Input
                id="create-tags"
                placeholder="e.g., key-concept, important, review"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
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
              disabled={submitting || !formContent.trim()}
            >
              {submitting ? "Creating..." : "Create Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>
              Update the content, section, or tags for this note.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-section">Section (optional)</Label>
              <Input
                id="edit-section"
                placeholder="e.g., Key Arguments, Summary"
                value={formSection}
                onChange={(e) => setFormSection(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Note Content</Label>
              <Textarea
                id="edit-content"
                placeholder="Write your note here..."
                rows={6}
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                placeholder="e.g., key-concept, important, review"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={submitting || !formContent.trim()}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {selectedNote && (
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {selectedNote.content}
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
