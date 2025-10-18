"use client";

import { Label } from "@radix-ui/react-label";
import blocksDomains from "dev-block-domains/domains.json" with { type: "json" };
import { Bolt, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import SearchInput from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Engine = {
  name: string;
  url: string;
  icon?: string;
  id: string;
};

const blockArgs = Object.entries(blocksDomains)
  .flatMap(([_, values]) => values.map((value) => `-site:${value}`))
  .join(" ");

const defaultEngines: Engine[] = [
  {
    name: "Bing",
    url: `https://www.bing.com/search?q=%s ${blockArgs}`,
    icon: "/bing.svg",
  },
  {
    name: "DuckDuckGo",
    url: `https://duckduckgo.com/?q= ${blockArgs}`,
    icon: "/duckduckgo.svg",
  },
  {
    name: "Google",
    url: `https://www.google.com/search?q=%s ${blockArgs}`,
    icon: "/google.svg",
  },
  {
    name: "Github",
    url: `https://github.com/search?type=repositories&q=%s`,
    icon: "/github.svg",
  },
  {
    name: "Youtube",
    url: `https://www.youtube.com/results?search_query=%s`,
    icon: "/youtube.svg",
  },
  {
    name: "Bilibili",
    url: `https://search.bilibili.com/all?keyword=%s`,
    icon: "/bilibili.svg",
  },
  {
    name: "StackOverflow",
    url: `https://stackoverflow.com/search?q=%s`,
    icon: "/stackoverflow.svg",
  },

  {
    name: "NPM",
    url: `https://www.npmjs.com/search?q=%s`,
    icon: "/npm.svg",
  },
].map((e) => ({ ...e, id: crypto.randomUUID() }));

export default function SearchBar({
  fetchSuggestions,
}: {
  fetchSuggestions?: (query: string) => Promise<string[]>;
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [engines, setEngines] = useState<Engine[]>();
  const [selectedEngine, setSelectedEngine] = useState<Engine>();

  useEffect(() => {
    const selectedEngine = localStorage.getItem("selectedEngine");
    if (selectedEngine) {
      setSelectedEngine(JSON.parse(selectedEngine));
    } else {
      setSelectedEngine(defaultEngines[0]);
    }
  }, []);

  useEffect(() => {
    const engines = localStorage.getItem("engines");
    if (engines) {
      setEngines(JSON.parse(engines));
    } else {
      setEngines(defaultEngines);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("engines", JSON.stringify(engines));
  }, [engines]);

  useEffect(() => {
    localStorage.setItem("selectedEngine", JSON.stringify(selectedEngine));
  }, [selectedEngine]);

  if (!engines || !selectedEngine) {
    return null;
  }

  const EngineImage = ({ engine }: { engine: Engine }) => (
    <img
      className="w-6 h-6"
      alt={engine.name}
      src={engine.icon || (engine.url ? `${new URL(engine.url).origin}/favicon.ico` : "/globe.svg")}
    />
  );

  return (
    <div className="relative">
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="px-4 text-lg bg-transparent"
              aria-label="Select search engine"
            >
              <EngineImage engine={selectedEngine} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {defaultEngines.map((engine) => (
              <DropdownMenuItem
                key={engine.id}
                onClick={() => setSelectedEngine(engine)}
                className="cursor-pointer text-base"
              >
                <EngineImage engine={engine} />
                <span className="ml-2">{engine.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer text-base"
              onClick={() => setOpenDialog(true)}
            >
              <Bolt className="w-6! h-6!" />

              <span className="ml-2"> Settings</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="relative flex-1">
          <SearchInput
            placeholder={`Search with ${selectedEngine.name}`}
            url={selectedEngine.url}
            fetchSuggestions={fetchSuggestions}
          />
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent
            className="overflow-y-scroll"
            style={{
              maxHeight: "calc(100vh - 4em)",
            }}
          >
            <DialogTitle>Search engine settings</DialogTitle>

            <RadioGroup
              className="gap-6"
              defaultValue={selectedEngine.id}
              onValueChange={(id) => {
                setSelectedEngine(engines.find((engine) => engine.id === id) as Engine);
              }}
            >
              {engines.map((engine) => {
                return (
                  <Label key={engine.id} className="flex items-center gap-4">
                    <div className="row-span-2 col-start-1 row-start-1">
                      <RadioGroupItem value={engine.id} />
                    </div>
                    <div className="w-full flex flex-col gap-3">
                      <Input
                        className="w-40 col-start-2 row-start-1"
                        value={engine.name}
                        onChange={(e) =>
                          setEngines(
                            engines.map((eg) =>
                              eg.id === engine.id
                                ? {
                                    ...eg,
                                    name: e.target.value,
                                  }
                                : eg,
                            ),
                          )
                        }
                      />
                      <Input
                        className="col-start-2 row-start-2"
                        value={engine.url}
                        onChange={(e) =>
                          setEngines(
                            engines.map((eg) =>
                              eg.id === engine.id ? { ...eg, url: e.target.value } : eg,
                            ),
                          )
                        }
                      />
                    </div>
                    <Button
                      className="row-span-2 col-start-3 row-start-1"
                      variant="destructive"
                      onClick={() => {
                        setEngines(engines.filter((eg) => eg.name !== engine.name));
                      }}
                    >
                      <X />
                    </Button>
                  </Label>
                );
              })}
            </RadioGroup>
            <div className="text-center">
              <Button
                className="w-18"
                size="icon"
                onClick={() => {
                  if (engines.length > 0 && engines[engines.length - 1].name === "") {
                    return;
                  }
                  setEngines([
                    ...engines,
                    { name: "", url: "", icon: "", id: crypto.randomUUID() },
                  ]);
                }}
              >
                <Plus />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
