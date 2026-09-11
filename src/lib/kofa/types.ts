export type Decision = "answer" | "refuse" | "handoff";

export type Flag =
  | "pricing"
  | "identity"
  | "commitment"
  | "out_of_scope"
  | "photo"
  | "criminal"
  | "medical_legal";

export type FaqTopic =
  | "hours"
  | "location"
  | "pricing"
  | "booking"
  | "documents"
  | "warranty"
  | "process";

export type FaqEntry = {
  id: string;
  topic: FaqTopic;
  title: string;
  question: string;
  answer: string;
  keywords: string[];
};

export type Shop = {
  name: string;
  owner: string;
  city: string;
  street: string;
  hours: string;
  closed: string;
  voice: string;
};

export type Role = "customer" | "kofa" | "owner";

export type Message = {
  id: string;
  role: Role;
  text: string;
  at: number;
  photoLabel?: string;
  decision?: Decision;
  flags?: Flag[];
  faqIds?: string[];
  ownerReason?: string;
  localGuard?: string;
};

export type Conversation = {
  id: string;
  title: string;
  startedAt: number;
  messages: Message[];
  status: "open" | "handed" | "closed";
  source: "live" | "sample";
};

export type LineReply = {
  decision: Decision;
  customerText: string;
  ownerReason: string;
  flags: Flag[];
  faqIds: string[];
  localGuard: string;
  modelUsed: boolean;
};
