import { EnergySide, MoneySide, Suggestion, CustomRules } from "./types";

// --- Keywords & Scoring ---

const MONEY_TAKES_KEYWORDS = new Set([
  "rent", "bill", "tax", "subscription", "fee", "pay", "purchase", "buy", 
  "expense", "insurance", "debt", "interest", "groceries", "fuel", "repair", 
  "membership", "cost", "spend", "invoice"
]);

const MONEY_MAKES_KEYWORDS = new Set([
  "business", "sales", "sell", "revenue", "profit", "client", "invoice", 
  "freelance", "marketing", "close", "lead", "pitch", "ship", "launch", 
  "productize", "pricing", "raise prices", "income", "salary", "deal"
]);

const ENERGY_GIVES_KEYWORDS = new Set([
  "gym", "workout", "run", "walk", "sleep", "meditate", "family", "friends", 
  "journaling", "reading", "sunlight", "rest", "plan", "organize", "meal prep",
  "create", "write", "design", "learn", "play"
]);

const ENERGY_TAKES_KEYWORDS = new Set([
  "taxes", "paperwork", "admin", "commute", "meeting", "conflict", "argument", 
  "chores", "cleaning", "errands", "waiting", "complaint", "support", "fix",
  "debug", "traffic", "laundry", "dishes"
]);

// Hard-coded phrase boosts
const PHRASE_OVERRIDES: Record<string, { energy: EnergySide; money: MoneySide }> = {
  "file taxes": { energy: "takes", money: "takes" },
  "tax filing": { energy: "takes", money: "takes" },
  "hire va": { energy: "gives", money: "takes" }, // Outsourcing gives energy back
  "hire assistant": { energy: "gives", money: "takes" },
  "launch mvp": { energy: "takes", money: "makes" }, // Launching is hard work but makes money
  "go to gym": { energy: "gives", money: "takes" },
  "gym": { energy: "gives", money: "takes" },
  "business": { energy: "gives", money: "makes" }, // Assuming passion business
};

// --- Helper Functions ---

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .trim()
    .replace(/\s+/g, " "); // Collapse multiple spaces
}

// Simple stemming (remove "ing", "ed", "s")
function stem(word: string): string {
  if (word.endsWith("ing") && word.length > 4) return word.slice(0, -3);
  if (word.endsWith("ed") && word.length > 3) return word.slice(0, -2);
  if (word.endsWith("s") && word.length > 3) return word.slice(0, -1);
  return word;
}

// --- Main Logic ---

export function suggestClassification(
  text: string,
  customRules: CustomRules = {}
): Suggestion {
  const normalizedText = normalize(text);
  const tokens = normalizedText.split(" ");
  const stemmedTokens = tokens.map(stem);

  let energyScore = 0;
  let moneyScore = 0;
  const matched: string[] = [];
  let usedLearnedRule = false;

  // 1. Check Custom Rules (Exact Match)
  if (customRules[normalizedText]) {
    const rule = customRules[normalizedText];
    return {
      confidence: 95 + Math.min(rule.count, 5), // High confidence, boosts with usage
      matched: ["custom rule"],
      usedLearnedRule: true,
      energyScoreRaw: rule.energySide === "gives" ? 5 : -5,
      moneyScoreRaw: rule.moneySide === "makes" ? 5 : -5,
      suggestedEnergy: rule.energySide,
      suggestedMoney: rule.moneySide,
    };
  }

  // 2. Check Hard-coded Phrase Overrides
  for (const [phrase, outcome] of Object.entries(PHRASE_OVERRIDES)) {
    if (normalizedText.includes(phrase)) {
      return {
        confidence: 90,
        matched: [phrase],
        energyScoreRaw: outcome.energy === "gives" ? 4 : -4,
        moneyScoreRaw: outcome.money === "makes" ? 4 : -4,
        suggestedEnergy: outcome.energy,
        suggestedMoney: outcome.money,
      };
    }
  }

  // 3. Keyword Analysis
  // Check both original tokens and stemmed tokens
  const allTokens = Array.from(new Set([...tokens, ...stemmedTokens]));

  for (const token of allTokens) {
    // Energy
    if (ENERGY_GIVES_KEYWORDS.has(token)) {
      energyScore += 2;
      matched.push(`${token} (+E)`);
    }
    if (ENERGY_TAKES_KEYWORDS.has(token)) {
      energyScore -= 2;
      matched.push(`${token} (-E)`);
    }

    // Money
    if (MONEY_MAKES_KEYWORDS.has(token)) {
      moneyScore += 2;
      matched.push(`${token} (+M)`);
    }
    if (MONEY_TAKES_KEYWORDS.has(token)) {
      moneyScore -= 2;
      matched.push(`${token} (-M)`);
    }
  }

  // 4. Partial Match Boost from Custom Rules
  // If a token appears in a custom rule key, slight boost
  for (const token of allTokens) {
    for (const ruleKey in customRules) {
        if (ruleKey.includes(token)) {
            const rule = customRules[ruleKey];
            // Slight nudge
            energyScore += rule.energySide === "gives" ? 0.5 : -0.5;
            moneyScore += rule.moneySide === "makes" ? 0.5 : -0.5;
        }
    }
  }

  // 5. Calculate Confidence
  // Confidence is based on absolute score magnitude.
  // Max score roughly 10 (5 keywords).
  const totalMagnitude = Math.abs(energyScore) + Math.abs(moneyScore);
  // normalize to 0-100 approx
  let confidence = Math.min(Math.round((totalMagnitude / 8) * 100), 85);
  
  if (matched.length === 0) confidence = 0;

  return {
    confidence,
    matched,
    usedLearnedRule,
    energyScoreRaw: energyScore,
    moneyScoreRaw: moneyScore,
    suggestedEnergy: energyScore >= 0 ? "gives" : "takes",
    suggestedMoney: moneyScore >= 0 ? "makes" : "takes",
  };
}
