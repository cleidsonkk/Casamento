"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Template = { id: string; name: string };
type Wedding = {
  title?: string;
  subtitle?: string;
  story?: string;
  location?: string;
  published?: boolean;
  isRsvpOpen?: boolean;
  rsvpRestricted?: boolean;
  templateId?: string;
};

export default function DashboardSitePage() {
  const [wedding, setWedding] = useState<Wedding>({});
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/site")
      .then((r) => r.json())
      .then((data) => {
        setWedding(data?.wedding ?? {});
        setTemplates(data?.templates ?? []);
      });
  }, []);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: fd.get("title"),
      subtitle: fd.get("subtitle"),
      story: fd.get("story"),
      location: fd.get("location"),
      published: fd.get("published") === "on",
      isRsvpOpen: fd.get("isRsvpOpen") === "on",
      rsvpRestricted: fd.get("rsvpRestricted") === "on",
      templateId: fd.get("templateId"),
    };
    const res = await fetch("/api/dashboard/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return toast.error("Save failed");
    toast.success("Site updated");
  }

  return (
    <Card className="max-w-3xl p-6">
      <h1 className="mb-4 text-3xl">Wedding site</h1>
      <form className="space-y-3" onSubmit={save}>
        <Input name="title" defaultValue={wedding.title ?? ""} placeholder="Title" />
        <Input name="subtitle" defaultValue={wedding.subtitle ?? ""} placeholder="Subtitle" />
        <Input name="location" defaultValue={wedding.location ?? ""} placeholder="Location" />
        <Textarea name="story" defaultValue={wedding.story ?? ""} placeholder="Story" />
        <select
          name="templateId"
          defaultValue={wedding.templateId ?? ""}
          className="h-11 w-full rounded-[var(--radius-input)] border bg-white px-3 text-sm"
        >
          <option value="">Current template</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
        <div className="flex gap-4 text-sm">
          <label>
            <input type="checkbox" name="published" defaultChecked={Boolean(wedding.published)} /> Published
          </label>
          <label>
            <input type="checkbox" name="isRsvpOpen" defaultChecked={Boolean(wedding.isRsvpOpen)} /> RSVP open
          </label>
          <label>
            <input type="checkbox" name="rsvpRestricted" defaultChecked={Boolean(wedding.rsvpRestricted)} /> RSVP restricted
          </label>
        </div>
        <Button>Save</Button>
      </form>
    </Card>
  );
}

