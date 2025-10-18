"use client";

import { Search } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchInput({
  placeholder,
  url,
  fetchSuggestions,
}: {
  placeholder: string;
  url: string;
  fetchSuggestions?: (query: string) => Promise<string[]>;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCancelled = false;

    if (searchQuery.trim()) {
      fetchSuggestions?.(searchQuery).then((results) => {
        if (!isCancelled) {
          setSuggestions(results);
          setShowSuggestions(true);
        }
      });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedSuggestionIndex(-1);

    return () => {
      isCancelled = true;
    };
  }, [searchQuery, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (query: string = searchQuery) => {
    query = query.trim();
    if (query) {
      window.location.href = url.replace("%s", encodeURIComponent(query));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
        handleSearch(suggestions[selectedSuggestionIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative flex-1">
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => searchQuery && setShowSuggestions(true)}
        className="text-lg h-12 pr-12"
        aria-label="Search query"
        aria-autocomplete="list"
        aria-controls="search-suggestions"
        aria-expanded={showSuggestions}
      />
      <Button
        size="icon-lg"
        onClick={() => handleSearch()}
        className="absolute right-1 top-1 h-10 w-10"
        aria-label="Search"
      >
        <Search />
      </Button>
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          id="search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              role="option"
              aria-selected={index === selectedSuggestionIndex}
              onClick={() => handleSearch(suggestion)}
              onMouseEnter={() => setSelectedSuggestionIndex(index)}
              className={`w-full text-left px-4 py-3 hover:bg-muted flex items-center gap-3 ${
                index === selectedSuggestionIndex ? "bg-muted" : ""
              }`}
            >
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="text-base">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
