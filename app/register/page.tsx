"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const create = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ yourName, partnerName, email, password }),
    });
    const data = await create.json();

    if (!create.ok) {
      setLoading(false);
      toast.error(data.error ?? "Nao foi possivel criar conta");
      return;
    }

    const login = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (login?.error) {
      toast.success("Conta criada. Agora entre com seu email e senha.");
      router.push("/login");
      return;
    }

    toast.success("Conta criada com sucesso");
    router.push("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-10">
      <Card className="w-full p-6">
        <p className="text-xs tracking-[0.2em] text-[var(--color-muted)]">AUREA WEDDINGS</p>
        <h1 className="mb-1 mt-2 text-3xl">Criar conta de noivos</h1>
        <p className="mb-4 text-sm text-[var(--color-muted)]">Informe seus dados e o nome do parceiro para liberar o dashboard.</p>

        <form className="space-y-3" onSubmit={submit}>
          <Input
            value={yourName}
            onChange={(e) => setYourName(e.target.value)}
            placeholder="Seu nome"
            required
          />
          <Input
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            placeholder="Nome do parceiro(a)"
            required
          />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha (minimo 6 caracteres)"
            type="password"
            minLength={6}
            required
          />
          <Button className="w-full" disabled={loading}>
            {loading ? "Criando conta..." : "Criar conta e entrar"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-[var(--color-muted)]">
          Ja tem conta?{" "}
          <a href="/login" className="font-medium text-black underline underline-offset-4">
            Entrar
          </a>
        </p>
      </Card>
    </main>
  );
}

