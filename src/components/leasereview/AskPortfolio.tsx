import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, MessageSquarePlus, Send, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScriptedReply {
  answer: string;
  sources?: { label: string; ref: string }[];
}

const SUGGESTED: { prompt: string; reply: ScriptedReply }[] = [
  {
    prompt: "List all break options exercisable in the next 12 months",
    reply: {
      answer:
        "Two break options are exercisable within the next 12 months:\n\n• **Café Roma** (Galeria Orkana) — Tenant break on 31 Mar 2026, 6-month notice, no penalty.\n• **Electronics Plus** (Galeria Orkana) — Landlord break on 15 Sep 2026, 9-month notice, 6 months base rent penalty.\n\nCombined annual rent at risk: PLN 738,000.",
      sources: [
        { label: "Café Roma lease", ref: "§8.2 p.24" },
        { label: "Electronics Plus lease", ref: "§8.5 p.26" },
      ],
    },
  },
  {
    prompt: "Which leases have bank guarantees expiring before the lease term ends?",
    reply: {
      answer:
        "Two leases have bank guarantees expiring before lease end:\n\n• **Café Roma** — guarantee expires 30 Apr 2026, lease runs to 30 Jun 2026 (2-month gap, PLN 54,000 exposure).\n• **Jewellery Co** — guarantee expires 28 Feb 2026, lease runs to 14 Jan 2026 (already at risk, PLN 28,125 exposure).\n\nRecommend issuing top-up notices within 30 days.",
      sources: [
        { label: "Café Roma guarantee", ref: "§14.1 p.30" },
        { label: "Jewellery Co guarantee", ref: "§14.1 p.31" },
      ],
    },
  },
  {
    prompt: "Show me all tenants with WAULT under 2 years",
    reply: {
      answer:
        "Four tenants currently sit below the 2-year WAULT threshold:\n\n• **Jewellery Co** — 0.4 yrs (PLN 112,500/yr)\n• **Café Roma** — 0.7 yrs (PLN 180,000/yr)\n• **Sport Zone** — 1.9 yrs (PLN 637,500/yr)\n• **Flower Boutique** — 0.3 yrs (PLN 48,000/yr)\n\nCombined annual rent at risk: PLN 978,000 (8.4% of Galeria Orkana GRI).",
      sources: [{ label: "Portfolio WAULT register", ref: "§3.1 p.6" }],
    },
  },
  {
    prompt: "Which leases are due for CPI/HICP indexation in the next quarter?",
    reply: {
      answer:
        "Six leases hit their indexation review window in the next quarter (Sep–Dec 2025):\n\n• Electronics Plus — CPI Poland, Sep 2025\n• Kids World — HICP Poland, Oct 2025\n• Optika Centrum — CPI Poland, Nov 2025\n• Anchor – Fashion, Café Roma, Sport Zone, Jewellery Co — HICP Poland, Jan 2026\n\nProjected uplift (assuming 3.1% HICP): ~PLN 92,500 incremental annual rent.",
      sources: [{ label: "Indexation schedule", ref: "§6.3 p.18" }],
    },
  },
  {
    prompt: "Summarize service charge reconciliation status across the portfolio",
    reply: {
      answer:
        "Service charge reconciliations are mixed:\n\n• 5 leases on **proportional** SC (anchor + line shops).\n• 2 leases on **fixed-cap** SC: Electronics Plus (PLN 85/m²) and Optika Centrum (PLN 90/m²) — cap exposure ~PLN 47,000/yr below reconciled cost.\n• 2024 reconciliation packs for Vivo! Piła and Ogrody are still pending tenant sign-off.",
      sources: [{ label: "SC reconciliation log", ref: "§9.4 p.22" }],
    },
  },
  {
    prompt: "Which tenants have non-standard or high-risk clauses?",
    reply: {
      answer:
        "Three flagged non-standard clauses:\n\n• **Anchor – Fashion** — 200m exclusive fashion radius (limits re-letting flexibility).\n• **Café Roma** — step rent (+3% Yr3 & Yr5) plus rent-free Annex 2 leakage.\n• **Optika Centrum** — centre-wide optical exclusivity.\n\nNo Article 777 KPC enforcement deed in place for Electronics Plus or Jewellery Co — recovery risk if default.",
      sources: [{ label: "Clause exception register", ref: "§17.1 p.41" }],
    },
  },
  {
    prompt: "What's our total bank guarantee exposure expiring in the next 90 days?",
    reply: {
      answer:
        "Guarantees expiring in next 90 days:\n\n• **Jewellery Co** — PLN 28,125 (expires 28 Feb 2026, 63 days)\n• **Mercato Anchor** (Vivo! Piła) — PLN 410,000 (expires 03 Apr 2026, 95 days)\n\nTotal exposure: **PLN 438,125** across 2 leases. Top-up notices recommended within 14 days.",
      sources: [{ label: "Guarantee register", ref: "§14.1 p.31" }],
    },
  },
  {
    prompt: "Compare effective rent vs headline rent across all leases",
    reply: {
      answer:
        "Aggregate headline rent: PLN 3,119,750/yr · effective rent: PLN 3,101,750/yr.\n\nLeakage = **PLN 18,000/yr (0.6%)**, all attributable to **Café Roma** Annex 2 rent-free arrangement (Year 2 of 5).\n\nAll other tenants currently track headline = effective. Recommend tracking 2026 step-rent activations for Café Roma (+3%) and Electronics Plus (+2.5%).",
      sources: [{ label: "Café Roma Annex 2", ref: "§4.3 p.12" }],
    },
  },
];

const FALLBACK: ScriptedReply = {
  answer:
    "I can help with that — this capability is being extended to handle any portfolio question. For now, try one of the suggested prompts above.",
};

interface Msg {
  role: "user" | "assistant";
  text: string;
  sources?: { label: string; ref: string }[];
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: number;
  messages: Msg[];
}

const STORAGE_KEY = "askportfolio.conversations.v1";
const ACTIVE_KEY = "askportfolio.active.v1";

function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Conversation[];
  } catch {
    return [];
  }
}

function newConversation(): Conversation {
  return {
    id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: "New chat",
    updatedAt: Date.now(),
    messages: [],
  };
}

export function AskPortfolio() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const existing = loadConversations();
    return existing.length > 0 ? existing : [newConversation()];
  });
  const [activeId, setActiveId] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    const stored = window.localStorage.getItem(ACTIVE_KEY);
    const existing = loadConversations();
    if (stored && existing.some((c) => c.id === stored)) return stored;
    return (existing[0]?.id) ?? "";
  });
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Ensure activeId is valid on first mount
  useEffect(() => {
    if (!activeId && conversations[0]) setActiveId(conversations[0].id);
  }, [activeId, conversations]);

  // Persist
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch {}
  }, [conversations]);
  useEffect(() => {
    try {
      if (activeId) window.localStorage.setItem(ACTIVE_KEY, activeId);
    } catch {}
  }, [activeId]);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? conversations[0],
    [conversations, activeId]
  );
  const messages = active?.messages ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, activeId]);

  const fillPrompt = (text: string) => {
    setInput(text);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const startNewChat = () => {
    const c = newConversation();
    setConversations((all) => [c, ...all]);
    setActiveId(c.id);
    setInput("");
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const deleteChat = (id: string) => {
    setConversations((all) => {
      const next = all.filter((c) => c.id !== id);
      if (next.length === 0) {
        const fresh = newConversation();
        setActiveId(fresh.id);
        return [fresh];
      }
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
  };

  const send = () => {
    const text = input.trim();
    if (!text || !active) return;
    const match = SUGGESTED.find((s) => s.prompt.toLowerCase() === text.toLowerCase());
    const reply = match?.reply ?? FALLBACK;
    const userMsg: Msg = { role: "user", text };
    const aiMsg: Msg = { role: "assistant", text: reply.answer, sources: reply.sources };
    setConversations((all) =>
      all.map((c) =>
        c.id === active.id
          ? {
              ...c,
              messages: [...c.messages, userMsg, aiMsg],
              updatedAt: Date.now(),
              title: c.messages.length === 0 ? text.slice(0, 48) : c.title,
            }
          : c
      )
    );
    setInput("");
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const sortedConversations = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 h-[calc(100vh-220px)] min-h-[520px]">
      <Card className="flex flex-col overflow-hidden">
        <div className="p-3 border-b">
          <Button onClick={startNewChat} className="w-full justify-start gap-2" variant="secondary">
            <MessageSquarePlus className="h-4 w-4" />
            New chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sortedConversations.map((c) => (
            <div
              key={c.id}
              className={cn(
                "group flex items-center gap-1 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-muted",
                c.id === activeId && "bg-muted"
              )}
              onClick={() => setActiveId(c.id)}
            >
              <span className="flex-1 truncate">{c.title || "New chat"}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(c.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                aria-label="Delete chat"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Ask anything about your lease portfolio</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Break options, guarantees, indexation dates, and more — answers cite source clauses.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              {SUGGESTED.map((s) => (
                <button
                  key={s.prompt}
                  onClick={() => fillPrompt(s.prompt)}
                  className="text-left text-xs rounded-lg border bg-card px-3 py-2.5 hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  {s.prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "flex",
                m.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                {m.text}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-foreground/10 space-y-1">
                    {m.sources.map((s, j) => (
                      <a
                        key={j}
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline mr-3"
                      >
                        Source: {s.ref} <ArrowRight className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t bg-muted/30">
        {messages.length > 0 && (
          <div className="px-3 pt-3 pb-2 border-b border-border/50 flex gap-2 overflow-x-auto">
            {SUGGESTED.map((s) => (
              <button
                key={s.prompt}
                onClick={() => fillPrompt(s.prompt)}
                className="shrink-0 text-xs rounded-full border bg-background px-3 py-1.5 hover:border-primary hover:bg-primary/5 transition-colors"
              >
                {s.prompt}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2 p-3">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={2}
            placeholder="Ask a portfolio question…"
            className="min-h-[44px] resize-none text-sm bg-background"
          />
          <Button onClick={send} disabled={!input.trim()} size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      </Card>
    </div>
  );
}