export type EnergySide = "gives" | "takes";
export type MoneySide = "makes" | "takes";

export type Quadrant = "PROTECT" | "PRIORITIZE" | "DELETE" | "DELEGATE";

export interface Suggestion {
  confidence: number;
  matched: string[];
  usedLearnedRule?: boolean;
  moneyScoreRaw: number;
  energyScoreRaw: number;
  suggestedEnergy: EnergySide;
  suggestedMoney: MoneySide;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  
  energySide: EnergySide;
  moneySide: MoneySide;
  
  energyScore: number;
  moneyScore: number;
  
  source: "suggested" | "manual" | "learned";
  suggestion?: Suggestion;
}

export interface CustomRule {
  energySide: EnergySide;
  moneySide: MoneySide;
  count: number;
}

export type CustomRules = Record<string, CustomRule>;
