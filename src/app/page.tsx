"use client";

import PinnedWebsites from "@/components/pinned-websites";
import SearchBar from "@/components/search-bar";

export default function Page() {
  return (
    <main className="min-h-screen relative overflow-y-auto flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-center text-4xl font-bold text-balance mb-12">
          Let's explore from here
        </h1>
        <SearchBar />
        <PinnedWebsites />
      </div>
      <div className="absolute bottom-1 text-muted-foreground/25 text-xs">
        <a href="https://github.com/startracex/start-page" target="_blank" rel="noreferrer">
          Made by Shiro Wang
        </a>
      </div>
    </main>
  );
}
