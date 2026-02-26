"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      toast.error("Credenciais invalidas");
      return;
    }
    toast.success("Login efetuado");
    router.push("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-10">
      <Card className="w-full p-6">
        <p className="text-xs tracking-[0.2em] text-[var(--color-muted)]">AUREA WEDDINGS</p>
        <h1 className="mb-1 mt-2 text-3xl">Entrar no dashboard</h1>
        <p className="mb-4 text-sm text-[var(--color-muted)]">Use email e senha para acessar seu painel.</p>
        <form className="space-y-3" onSubmit={submit}>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            type="password"
            required
          />
          <Button className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Acessar"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-[var(--color-muted)]">
          Primeiro acesso?{" "}
          <a href="/register" className="font-medium text-black underline underline-offset-4">
            Criar conta de noivos
          </a>
        </p>
      </Card>
    </main>
  );
}
