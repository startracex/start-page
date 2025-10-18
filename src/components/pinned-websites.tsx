"use client";

import { Pencil, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const defaultWebsites = [
  {
    name: "GitHub",
    url: "https://github.com",
    favicon: "https://github.com/favicon.ico",
  },
  {
    name: "MDN",
    url: "https://developer.mozilla.org",
    favicon: "https://developer.mozilla.org/favicon.ico",
  },
];

interface Website {
  name: string;
  url: string;
  favicon: string;
}

export default function PinnedWebsites() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newWebsite, setNewWebsite] = useState({
    name: "",
    url: "",
    favicon: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("pinnedWebsites");
    if (stored) {
      setWebsites(JSON.parse(stored));
    } else {
      setWebsites(defaultWebsites);
    }
  }, []);

  const handleAddWebsite = () => {
    if (newWebsite.name && newWebsite.url) {
      const url = newWebsite.url.toLowerCase().startsWith("http")
        ? newWebsite.url
        : `https://${newWebsite.url}`;
      const favicon = newWebsite.favicon || `${new URL(url).origin}/favicon.ico`;
      const updatedWebsites = [...websites, { name: newWebsite.name, url, favicon }];
      setWebsites(updatedWebsites);
      localStorage.setItem("pinnedWebsites", JSON.stringify(updatedWebsites));
      setNewWebsite({ name: "", url: "", favicon: "" });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditWebsite = () => {
    if (editingIndex !== null && newWebsite.name && newWebsite.url) {
      const url = newWebsite.url.startsWith("http") ? newWebsite.url : `https://${newWebsite.url}`;
      const favicon = newWebsite.favicon || `${new URL(url).origin}/favicon.ico`;
      const updatedWebsites = [...websites];
      updatedWebsites[editingIndex] = { name: newWebsite.name, url, favicon };
      setWebsites(updatedWebsites);
      localStorage.setItem("pinnedWebsites", JSON.stringify(updatedWebsites));
      setNewWebsite({ name: "", url: "", favicon: "" });
      setEditingIndex(null);
      setIsEditDialogOpen(false);
    }
  };

  const openEditDialog = (index: number) => {
    setEditingIndex(index);
    setNewWebsite(websites[index]);
    setIsEditDialogOpen(true);
  };

  const handleRemoveWebsite = (index: number) => {
    const updatedWebsites = websites.filter((_, i) => i !== index);
    setWebsites(updatedWebsites);
    localStorage.setItem("pinnedWebsites", JSON.stringify(updatedWebsites));
  };

  return (
    <div className="space-y-2 min-h-[200px]">
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Website</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                placeholder="GitHub"
                value={newWebsite.name}
                onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-url">URL</Label>
              <Input
                id="edit-url"
                placeholder="https://github.com"
                value={newWebsite.url}
                onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-favicon">Favicon URL</Label>
              <Input
                id="edit-favicon"
                placeholder="https://github.com/favicon.ico"
                value={newWebsite.favicon}
                onChange={(e) => setNewWebsite({ ...newWebsite, favicon: e.target.value })}
              />
            </div>
            <Button onClick={handleEditWebsite} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">Pinned Websites</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Website</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Example"
                  value={newWebsite.name}
                  onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="example.com"
                  value={newWebsite.url}
                  onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon URL</Label>
                <Input
                  id="favicon"
                  placeholder="example.com/favicon.ico"
                  value={newWebsite.favicon}
                  onChange={(e) =>
                    setNewWebsite({
                      ...newWebsite,
                      favicon: e.target.value,
                    })
                  }
                />
              </div>
              <Button onClick={handleAddWebsite} className="w-full">
                Add Website
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {websites.map((website, index) => (
          <div
            key={index}
            className="group relative bg-ycard border-2 border-primary/0 hover:border-primary/40 rounded-lg p-3 bg-muted/50"
          >
            <a
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={website.favicon || "/placeholder.svg"}
                  alt={website.name}
                  className="w-6 h-6"
                  onError={(e) => {
                    e.currentTarget.src = "/globe.svg";
                  }}
                />
              </div>
              <span className="text-xs font-medium line-clamp-2 leading-tight">{website.name}</span>
            </a>
            <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100">
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.preventDefault();
                  openEditDialog(index);
                }}
              >
                <Pencil className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveWebsite(index);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
