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
        Confirmar presença
      </Button>
      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {open && (
                <motion.div
                  className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4"
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
                    <Card className="max-h-[88vh] overflow-y-auto rounded-3xl border-white/75 bg-white p-5 md:p-7">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs tracking-[0.18em] text-[var(--color-muted)]">RSVP PREMIUM</p>
                          <h3 className="text-2xl">Confirmar presença em 1 minuto</h3>
                        </div>
                        <Button type="button" variant="outline" className="rounded-full" onClick={() => setOpen(false)}>
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
