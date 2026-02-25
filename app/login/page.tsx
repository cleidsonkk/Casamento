"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("casal@weddingsaas.com");
  const [password, setPassword] = useState("casal123");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      toast.error("Credenciais inválidas");
      return;
    }
    toast.success("Login efetuado");
    router.push("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <Card className="w-full p-6">
        <h1 className="mb-4 text-3xl">Entrar</h1>
        <form className="space-y-3" onSubmit={submit}>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" type="password" />
          <Button className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Acessar"}
          </Button>
        </form>
      </Card>
    </main>
  );
}

