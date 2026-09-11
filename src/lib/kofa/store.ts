import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "../utils";
import { SEED_FAQS } from "./faqs";
import { sampleConversations } from "./samples";
import type { Conversation, FaqEntry, LineReply, Message } from "./types";

type KofaState = {
  faqs: FaqEntry[];
  conversations: Conversation[];
  liveId: string;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  resetDemo: () => void;
  setFaqs: (faqs: FaqEntry[]) => void;
  upsertFaq: (faq: FaqEntry) => void;
  removeFaq: (id: string) => void;
  restoreFaqs: () => void;
  ensureLive: () => string;
  newLive: () => string;
  appendCustomer: (text: string, photoLabel?: string) => string;
  appendReply: (reply: LineReply) => void;
  appendOwner: (conversationId: string, text: string) => void;
  closeConversation: (id: string) => void;
};

function blankLive(): Conversation {
  return {
    id: uid("live"),
    title: "Live line",
    startedAt: Date.now(),
    messages: [],
    status: "open",
    source: "live",
  };
}

function seed() {
  const live = blankLive();
  return {
    faqs: SEED_FAQS,
    conversations: [...sampleConversations(), live],
    liveId: live.id,
  };
}

export const useKofa = create<KofaState>()(
  persist(
    (set, get) => ({
      ...seed(),
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      resetDemo: () => set({ ...seed(), hydrated: true }),
      setFaqs: (faqs) => set({ faqs }),
      upsertFaq: (faq) =>
        set({
          faqs: get().faqs.some((f) => f.id === faq.id)
            ? get().faqs.map((f) => (f.id === faq.id ? faq : f))
            : [...get().faqs, faq],
        }),
      removeFaq: (id) => set({ faqs: get().faqs.filter((f) => f.id !== id) }),
      restoreFaqs: () => set({ faqs: SEED_FAQS }),
      ensureLive: () => {
        const { liveId, conversations } = get();
        if (conversations.some((c) => c.id === liveId)) return liveId;
        const live = blankLive();
        set({ conversations: [...conversations, live], liveId: live.id });
        return live.id;
      },
      newLive: () => {
        const live = blankLive();
        set({
          conversations: [...get().conversations, live],
          liveId: live.id,
        });
        return live.id;
      },
      appendCustomer: (text, photoLabel) => {
        const id = get().ensureLive();
        const msg: Message = {
          id: uid("m"),
          role: "customer",
          text,
          at: Date.now(),
          photoLabel,
        };
        set({
          conversations: get().conversations.map((c) =>
            c.id === id
              ? {
                  ...c,
                  title:
                    c.messages.length === 0
                      ? text.slice(0, 42) || "Photo"
                      : c.title,
                  messages: [...c.messages, msg],
                }
              : c,
          ),
        });
        return id;
      },
      appendReply: (reply) => {
        const id = get().liveId;
        const msg: Message = {
          id: uid("m"),
          role: "kofa",
          text: reply.customerText,
          at: Date.now(),
          decision: reply.decision,
          flags: reply.flags,
          faqIds: reply.faqIds,
          ownerReason: reply.ownerReason,
          localGuard: reply.localGuard,
        };
        set({
          conversations: get().conversations.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status: reply.decision === "handoff" ? "handed" : c.status,
                  messages: [...c.messages, msg],
                }
              : c,
          ),
        });
      },
      appendOwner: (conversationId, text) => {
        const msg: Message = {
          id: uid("m"),
          role: "owner",
          text,
          at: Date.now(),
        };
        set({
          conversations: get().conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  status: "closed",
                  messages: [...c.messages, msg],
                }
              : c,
          ),
        });
      },
      closeConversation: (id) =>
        set({
          conversations: get().conversations.map((c) =>
            c.id === id ? { ...c, status: "closed" } : c,
          ),
        }),
    }),
    {
      name: "kofa-v1",
      skipHydration: true,
      partialize: (s) => ({
        faqs: s.faqs,
        conversations: s.conversations,
        liveId: s.liveId,
      }),
    },
  ),
);
