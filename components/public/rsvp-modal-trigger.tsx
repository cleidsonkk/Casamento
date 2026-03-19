"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RsvpForm } from "@/components/public/rsvp-form";

export function RsvpModalTrigger({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)} className="rounded-xl">
        Confirmar presenca
      </Button>
      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {open && (
                <motion.div
                  className="fixed inset-0 z-[120] flex items-end justify-center bg-black/50 p-0 md:items-center md:p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.98 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-w-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Card className="max-h-[92vh] min-h-[78vh] overflow-y-auto rounded-t-[2rem] border-white/75 bg-white p-4 md:min-h-0 md:rounded-3xl md:p-7">
                      <div className="sticky top-0 z-10 -mx-4 mb-4 flex items-start justify-between gap-3 border-b border-black/5 bg-white/96 px-4 pb-3 pt-1 backdrop-blur md:static md:mx-0 md:border-b-0 md:bg-transparent md:px-0 md:pb-0 md:pt-0">
                        <div className="min-w-0">
                          <p className="text-xs tracking-[0.18em] text-[var(--color-muted)]">RSVP PREMIUM</p>
                          <h3 className="text-xl md:text-2xl">Confirmar presenca em 1 minuto</h3>
                        </div>
                        <Button type="button" variant="outline" className="shrink-0 rounded-full" onClick={() => setOpen(false)}>
                          Fechar
                        </Button>
                      </div>
                      <RsvpForm slug={slug} />
                    </Card>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
