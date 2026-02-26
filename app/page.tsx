"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_10%,#fff8ee_0%,#f6f4ef_35%,#f1eee7_100%)]">
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#f2ddbb]/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-[#ebd7b7]/40 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 py-8 md:py-10">
        <motion.header
          className="mb-10 flex items-center justify-between"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div>
            <p className="text-sm tracking-[0.24em] text-[#776a56]">CASAMENTO SAAS</p>
            <p className="text-xs text-[#8a806f]">Plataforma premium para casais e convidados</p>
          </div>
          <Link href="/login">
            <Button variant="outline" className="rounded-full px-6">
              Entrar
            </Button>
          </Link>
        </motion.header>

        <section className="grid items-center gap-8 lg:grid-cols-12">
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
          >
            <motion.p
              className="mb-4 inline-flex rounded-full border border-[#d9cfbb] bg-white/70 px-4 py-1 text-xs tracking-[0.24em] text-[#706654]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.2 }}
            >
              PADRAO 2026
            </motion.p>
            <h1 className="text-5xl leading-[0.95] md:text-7xl">
              Site de casamento
              <span className="block bg-gradient-to-r from-[#8f6324] via-[#c89748] to-[#875a1d] bg-clip-text text-transparent">
                realmente profissional
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-[#61594d]">
              RSVP inteligente, lista de presentes com Pix e dashboard completo para noivos, em uma experiencia premium e confiavel.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link href="/ana-e-bruno">
                  <Button className="rounded-full bg-[linear-gradient(110deg,#8a5d1f,#c08b36,#d8a746)] px-7 py-6 text-base text-white">
                    Ver site publicado
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link href="/dashboard">
                  <Button variant="outline" className="rounded-full px-7 py-6 text-base">
                    Abrir dashboard
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <motion.div
              className="rounded-[2rem] border border-white/80 bg-white/75 p-4 shadow-[0_40px_80px_-48px_rgba(0,0,0,.45)] backdrop-blur"
              whileHover={{ y: -4, boxShadow: "0 45px 90px -50px rgba(0,0,0,.5)" }}
              transition={{ duration: 0.25 }}
            >
              <div className="overflow-hidden rounded-3xl border border-white/70">
                <div className="h-56 bg-[url('https://images.pexels.com/photos/2959192/pexels-photo-2959192.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center" />

                <div className="grid gap-3 bg-[linear-gradient(180deg,#fffdf9,#f6efe3)] p-5 sm:grid-cols-3">
                  <div className="rounded-2xl border bg-white/90 p-4">
                    <p className="text-xs tracking-[0.14em] text-[#7b7268]">RSVP</p>
                    <p className="mt-2 text-3xl">124</p>
                    <p className="text-sm text-[#6b6358]">Confirmados</p>
                  </div>
                  <div className="rounded-2xl border bg-white/90 p-4">
                    <p className="text-xs tracking-[0.14em] text-[#7b7268]">Pedidos</p>
                    <p className="mt-2 text-3xl">37</p>
                    <p className="text-sm text-[#6b6358]">Pix gerados</p>
                  </div>
                  <div className="rounded-2xl border bg-white/90 p-4">
                    <p className="text-xs tracking-[0.14em] text-[#7b7268]">Presentes</p>
                    <p className="mt-2 text-3xl">96</p>
                    <p className="text-sm text-[#6b6358]">Itens ativos</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
