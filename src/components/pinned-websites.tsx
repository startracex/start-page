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

const getFaviconUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}/favicon.ico`;
  } catch {
    return "";
  }
};

export default function PinnedWebsites() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [addForm, setAddForm] = useState({ name: "", url: "", favicon: "" });
  const [editForm, setEditForm] = useState({ name: "", url: "", favicon: "" });

  useEffect(() => {
    const stored = localStorage.getItem("pinnedWebsites");
    if (stored) {
      try {
        setWebsites(JSON.parse(stored));
      } catch {
        setWebsites(defaultWebsites);
      }
    } else {
      setWebsites(defaultWebsites);
    }
  }, []);

  const handleAddWebsite = () => {
    if (!addForm.name || !addForm.url) return;

    let url = addForm.url.trim();
    if (!url.toLowerCase().startsWith("http")) {
      url = `https://${url}`;
    }

    const favicon = addForm.favicon || getFaviconUrl(url);
    const updatedWebsites = [...websites, { name: addForm.name.trim(), url, favicon }];
    setWebsites(updatedWebsites);
    localStorage.setItem("pinnedWebsites", JSON.stringify(updatedWebsites));
    setAddForm({ name: "", url: "", favicon: "" });
    setIsAddDialogOpen(false);
  };

  const handleEditWebsite = () => {
    if (editingIndex === null || !editForm.name || !editForm.url) return;

    let url = editForm.url.trim();
    if (!url.toLowerCase().startsWith("http")) {
      url = `https://${url}`;
    }

    const favicon = editForm.favicon || getFaviconUrl(url);
    const updatedWebsites = [...websites];
    updatedWebsites[editingIndex] = { name: editForm.name.trim(), url, favicon };
    setWebsites(updatedWebsites);
    localStorage.setItem("pinnedWebsites", JSON.stringify(updatedWebsites));
    setIsEditDialogOpen(false);
  };

  const openEditDialog = (index: number) => {
    setEditingIndex(index);
    setEditForm(websites[index]);
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
        <DialogContent className="max-w-[min(48rem,95vw)]">
          <DialogHeader>
            <DialogTitle>Edit Website</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-url">URL</Label>
              <Input
                id="edit-url"
                value={editForm.url}
                onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-favicon">Favicon URL</Label>
              <Input
                id="edit-favicon"
                value={editForm.favicon}
                onChange={(e) => setEditForm({ ...editForm, favicon: e.target.value })}
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
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[min(48rem,95vw)]">
            <DialogHeader>
              <DialogTitle>Add Website</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Example"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="example.com"
                  value={addForm.url}
                  onChange={(e) => setAddForm({ ...addForm, url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon URL</Label>
                <Input
                  id="favicon"
                  placeholder="example.com/favicon.ico"
                  value={addForm.favicon}
                  onChange={(e) => setAddForm({ ...addForm, favicon: e.target.value })}
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
