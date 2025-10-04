import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bean, Mail, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// ComingSoon component for Agriboost — AI-powered crop yield predictor
// Uses shadcn components + Tailwind. Exported as default React component.

export default function ComingSoonAgriboost({ onJoin }: { onJoin?: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!email) return;
    setSent(true);
    onJoin?.(email);
    // In production: call API to save to mailing list
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 via-white to-green-100 px-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-3xl"
      >
        <header className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 p-3 shadow-lg">
              <Bean className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-emerald-900">Agriboost</h1>
              <p className="text-sm text-emerald-700/80">AI-powered crop yield predictions</p>
            </div>
          </div>
          <div className="ml-auto hidden sm:flex gap-3 items-center text-sm text-emerald-800">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">Beta</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-emerald-100">SaaS • AgriTech</span>
          </div>
        </header>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-white pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-3xl md:text-4xl text-emerald-900">Coming Soon</CardTitle>
                <CardDescription className="mt-2 text-emerald-700 max-w-xl">
                  Predict yield, optimise inputs, and level up harvests — powered by AI and agronomy.
                </CardDescription>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-sm text-emerald-700">
                  <Clock className="w-4 h-4" />
                  <span>Launching Q4</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-medium">AI</div>
                  <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-medium">Crop Models</div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-emerald-900">Smart yield forecasts</h3>
                    <p className="text-sm text-emerald-700/90">Field-level predictions using weather, satellite and soil data.</p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2 flex items-center justify-center">
                    <Bean className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-emerald-900">Actionable recommendations</h3>
                    <p className="text-sm text-emerald-700/90">Know when to fertilize, irrigate, and sow for max yield.</p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-emerald-900">Daily insights</h3>
                    <p className="text-sm text-emerald-700/90">Short, useful reports delivered straight to your inbox.</p>
                  </div>
                </li>
              </ul>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                <Input
                  type="email"
                  placeholder="Your email — join waitlist"
                  aria-label="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:w-auto flex-1"
                />

                <Button type="submit" onClick={handleSubmit} className="whitespace-nowrap">
                  {sent ? "You're on the list ✅" : "Join waitlist"}
                </Button>
              </form>

              <p className="mt-3 text-xs text-emerald-600">We’ll only send product updates — no spam. Built with 🌱 + AI.</p>
            </div>

            <div className="rounded-2xl p-6 bg-gradient-to-br from-emerald-50/60 to-white shadow-inner">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-full h-40 rounded-lg border-2 border-dashed border-emerald-100 bg-white/70 flex items-center justify-center">
                  <div className="text-center">
                    <h4 className="text-2xl font-semibold text-emerald-900">Live demo preview</h4>
                    <p className="mt-2 text-sm text-emerald-700">Simple view of what Agriboost will show — per-field predictions, trend lines and suggestions.</p>
                  </div>
                </div>

                <div className="w-full grid grid-cols-3 gap-2 mt-3">
                  <div className="p-3 rounded-lg bg-white shadow-sm text-center">
                    <div className="text-xs text-emerald-700 font-medium">Field</div>
                    <div className="mt-1 text-lg font-semibold text-emerald-900">A1</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white shadow-sm text-center">
                    <div className="text-xs text-emerald-700 font-medium">Yield</div>
                    <div className="mt-1 text-lg font-semibold text-emerald-900">4.2 t/ha</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white shadow-sm text-center">
                    <div className="text-xs text-emerald-700 font-medium">Conf.</div>
                    <div className="mt-1 text-lg font-semibold text-emerald-900">87%</div>
                  </div>
                </div>

                <div className="mt-4 w-full flex items-center justify-center">
                  <div className="h-2 w-full bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400" style={{ width: "72%" }} />
                  </div>
                </div>

                <div className="mt-2 text-xs text-emerald-700">Model confidence estimate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <footer className="mt-6 text-center text-sm text-emerald-700">
          <span>Questions? </span>
          <a href="#" className="underline">Contact Sales</a>
          <span className="mx-2">•</span>
          <a href="#" className="underline">Privacy</a>
        </footer>
      </motion.div>
    </div>
  );
}
