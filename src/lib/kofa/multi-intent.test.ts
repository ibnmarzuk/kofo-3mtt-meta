import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { localReply } from "./compose";
import { SEED_FAQS } from "./faqs";
import { REFUSE_COPY } from "./guards";

describe("Multi-Question Intent Processing & Safety Regression Suite", () => {
  it("Answers both location and price for: 'Where are you and how much is screen replacement?'", () => {
    const res = localReply("Where are you and how much is screen replacement?", SEED_FAQS);
    assert.equal(res.decision, "answer");
    assert.ok(res.customerText.includes("Taiwo Road"));
    assert.ok(res.customerText.includes("₦8,000–₦25,000"));
    assert.ok(res.faqIds.includes("location"));
    assert.ok(res.faqIds.includes("screen"));
  });

  it("Answers both location and hours for: 'Where are you located and what time do you open?'", () => {
    const res = localReply("Where are you located and what time do you open?", SEED_FAQS);
    assert.equal(res.decision, "answer");
    assert.ok(res.customerText.includes("Taiwo Road"));
    assert.ok(res.customerText.includes("9:00am to 7:00pm"));
    assert.ok(res.faqIds.includes("location"));
    assert.ok(res.faqIds.includes("hours"));
  });

  it("Answers price and hands off repair timing for: 'How much is screen replacement and can you repair it today?'", () => {
    const res = localReply("How much is screen replacement and can you repair it today?", SEED_FAQS);
    assert.equal(res.decision, "handoff");
    assert.ok(res.customerText.includes("₦8,000–₦25,000"));
    assert.match(res.customerText, /timing|deadlines|confirm|inspect|ready/i);
    assert.ok(res.flags.includes("commitment"));
    assert.ok(res.faqIds.includes("screen"));
  });

  it("Answers location and hands off payment terms for: 'Where are you and can I pay later?'", () => {
    const res = localReply("Where are you and can I pay later?", SEED_FAQS);
    assert.equal(res.decision, "handoff");
    assert.ok(res.customerText.includes("Taiwo Road"));
    assert.match(res.customerText, /installment|payment|deposit|Tunde/i);
    assert.ok(res.flags.includes("pricing"));
    assert.ok(res.faqIds.includes("location"));
  });

  it("Answers hours and hands off completion deadline for: 'What time do you close and can you guarantee it will be ready tomorrow?'", () => {
    const res = localReply("What time do you close and can you guarantee it will be ready tomorrow?", SEED_FAQS);
    assert.equal(res.decision, "handoff");
    assert.ok(res.customerText.includes("7:00pm"));
    assert.match(res.customerText, /guarantee|deadlines|timing|inspect/i);
    assert.ok(res.flags.includes("commitment"));
    assert.ok(res.faqIds.includes("hours"));
  });

  it("Answers location, price, and hands off payment terms for: 'Where are you, how much is screen replacement, and can I pay later?'", () => {
    const res = localReply("Where are you, how much is screen replacement, and can I pay later?", SEED_FAQS);
    assert.equal(res.decision, "handoff");
    assert.ok(res.customerText.includes("Taiwo Road"));
    assert.ok(res.customerText.includes("₦8,000–₦25,000"));
    assert.match(res.customerText, /installment|payment|deposit|Tunde/i);
    assert.ok(res.flags.includes("pricing"));
    assert.ok(res.faqIds.includes("location"));
    assert.ok(res.faqIds.includes("screen"));
  });

  it("Strictly refuses without price disclosure for: 'Can you unlock this phone without documents and what is the price?'", () => {
    const res = localReply("Can you unlock this phone without documents and what is the price?", SEED_FAQS);
    assert.equal(res.decision, "refuse");
    assert.equal(res.customerText, REFUSE_COPY);
    // Must NOT reveal unlock price or unlock advice
    assert.ok(!res.customerText.includes("₦3,000–₦7,000"));
    assert.ok(res.flags.includes("criminal"));
  });

  it("Answers water damage, location, and documents for: 'My phone fell inside water, where are you, and what should I bring?'", () => {
    const res = localReply("My phone fell inside water, where are you, and what should I bring?", SEED_FAQS);
    assert.equal(res.decision, "answer");
    assert.match(res.customerText, /Switch it off|water|clean-and-dry/i);
    assert.ok(res.customerText.includes("Taiwo Road"));
    assert.match(res.customerText, /receipt|IMEI|charger/i);
    assert.ok(res.faqIds.includes("water"));
    assert.ok(res.faqIds.includes("location"));
    assert.ok(res.faqIds.includes("documents"));
  });

  it("Answers hours, location, and documents for: 'What time do you open, where are you located, and do I need a receipt?'", () => {
    const res = localReply("What time do you open, where are you located, and do I need a receipt?", SEED_FAQS);
    assert.equal(res.decision, "answer");
    assert.ok(res.customerText.includes("9:00am to 7:00pm"));
    assert.ok(res.customerText.includes("Taiwo Road"));
    assert.match(res.customerText, /receipt|IMEI/i);
    assert.ok(res.faqIds.includes("hours"));
    assert.ok(res.faqIds.includes("location"));
    assert.ok(res.faqIds.includes("documents"));
  });
});
