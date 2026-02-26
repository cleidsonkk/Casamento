"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Template = { id: string; name: string; key?: string; tokensJson?: Record<string, string> };
type Wedding = {
  title?: string;
  subtitle?: string;
  story?: string;
  location?: string;
  eventDate?: string;
  published?: boolean;
  isRsvpOpen?: boolean;
  rsvpRestricted?: boolean;
  templateId?: string;
};

function formatDateInput(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function applyTemplatePreview(tokens?: Record<string, string>) {
  if (!tokens) return;
  const root = document.documentElement;
  const body = document.body;
  root.style.setProperty("--color-bg", tokens.background ?? "#f8f7f4");
  root.style.setProperty("--color-card", tokens.card ?? "#ffffff");
  root.style.setProperty("--color-text", tokens.text ?? "#111111");
  root.style.setProperty("--color-muted", tokens.muted ?? "#6f6f6f");
  root.style.setProperty("--color-primary", tokens.primary ?? "#111111");
  root.style.setProperty("--color-border", tokens.border ?? "#ececec");
  root.style.setProperty("--radius-card", tokens.radiusCard ?? "1.25rem");
  root.style.setProperty("--radius-button", tokens.radiusButton ?? "999px");
  root.style.setProperty("--radius-input", tokens.radiusInput ?? "0.9rem");
  if (tokens.fontHeading) root.style.setProperty("--font-heading", tokens.fontHeading);
  if (tokens.fontBody) root.style.setProperty("--font-body", tokens.fontBody);
  body.style.background = `radial-gradient(circle at top, #ffffff 0%, ${tokens.background ?? "#f8f7f4"} 58%, #e8e8e8 100%)`;
}

export default function DashboardSitePage() {
  const [wedding, setWedding] = useState<Wedding>({});
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [coupleSlug, setCoupleSlug] = useState("");
  const [shareBase, setShareBase] = useState("");
  const router = useRouter();

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId),
    [selectedTemplateId, templates],
  );

  useEffect(() => {
    setShareBase(window.location.origin);
    fetch("/api/dashboard/site")
      .then((response) => response.json())
      .then((data) => {
        const nextWedding = data?.wedding ?? {};
        const nextTemplates = data?.templates ?? [];
        setCoupleSlug(data?.slug ?? "");
        setWedding(nextWedding);
        setTemplates(nextTemplates);
        setSelectedTemplateId(nextWedding.templateId ?? "");
        const initial = nextTemplates.find((template: Template) => template.id === nextWedding.templateId);
        applyTemplatePreview(initial?.tokensJson);
      });
  }, []);

  async function saveForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      story: formData.get("story"),
      location: formData.get("location"),
      eventDate: formData.get("eventDate"),
      published: formData.get("published") === "on",
      isRsvpOpen: formData.get("isRsvpOpen") === "on",
      rsvpRestricted: formData.get("rsvpRestricted") === "on",
      templateId: selectedTemplateId,
    };
    const res = await fetch("/api/dashboard/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return toast.error("Falha ao salvar");
    toast.success("Site atualizado");
    router.refresh();
  }

  async function saveTemplateInstant(templateId: string) {
    const res = await fetch("/api/dashboard/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId }),
    });
    if (!res.ok) return toast.error("Falha ao aplicar template");
    toast.success("Template aplicado");
    router.refresh();
  }

  const publicLink = coupleSlug ? `${shareBase}/${coupleSlug}` : "";
  const rsvpLink = coupleSlug ? `${shareBase}/${coupleSlug}/rsvp` : "";
  const giftsLink = coupleSlug ? `${shareBase}/${coupleSlug}/presentes` : "";

  async function copyLink(value: string) {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Link copiado");
    } catch {
      toast.error("Nao foi possivel copiar o link");
    }
  }

  return (
    <Card className="w-full max-w-4xl border-white/70 bg-white/75 p-4 backdrop-blur md:p-6">
      <h1 className="mb-4 text-3xl">Site do casamento</h1>
      <form className="space-y-3" onSubmit={saveForm}>
        <Input name="title" defaultValue={wedding.title ?? ""} placeholder="Titulo" />
        <Input name="subtitle" defaultValue={wedding.subtitle ?? ""} placeholder="Subtitulo" />
        <Input name="location" defaultValue={wedding.location ?? ""} placeholder="Local" />
        <Input name="eventDate" type="date" defaultValue={formatDateInput(wedding.eventDate)} />
        <Textarea name="story" defaultValue={wedding.story ?? ""} placeholder="Historia" />

        <div className="space-y-2 rounded-2xl border border-[var(--color-border)] bg-white/70 p-3">
          <p className="text-sm font-medium">Template (aplica instantaneamente)</p>
          <select
            name="templateId"
            value={selectedTemplateId}
            onChange={async (e) => {
              const id = e.target.value;
              setSelectedTemplateId(id);
              const template = templates.find((item) => item.id === id);
              applyTemplatePreview(template?.tokensJson);
              await saveTemplateInstant(id);
            }}
            className="h-11 w-full rounded-[var(--radius-input)] border bg-white px-3 text-sm"
          >
            <option value="">Selecione um template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-[var(--color-muted)]">
            {selectedTemplate ? `Template ativo: ${selectedTemplate.name}` : "Nenhum template selecionado"}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <label>
            <input type="checkbox" name="published" defaultChecked={Boolean(wedding.published)} /> Publicado
          </label>
          <label>
            <input type="checkbox" name="isRsvpOpen" defaultChecked={Boolean(wedding.isRsvpOpen)} /> RSVP aberto
          </label>
          <label>
            <input type="checkbox" name="rsvpRestricted" defaultChecked={Boolean(wedding.rsvpRestricted)} /> RSVP restrito
          </label>
        </div>

        <Button className="w-full md:w-auto">Salvar informacoes</Button>
      </form>

      <div className="mt-6 space-y-3 rounded-2xl border border-[var(--color-border)] bg-white/70 p-4">
        <h2 className="text-lg font-medium">Compartilhar com convidados</h2>
        <p className="text-sm text-[var(--color-muted)]">
          Copie os links do seu casamento e envie para os convidados.
        </p>

        {[
          { label: "Site do casal", value: publicLink },
          { label: "Confirmacao de presenca (RSVP)", value: rsvpLink },
          { label: "Lista de presentes", value: giftsLink },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border bg-white p-3">
            <p className="mb-1 text-xs tracking-[0.12em] text-[var(--color-muted)]">{item.label}</p>
            <p className="truncate text-sm">{item.value || "Carregando link..."}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button type="button" variant="outline" className="h-9 px-4" onClick={() => copyLink(item.value)}>
                Copiar link
              </Button>
              <a href={item.value || "#"} target="_blank" rel="noreferrer">
                <Button type="button" className="h-9 px-4">
                  Abrir link
                </Button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
