"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  Download,
  Search,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Note } from "@/lib/types";

export default function NotesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBook, setFilterBook] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Create/edit state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formBook, setFormBook] = useState("singularity");
  const [formChapter, setFormChapter] = useState(1);
  const [formContent, setFormContent] = useState("");
  const [formTags, setFormTags] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (filterBook !== "all") params.set("book", filterBook);
    const res = await fetch(`/api/notes?${params}`);
    if (res.ok) {
      const data: Note[] = await res.json();
      setNotes(data);
    }
    setLoading(false);
  }, [user, filterBook]);

  useEffect(() => {
    if (!authLoading && user) fetchNotes();
  }, [authLoading, user, fetchNotes]);

  const handleSave = async () => {
    setSaving(true);
    const body = {
      book: formBook,
      chapter: formChapter,
      content: formContent,
      tags: formTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (editingId) {
      await fetch(`/api/notes/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    setSaving(false);
    resetForm();
    fetchNotes();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    fetchNotes();
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setFormBook(note.book);
    setFormChapter(note.chapter);
    setFormContent(note.content);
    setFormTags(note.tags.join(", "));
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormBook("singularity");
    setFormChapter(1);
    setFormContent("");
    setFormTags("");
  };

  const handleExport = async () => {
    const res = await fetch("/api/notes/export");
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "study-notes.md";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const filteredNotes = notes.filter((n) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        n.content.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Notes</h1>
            <p className="text-xs text-muted-foreground">
              {notes.length} note{notes.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={notes.length === 0}
            className="px-3 py-1.5 text-sm rounded-md border border-border hover:bg-accent transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            New Note
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <select
          value={filterBook}
          onChange={(e) => setFilterBook(e.target.value)}
          className="px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All Books</option>
          <option value="singularity">The Singularity Is Nearer</option>
          <option value="sovereign">The Sovereign Individual</option>
        </select>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">
              {editingId ? "Edit Note" : "New Note"}
            </h3>
            <button
              onClick={resetForm}
              className="p-1 rounded hover:bg-accent transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={formBook}
              onChange={(e) => setFormBook(e.target.value)}
              className="px-3 py-2 rounded-md border border-border bg-background text-sm"
            >
              <option value="singularity">Singularity Is Nearer</option>
              <option value="sovereign">Sovereign Individual</option>
            </select>
            <input
              type="number"
              min={1}
              max={20}
              value={formChapter}
              onChange={(e) => setFormChapter(Number(e.target.value))}
              placeholder="Chapter"
              className="px-3 py-2 rounded-md border border-border bg-background text-sm"
            />
          </div>
          <textarea
            value={formContent}
            onChange={(e) => setFormContent(e.target.value)}
            placeholder="Write your note..."
            rows={5}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
          />
          <input
            value={formTags}
            onChange={(e) => setFormTags(e.target.value)}
            placeholder="Tags (comma-separated)"
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <button
            onClick={handleSave}
            disabled={!formContent.trim() || saving}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {editingId ? "Update" : "Save"} Note
          </button>
        </div>
      )}

      {/* Notes list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-muted/50 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {searchQuery
              ? "No notes match your search."
              : "No notes yet. Start taking notes as you study!"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="rounded-lg border border-border bg-card p-4 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      "text-[10px] uppercase font-medium px-1.5 py-0.5 rounded",
                      note.book === "singularity"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-amber-500/20 text-amber-400"
                    )}
                  >
                    {note.book === "singularity" ? "SIN" : "SI"} Ch.
                    {note.chapter}
                  </span>
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(note)}
                    className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              <p className="text-[10px] text-muted-foreground">
                {new Date(note.updated_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
