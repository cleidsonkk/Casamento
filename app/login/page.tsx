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
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_0%,#fff8ef_0%,#f5f1e8_45%,#ece7dc_100%)] px-4 py-8 md:px-6 md:py-10">
      <div className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-[#f1d7a5]/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-16 h-96 w-96 rounded-full bg-[#d7c3a0]/28 blur-3xl" />

      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 shadow-[0_38px_90px_-48px_rgba(0,0,0,.45)] backdrop-blur">
        <div className="grid lg:grid-cols-12">
          <section className="relative min-h-[16rem] lg:col-span-5">
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/265920/pexels-photo-265920.jpeg?auto=compress&cs=tinysrgb&w=1500')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(0,0,0,.22),rgba(0,0,0,.55))]" />
            <div className="absolute inset-x-6 bottom-6 text-white">
              <p className="text-xs tracking-[0.2em] text-white/80">AUREA WEDDINGS</p>
              <p className="mt-2 text-3xl leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                Seu painel premium
              </p>
            </div>
          </section>

          <section className="lg:col-span-7 p-5 md:p-8 lg:p-10">
            <Card className="border-white/80 bg-white/85 p-6 shadow-[0_20px_40px_-28px_rgba(0,0,0,.35)]">
              <p className="text-xs tracking-[0.2em] text-[var(--color-muted)]">ACESSO</p>
              <h1 className="mb-1 mt-2 text-3xl">Entrar no dashboard</h1>
              <p className="mb-4 text-sm text-[var(--color-muted)]">Use email e senha para acessar seu painel.</p>
              <form className="space-y-3" onSubmit={submit}>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required className="h-12 rounded-2xl bg-white/90" />
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  type="password"
                  required
                  className="h-12 rounded-2xl bg-white/90"
                />
                <Button className="h-12 w-full rounded-2xl text-base" disabled={loading}>
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
          </section>
        </div>
      </div>
    </main>
  );
}
