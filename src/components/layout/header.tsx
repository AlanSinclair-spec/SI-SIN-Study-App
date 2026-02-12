"use client";

import { Search, Menu } from "lucide-react";
import { AuthMenu } from "./auth-menu";
import { ThemeToggle } from "./theme-toggle";
import { useState } from "react";
import { MobileNav } from "./mobile-nav";

interface SearchResult {
  type: string;
  id: string;
  title: string;
  snippet: string;
  book: string;
}

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      const data: SearchResult[] = await res.json();
      setSearchResults(data);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between h-14 px-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground border border-border rounded-md hover:bg-accent transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <AuthMenu />
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery("");
              setSearchResults([]);
            }}
          />
          <div className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 rounded-lg border border-border bg-popover shadow-2xl">
            <div className="flex items-center border-b border-border px-3">
              <Search className="w-4 h-4 text-muted-foreground mr-2" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search concepts, flashcards, quotes, notes..."
                className="flex-1 h-11 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearchOpen(false);
                    setSearchQuery("");
                    setSearchResults([]);
                  }
                }}
              />
            </div>
            {searchResults.length > 0 && (
              <div className="max-h-72 overflow-y-auto p-2">
                {searchResults.map((result, i) => (
                  <a
                    key={`${result.type}-${result.id}-${i}`}
                    href={
                      result.type === "concept"
                        ? `/knowledge`
                        : result.type === "flashcard"
                        ? `/flashcards`
                        : result.type === "note"
                        ? `/notes`
                        : `/knowledge`
                    }
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="flex flex-col gap-1 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {result.type}
                      </span>
                      <span className="text-sm font-medium truncate">{result.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground truncate">
                      {result.snippet}
                    </span>
                  </a>
                ))}
              </div>
            )}
            {searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            )}
          </div>
        </>
      )}

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
